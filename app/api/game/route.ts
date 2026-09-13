import {db} from '@/lib/db';
import {Game,Player,expireAnswers,isCorrect,makeQuestions,publicGame,settingsFrom} from '@/lib/game';
export const dynamic='force-dynamic';
export const runtime='nodejs';
const json=(data:unknown,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'no-store'}});
const tokenFor=(r:Request)=>r.headers.get('X-Player-Token')||'';
const codeFor=(s:unknown)=>typeof s==='string'?s.toUpperCase().trim():'';
const fail=(message:string,status=400)=>json({error:message},status);
async function read(code:string){const row=await db().prepare('SELECT state,version FROM games WHERE code = ? AND expires_at > ?').bind(code,Date.now()).first<{state:string|Game;version:number|string}>();if(!row)return null;return {game:(typeof row.state==='string'?JSON.parse(row.state):row.state) as Game,version:Number(row.version)};}
async function change(code:string,token:string,fn:(g:Game)=>void){for(let n=0;n<8;n++){const row=await read(code);if(!row)return fail('Kambario nėra arba jis baigė galioti. Patikrink kodą.',404);if(!row.game.players.some(p=>p.token===token))return fail('Šis telefonas neprijungtas prie kambario.',403);expireAnswers(row.game);fn(row.game);const result=await db().prepare('UPDATE games SET state = ?, version = version + 1 WHERE code = ? AND version = ?').bind(JSON.stringify(row.game),code,row.version).run();if(result.meta.changes)return json(publicGame(row.game,token));}return fail('Abu atsakėte vienu metu. Bandyk dar kartą.',409);}
export async function GET(request:Request){try{const code=codeFor(new URL(request.url).searchParams.get('code'));const token=tokenFor(request);const row=await read(code);if(!row)return fail('Kambarys nerastas arba jo laikas baigėsi.',404);if(!row.game.players.some(p=>p.token===token))return fail('Prisijunk prie kambario.',403);if(expireAnswers(row.game))return change(code,token,()=>{});return json(publicGame(row.game,token));}catch(e){console.error('game GET',e);return fail('Ryšys nutrūko. Bandome prisijungti iš naujo.',503);}}
export async function POST(request:Request){
 try{
 if(Number(request.headers.get('content-length')||0)>4096)return fail('Per ilgas prašymas.');
 const b=await request.json();const token=tokenFor(request);if(!/^[a-f0-9-]{36,80}$/.test(token))return fail('Atnaujink puslapį ir bandyk dar kartą.');const code=codeFor(b.code);
 const name=typeof b.name==='string'?b.name.trim().slice(0,20):'';
 if(b.action==='create'){
 if(!name)return fail('Įrašyk savo vardą.');const settings=settingsFrom(b.settings);const solo=b.solo===true;
 const player:Player={token,name,score:0,answers:{},ready:false};
 for(let i=0;i<5;i++){const alphabet='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';const random=crypto.getRandomValues(new Uint8Array(6));const code=Array.from(random,x=>alphabet[x%alphabet.length]).join('');const g:Game={code,solo,settings,players:[player],questions:makeQuestions(settings),index:0,status:solo?'playing':'lobby',startedAt:Date.now(),createdAt:Date.now()};const r=await db().prepare('INSERT OR IGNORE INTO games (code,state,version,expires_at) VALUES (?,?,0,?)').bind(code,JSON.stringify(g),Date.now()+86400000).run();if(r.meta.changes){await db().prepare('DELETE FROM games WHERE expires_at < ?').bind(Date.now()).run();return json(publicGame(g,token));}}
 return fail('Nepavyko sukurti kambario. Bandyk dar kartą.',503);
 }
 if(!/^[A-Z2-9]{6}$/.test(code))return fail('Kambario kodas turi būti iš 6 simbolių.');
 if(b.action==='join'){
 if(!name)return fail('Įrašyk savo vardą.');
 for(let n=0;n<8;n++){const row=await read(code);if(!row)return fail('Kambario nėra. Patikrink kodą.',404);const g=row.game;if(g.players.some(p=>p.token===token))return json(publicGame(g,token));if(g.solo||g.status!=='lobby'||g.players.length>=2)return fail('Šiame kambaryje jau žaidžiama arba nėra vietos.');g.players.push({token,name,score:0,answers:{},ready:false});const r=await db().prepare('UPDATE games SET state = ?,version = version + 1 WHERE code = ? AND version = ?').bind(JSON.stringify(g),code,row.version).run();if(r.meta.changes)return json(publicGame(g,token));}return fail('Bandyk prisijungti dar kartą.',409);
 }
 return await change(code,token,g=>{
 const p=g.players.find(p=>p.token===token)!;const q=g.questions[g.index];
 if(b.action==='start'){if(g.players[0].token!==token)throw Error('Žaidimą pradeda kambario kūrėjas.');if(g.status!=='lobby'||g.players.length!==2)throw Error('Palauk antro žaidėjo.');g.status='playing';g.startedAt=Date.now();return;}
 if(b.action==='answer'){if(g.status!=='playing'||q?.id!==b.questionId)throw Error('Klausimas jau pasikeitė.');if(p.answers[q.id])return;const text=typeof b.answer==='string'?b.answer.trim().slice(0,160):'';const correct=isCorrect(q,text);const points=correct?100+(g.solo?0:Math.max(0,Math.round(50*(1-(Date.now()-g.startedAt)/60000)))):0;p.answers[q.id]={text,correct,points};p.score+=points;return;}
 if(b.action==='next'){if(g.status!=='playing'||q?.id!==b.questionId)throw Error('Klausimas jau pasikeitė.');if(!g.players.every(p=>p.answers[q.id]))throw Error('Palauk, kol atsakys abu žaidėjai.');p.ready=true;if(g.players.every(p=>p.ready)){if(g.index===g.questions.length-1)g.status='finished';else{g.index++;g.startedAt=Date.now();for(const p of g.players)p.ready=false;}}return;}
 if(b.action==='retry'){
  if(!g.solo)throw Error('Klaidų kartojimas yra treniruotėje.');
  if(g.status!=='finished')throw Error('Pirmiausia baik žaidimą.');
  const missed=g.questions.filter(q=>!g.players[0].answers[q.id]?.correct).map(q=>({countryId:q.countryId,kind:q.kind as 'map'|'capital'}));
  if(!missed.length)throw Error('Klaidų nėra — visos teisingos.');
  g.questions=makeQuestions({...g.settings,rounds:0},missed);
  g.index=0;g.status='playing';g.startedAt=Date.now();g.round=(g.round||0)+1;
  for(const p of g.players){p.answers={};p.ready=false;p.score=0;}
  return;
 }
 throw Error('Nežinomas veiksmas.');
 });
 }catch(e){console.error('game POST',e);return fail(e instanceof Error&&!/D1|SQL|binding/i.test(e.message)?e.message:'Nepavyko išsaugoti. Tavo atsakymas liko laukelyje — bandyk dar kartą.',400);}
}
