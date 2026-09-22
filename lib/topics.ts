/**
 * Kontrolinis darbas · 1 skyrius „Valstybių gerovės skirtumai“ (34–63 psl.).
 * Sudaryta iš pamokų skaidrių: Valstybių įvairovė, Kas yra gerovė, Kas yra
 * ekonominė galia, Universalūs gerovės rodikliai, ES ir mes, Stipri ir silpna
 * Europa, Kas trukdo šalims vystytis, Kartojimas.
 *
 * `accept` – papildomi teisingi rašytiniai atsakymai. Dalis su „+“ reiškia,
 * kad atsakyme turi būti visos dalys (bet kokia tvarka).
 * `wrong` – klaidingi variantai pasirinkimams. `choiceOnly` – klausimas visada
 * rodomas su pasirinkimais, nes atsakymas per ilgas rašyti.
 */
export type Topic = {
  id: string;
  section: string;
  q: string;
  a: string;
  accept?: string[];
  wrong?: string[];
  choiceOnly?: boolean;
  note?: string;
};

export const KD1_TITLE = "Kontrolinis darbas · 1 skyrius";
export const KD1_PAGES = "34–63 psl.";

const S1 = "Valstybių įvairovė";
const S2 = "Kas yra gerovė";
const S3 = "Kas yra ekonominė galia";
const S4 = "Universalūs gerovės rodikliai";
const S5 = "Europos Sąjunga ir mes";
const S6 = "Stipri ir silpna Europa";
const S7 = "Kas trukdo šalims vystytis";
const S8 = "Kongo DR ir Bangladešas";
const S9 = "Europos ribos";

const MASLOU = ["Fiziologiniai", "Saugumo", "Socialiniai", "Pagarbos", "Savirealizacijos"];
const MASLOU_FORMS: Record<string, string[]> = {
  Fiziologiniai: ["fiziologinis", "fiziologiniu"],
  Saugumo: ["saugumas", "saugumu"],
  Socialiniai: ["socialinis", "socialiniu", "bendravimo"],
  Pagarbos: ["pagarba", "pagarbu", "pripažinimo", "pripazinimo"],
  Savirealizacijos: ["savirealizacija", "savirealizaciju"],
};
const maslou = (id: string, example: string, a: string): Topic => ({
  id,
  section: S2,
  q: `Kuriam Maslou poreikiui priskirtinas pavyzdys: „${example}“?`,
  a,
  accept: [...MASLOU_FORMS[a], `${a.toLowerCase()} poreikiai`, `${a.toLowerCase()} poreikis`],
  wrong: MASLOU.filter((m) => m !== a),
  note: "Piramidė nuo apačios: fiziologiniai → saugumo → socialiniai → pagarbos → savirealizacijos.",
});

const KLIUTYS = ["Istorinės kliūtys", "Gamtinės kliūtys", "Socialinės ir politinės kliūtys", "Ekonominės kliūtys"];
const kliutis = (id: string, q: string, a: string, note?: string): Topic => ({
  id,
  section: S7,
  q: `Kokia vystymosi kliūtis: „${q}“?`,
  a,
  accept: [a.replace(" kliūtys", "")],
  wrong: KLIUTYS.filter((k) => k !== a),
  note,
});

export const topics: Topic[] = [
  /* ---------- I. Valstybių įvairovė (34–37 psl.) ---------- */
  { id: "v1", section: S1, q: "Pagal kokius 4 kriterijus skirstomos valstybės?", a: "Dydis, geografinė padėtis, teritorijos sandara, valdymas ir demokratijos lygis", choiceOnly: true,
    wrong: ["Klimatas, kalba, religija, valiuta", "BVP, ŽSRI, PLI ir „Big Mac“ indeksas", "Plotas, sostinė, vėliava, himnas"] },
  { id: "v2", section: S1, q: "Į kokias grupes valstybės skirstomos pagal teritorijos dydį (ir gyventojų skaičių)?", a: "Mažas, vidutines ir dideles", accept: ["mažos+vidutinės+didelės", "mažas+vidutines+dideles", "mazas+vidutines+dideles"],
    wrong: ["Pajūrio, sausumos ir salų", "Unitarines ir federacines", "Demokratines ir autoritarines"] },
  { id: "v3", section: S1, q: "Mažos teritorijos valstybės pavyzdys iš pamokos", a: "Vatikanas", wrong: ["Gudija", "Rusija", "Čekija"], note: "Pagal plotą: mažos – Vatikanas, vidutinės – Gudija, didelės – Rusija." },
  { id: "v4", section: S1, q: "Vidutinės teritorijos valstybės pavyzdys iš pamokos", a: "Gudija", accept: ["baltarusija"], wrong: ["Vatikanas", "Rusija", "Indija"], note: "Pagal plotą: mažos – Vatikanas, vidutinės – Gudija, didelės – Rusija." },
  { id: "v5", section: S1, q: "Didelės pagal gyventojų skaičių valstybės pavyzdys iš pamokos", a: "Indija", wrong: ["Juodkalnija", "Čekija", "Vatikanas"], note: "Pagal gyventojų skaičių: mažos – Juodkalnija, vidutinės – Čekija, didelės – Indija." },
  { id: "v6", section: S1, q: "Mažiausia pasaulyje valstybė pagal plotą ir gyventojų skaičių", a: "Vatikanas", wrong: ["Monakas", "San Marinas", "Liuksemburgas"] },
  { id: "v7", section: S1, q: "Didžiausia pasaulyje valstybė pagal plotą", a: "Rusija", wrong: ["Kanada", "Kinija", "JAV"] },
  { id: "v8", section: S1, q: "Ar valstybės gyventojų skaičius priklauso nuo jos ploto?", a: "Ne – pvz., Indija nedidelė plotu, bet turi labai daug gyventojų", choiceOnly: true,
    wrong: ["Taip – kuo didesnis plotas, tuo daugiau gyventojų", "Taip, bet tik Europoje", "Priklauso tik salų valstybėse"] },
  { id: "v9", section: S1, q: "Į kokias grupes valstybės skirstomos pagal geografinę padėtį?", a: "Pajūrio, žemynines (sausumos) ir salų", accept: ["pajūrio+salų", "pajurio+salu", "pajūrio+sausumos", "pajurio+zemynines"],
    wrong: ["Mažas, vidutines ir dideles", "Šiaurines ir pietines", "Kalnų ir lygumų"] },
  { id: "v10", section: S1, q: "Sausumos (žemyninės) valstybės pavyzdys iš pamokos", a: "Mongolija", wrong: ["Ispanija", "Japonija", "Danija"], note: "Pajūrio – Ispanija, sausumos – Mongolija, salų – Japonija." },
  { id: "v11", section: S1, q: "Salų valstybės pavyzdys iš pamokos", a: "Japonija", wrong: ["Mongolija", "Ispanija", "Čekija"] },
  { id: "v12", section: S1, q: "Kurioje eilutėje nurodytos vidinės (žemyninės) valstybės?", a: "Mongolija, Kazachstanas", choiceOnly: true, wrong: ["Pietų Korėja, Naujoji Zelandija", "Peru, Čilė", "Pietų Afrika, Egiptas"] },
  { id: "v13", section: S1, q: "Kurioje eilutėje nurodytos salų valstybės?", a: "Japonija ir Jungtinė Karalystė", choiceOnly: true, wrong: ["Prancūzija ir Kinija", "Australija ir Argentina", "Mongolija ir Kazachstanas"] },
  { id: "v14", section: S1, q: "Kurioje eilutėje nurodytos jūrinės Europos valstybės?", a: "Danija ir Graikija", choiceOnly: true, wrong: ["Čekija ir Slovakija", "Vengrija ir Serbija", "Šveicarija ir Liuksemburgas"] },
  { id: "v15", section: S1, q: "Kurios valstybės yra Europos mikrovalstybės?", a: "Vatikanas, Monakas, San Marinas, Andora", choiceOnly: true, wrong: ["Juodkalnija, Kosovas", "Albanija, Danija", "Estija, Latvija"] },
  { id: "v16", section: S1, q: "Kuo gali būti vedamos valstybių sienos?", a: "Upėmis, ežerais, miškais, pelkėmis arba būna sutartinės", choiceOnly: true, wrong: ["Tik kalnų keteromis", "Tik pagal gyventojų kalbą", "Tik tiesiomis geometrinėmis linijomis"] },
  { id: "v17", section: S1, q: "Kaip vadinama valstybė, kurioje visoje teritorijoje galioja viena konstitucija ir vienodi įstatymai?", a: "Unitarinė", accept: ["unitarine valstybe"], wrong: ["Federacinė", "Respublika", "Monarchija"], note: "Pavyzdžiai: Lietuva, Prancūzija, Egiptas." },
  { id: "v18", section: S1, q: "Kaip vadinama valstybė, kurios atskirose dalyse skiriasi konstitucija ir įstatymai?", a: "Federacinė", accept: ["federacine valstybe", "federacija"], wrong: ["Unitarinė", "Respublika", "Teokratinė"], note: "Pavyzdžiai: JAV, Vokietija, Rusija." },
  { id: "v19", section: S1, q: "Kurioje eilutėje nurodytos unitarinės valstybės?", a: "Lietuva, Prancūzija, Egiptas", choiceOnly: true, wrong: ["JAV, Vokietija, Rusija", "Belgija, Šveicarija, Austrija", "Indija, Brazilija, Kanada"] },
  { id: "v20", section: S1, q: "Europos federacinės valstybės yra...", a: "Vokietija, Austrija, Rusija, Šveicarija, Belgija, Bosnija ir Hercegovina", choiceOnly: true, wrong: ["Italija, Ispanija, Prancūzija", "Lietuva, Latvija, Estija", "Lenkija, Čekija, Slovakija"] },
  { id: "v21", section: S1, q: "Kuo skiriasi unitarinė valstybė nuo federacinės?", a: "Unitarinėje visur vienodi įstatymai, federacinėje dalyse jie skiriasi", choiceOnly: true,
    wrong: ["Unitarinę valdo karalius, federacinę – prezidentas", "Unitarinė yra maža, federacinė – didelė", "Unitarinė yra saloje, federacinė – žemyne"] },
  { id: "v22", section: S1, q: "Kaip vadinama monarchija, kurioje karalius visagalis?", a: "Absoliutinė", accept: ["absoliutine monarchija", "absoliuti"], wrong: ["Konstitucinė", "Teokratinė", "Respublika"], note: "Pavyzdys – Saudo Arabija." },
  { id: "v23", section: S1, q: "Absoliutinės monarchijos pavyzdys", a: "Saudo Arabija", wrong: ["Didžioji Britanija", "Vatikanas", "Latvija"] },
  { id: "v24", section: S1, q: "Kaip vadinama monarchija, kur valdo karalius ir tautos renkamas parlamentas?", a: "Konstitucinė", accept: ["konstitucine monarchija"], wrong: ["Absoliutinė", "Teokratinė", "Respublika"], note: "Pavyzdys – Didžioji Britanija." },
  { id: "v25", section: S1, q: "Kaip vadinama dvasininko valdoma monarchija?", a: "Teokratinė", accept: ["teokratine monarchija", "teokratija"], wrong: ["Absoliutinė", "Konstitucinė", "Federacinė"], note: "Pavyzdys – Vatikanas." },
  { id: "v26", section: S1, q: "Kaip vadinama tautos renkamo prezidento valdoma valstybė?", a: "Respublika", wrong: ["Monarchija", "Federacija", "Diktatūra"], note: "Pavyzdys – Latvija." },
  { id: "v27", section: S1, q: "Kuo skiriasi monarchija nuo respublikos?", a: "Monarchiją valdo karalius, respubliką – tautos renkamas prezidentas", choiceOnly: true,
    wrong: ["Monarchija yra maža, respublika – didelė", "Monarchijoje nėra įstatymų", "Respubliką visada valdo kariškiai"] },
  { id: "v28", section: S1, q: "Kurioje eilutėje nurodytos Europos konstitucinės monarchijos?", a: "Danija, Belgija, Švedija", choiceOnly: true, wrong: ["Vokietija, Ispanija, Italija", "Rumunija, Bulgarija, Portugalija", "Lenkija, Čekija, Slovakija"] },
  { id: "v29", section: S1, q: "Prie kurios įlankos įsikūrė daugiausiai absoliutinių monarchijų?", a: "Persijos įlankos", accept: ["persijos", "persų"], wrong: ["Meksikos įlankos", "Bengalijos įlankos", "Gvinėjos įlankos"] },
  { id: "v30", section: S1, q: "Kuriuose dviejuose žemynuose daugiausiai autoritarinių valstybių?", a: "Afrikoje ir Azijoje", accept: ["afrika+azija"], wrong: ["Europoje ir Šiaurės Amerikoje", "Australijoje ir Pietų Amerikoje", "Europoje ir Pietų Amerikoje"] },
  { id: "v31", section: S1, q: "Į kokias grupes valstybės skirstomos pagal demokratijos lygį?", a: "Demokratines, pusiau demokratines ir autoritarines", accept: ["demokratines+autoritarines"], wrong: ["Unitarines ir federacines", "Monarchijas ir respublikas", "Stiprias, pažangias ir silpnas"] },
  { id: "v32", section: S1, q: "Kokie demokratinės valstybės požymiai?", a: "Partijų pasirinkimas, laisvi rinkimai, žodžio laisvė", choiceOnly: true, wrong: ["Klastojami rinkimai, varžomos partijos, cenzūra", "Vienas valdovas visam gyvenimui", "Valdžia dvasininkų rankose"] },
  { id: "v33", section: S1, q: "Ką vadiname autoritarine valstybe?", a: "Valstybę, kur klastojami rinkimai, varžomos partijos, cenzūruojama spauda", choiceOnly: true, wrong: ["Valstybę su laisvais rinkimais ir žodžio laisve", "Valstybę, valdomą tautos renkamo parlamento", "Valstybę, kur galioja vienodi įstatymai"] },
  /* iš kontrolinio pavyzdžių */
  { id: "v34", section: S1, q: "Kurioje eilutėje nurodytos mikrovalstybės?", a: "Malta, San Marinas", choiceOnly: true, wrong: ["Juodkalnija, Kosovas", "Šveicarija, Austrija", "Šiaurės Makedonija, Sakartvelas"], note: "Europos mikrovalstybės: Vatikanas, Monakas, San Marinas, Lichtenšteinas, Andora, Malta." },
  { id: "v35", section: S1, q: "Kurioje eilutėje nurodytos jūrinės valstybės?", a: "Pietų Korėja, Venesuela", choiceOnly: true, wrong: ["Mongolija, Čekija", "Kazachstanas, Šveicarija", "Bolivija, Paragvajus"], note: "Kitose eilutėse – vien žemyninės valstybės be išėjimo į jūrą." },
  { id: "v36", section: S1, q: "Kas yra jūrinė (pajūrio) valstybė?", a: "Valstybė, turinti išėjimą į jūrą ar vandenyną", choiceOnly: true, wrong: ["Valstybė, esanti saloje", "Valstybė, neturinti išėjimo į jūrą", "Valstybė, valdoma iš jūros uosto"], note: "Pvz., Ispanija, Lietuva, Pietų Korėja." },
  { id: "v37", section: S1, q: "Kas yra žemyninė (sausumos) valstybė?", a: "Valstybė, neturinti išėjimo į jūrą", choiceOnly: true, wrong: ["Valstybė, esanti žemyno viduryje ir turinti daug upių", "Valstybė, turinti išėjimą į jūrą", "Didžiausia žemyno valstybė"], note: "Pvz., Mongolija, Čekija, Šveicarija, Bolivija." },
  { id: "v38", section: S1, q: "Kuri iš šių Europos valstybių yra žemyninė (be išėjimo į jūrą)?", a: "Čekija", wrong: ["Danija", "Graikija", "Portugalija"] },

  /* ---------- II. Kas yra gerovė (38–39 psl.) ---------- */
  { id: "g1", section: S2, q: "Koks mokslininkas sukūrė poreikių piramidę?", a: "Maslou", accept: ["maslow", "a. h. maslou", "abraomas maslou"], wrong: ["Darvinas", "Froidas", "Einšteinas"] },
  { id: "g2", section: S2, q: "Kaip vienu bendru pavadinimu vadinami svarbiausi žmonių poreikiai (piramidės pagrindas)?", a: "Fiziologiniai", accept: ["fiziologiniai poreikiai"], wrong: ["Savirealizacijos", "Saugumo", "Pagarbos"] },
  { id: "g3", section: S2, q: "Kaip vadinami būtinybę viršijantys poreikiai piramidės viršuje?", a: "Savirealizacijos", accept: ["savirealizacija", "savirealizacijos poreikiai"], wrong: ["Fiziologiniai", "Saugumo", "Bendravimo"] },
  { id: "g4", section: S2, q: "Įvardink tris fiziologinius poreikius", a: "Maistas, vanduo, namai (oras)", accept: ["maistas+vanduo", "maistas+oras", "vanduo+namai"], wrong: ["Automobilis, telefonas, kelionės", "Pripažinimas, karjera, menas", "Draugai, meilė, pagarba"] },
  { id: "g5", section: S2, q: "Kas lemia žmonių poreikius?", a: "Amžius, lytis, darbas, pajamos ir pomėgiai", choiceOnly: true, wrong: ["Tik pinigų kiekis", "Klimatas ir reljefas", "Valstybės plotas ir sienos"] },
  { id: "g6", section: S2, q: "Kas formuoja žmogaus gerovę?", a: "Aplinka, pajamos ir šalies ekonomika", choiceOnly: true, wrong: ["Tik geografinė padėtis", "Tik amžius ir lytis", "Vėliava, himnas ir kalba"] },
  { id: "g7", section: S2, q: "Koks darnaus vystymosi tikslas siejamas su žmonių gerove?", a: "Nr. 1 – Skurdo mažinimas", accept: ["skurdo mazinimas", "skurdo", "pirmas", "1"], wrong: ["Nr. 13 – Klimato kaita", "Nr. 4 – Kokybiškas išsilavinimas", "Nr. 7 – Prieinama energija"] },
  { id: "g8", section: S2, q: "Kaip keičiasi žmogaus poreikiai 30, 50 ir 70 metų amžiuje?", a: "Mažėja su amžiumi", accept: ["mažėja", "mazeja"], wrong: ["Didėja su amžiumi", "Nesikeičia", "Iš pradžių mažėja, po to didėja"] },
  { id: "g9", section: S2, q: "Kaip poreikiai priklauso nuo pinigų?", a: "Kuo daugiau pinigų, tuo didesni poreikiai", choiceOnly: true, wrong: ["Kuo daugiau pinigų, tuo mažesni poreikiai", "Nepriklauso", "Priklauso tik vaikams"] },
  { id: "g10", section: S2, q: "Kaip poreikiai priklauso nuo lyties?", a: "Moterims labiau puoštis, vyrams – išlaidos technikai", choiceOnly: true, wrong: ["Nepriklauso nuo lyties", "Vyrai išleidžia tik maistui", "Moterys neturi savirealizacijos poreikių"] },
  { id: "g11", section: S2, q: "Kaip poreikiai priklauso nuo valstybės ekonomikos?", a: "Stipresnių valstybių gyventojams didesni poreikiai", choiceOnly: true, wrong: ["Silpnesnių valstybių gyventojams didesni poreikiai", "Nepriklauso", "Priklauso tik nuo valstybės ploto"] },
  { id: "g12", section: S2, q: "Kodėl daug uždirbantys žmonės siekia savirealizacijos poreikių?", a: "Turi daugiau pinigų, liekančių nuo fiziologinių poreikių", choiceOnly: true, wrong: ["Neturi fiziologinių poreikių", "Juos verčia valstybė", "Nes turi daugiau laisvo laiko"] },
  { id: "g13", section: S2, q: "Kodėl skiriasi Madagaskaro ir Šveicarijos gyventojo poreikiai?", a: "Lemia skirtingos pajamos", accept: ["pajamos", "skirtingos pajamos"], wrong: ["Lemia skirtingas klimatas", "Lemia kalba", "Lemia valstybės plotas"] },
  /* iš kontrolinio pavyzdžių */
  { id: "g14", section: S2, q: "Kokie 5 Maslou piramidės lygiai (nuo apačios į viršų)?", a: "Fiziologiniai, saugumo, socialiniai, pagarbos, savirealizacijos", choiceOnly: true,
    wrong: ["Maistas, vanduo, oras, namai, pinigai", "Ekonominiai, politiniai, socialiniai, gamtiniai, istoriniai", "Savirealizacijos, pagarbos, socialiniai, saugumo, fiziologiniai"] },
  maslou("g15", "žmogaus organizmo funkcionavimui reikalingas maistas ir vanduo", "Fiziologiniai"),
  maslou("g16", "suaugusio žmogaus siekis turėti stabilias pajamas ir nuosavą būstą", "Saugumo"),
  maslou("g17", "žmogaus poreikis bendrauti ir bendradarbiauti su kitais", "Socialiniai"),
  maslou("g18", "žmogaus siekis naujoje darbo vietoje ar veikloje padaryti gerą įspūdį kitiems", "Pagarbos"),
  maslou("g19", "žmogaus noras siekti savo užsibrėžtų tikslų", "Savirealizacijos"),
  { id: "g20", section: S2, q: "Kuris iš šių mokslininkų sukūrė poreikių piramidę: Humboldtas, Vespučis, Maslou ar Skotas?", a: "Maslou", accept: ["maslow", "a. h. maslou"], wrong: ["A. Humboldtas", "A. Vespučis", "R. Skotas"], note: "Humboldtas – gamtininkas, Vespučis – keliautojas, Skotas – poliarinis tyrinėtojas." },

  /* ---------- III. Kas yra ekonominė galia (42–43 psl.) ---------- */
  { id: "e1", section: S3, q: "Kas yra BVP (bendrasis vidaus produktas)?", a: "Metinė pagamintų prekių ir suteiktų paslaugų visuma, išreikšta JAV doleriais", choiceOnly: true, wrong: ["Valstybės gyventojų skaičius", "Vidutinė gyvenimo trukmė", "Mėsainio kaina skirtingose šalyse"] },
  { id: "e2", section: S3, q: "Metinė pagamintų prekių ir suteiktų paslaugų visuma 1 gyventojui vadinama...", a: "BVP 1 gyventojui", accept: ["bvp 1 gyv", "bvp vienam gyventojui", "bvp 1 gyventojui"], wrong: ["ŽSRI", "Perkamoji galia", "„Big Mac“ indeksas"] },
  { id: "e3", section: S3, q: "Norint apskaičiuoti BVP 1 gyventojui, valstybės BVP reikia dalinti iš...", a: "Gyventojų skaičiaus", accept: ["gyventojų", "gyventoju skaiciaus", "gyventojų skaičiaus"], wrong: ["Ploto", "Metų skaičiaus", "Eksporto vertės"] },
  { id: "e4", section: S3, q: "Kuris rodiklis objektyvesnis: BVP ar BVP 1 gyventojui?", a: "BVP 1 gyventojui", accept: ["bvp 1 gyv", "1 gyventojui", "vienam gyventojui"], wrong: ["BVP", "Abu vienodai", "Nė vienas"] },
  { id: "e5", section: S3, q: "Kuo skiriasi BVP nuo BVP 1 gyventojui?", a: "BVP – visos šalies metinė produkcija; BVP 1 gyv. – padalinta gyventojų skaičiui, todėl objektyvesnis", choiceOnly: true,
    wrong: ["BVP matuojamas eurais, BVP 1 gyv. – doleriais", "BVP – tik prekės, BVP 1 gyv. – tik paslaugos", "Niekuo nesiskiria"] },
  { id: "e6", section: S3, q: "Kas yra „Big Mac“ indeksas?", a: "To paties mėsainio kaina skirtingose pasaulio valstybėse", choiceOnly: true, wrong: ["Suvalgomų mėsainių skaičius per metus", "Restoranų skaičius valstybėje", "Mėsos eksporto vertė"] },
  { id: "e7", section: S3, q: "Kokį ekonominį rodiklį padeda įvertinti „Big Mac“ indeksas?", a: "Perkamąją galią", accept: ["perkamoji galia", "perkamaja galia", "perkamoji"], wrong: ["Vidutinę gyvenimo trukmę", "Raštingumą", "Gyventojų skaičių"] },
  { id: "e8", section: S3, q: "Rodiklis, rodantis, kiek prekių galima nusipirkti už tam tikrą pinigų sumą skirtingose valstybėse, vadinamas...", a: "Perkamoji galia", accept: ["perkamaja galia", "perkamoji"], wrong: ["BVP", "ŽSRI", "Laimės indeksas"], note: "Todėl dažnai vertinamas BVP 1 gyv. pagal perkamąją galią (PG)." },
  { id: "e9", section: S3, q: "Valstybės pagal ekonomiką būna silpnos, stiprios ir...", a: "Pažangios", accept: ["pazangios"], wrong: ["Vidutinės", "Besivystančios", "Turtingos"] },
  { id: "e10", section: S3, q: "Kur yra aukštas gyvenimo lygis (ekonomiškai stiprios valstybės)?", a: "Europoje, Rytų Azijoje ir Šiaurės Amerikoje", choiceOnly: true, wrong: ["Afrikoje ir Pietų Azijoje", "Lotynų Amerikoje", "Vidurinėje Azijoje"] },
  { id: "e11", section: S3, q: "Kuriame žemyne daugiausiai ekonomiškai silpnų valstybių (skurdas)?", a: "Afrikoje", accept: ["afrika"], wrong: ["Europoje", "Šiaurės Amerikoje", "Australijoje"] },
  { id: "e12", section: S3, q: "Kuriai grupei priskiriamos Lotynų Amerikos ir daugelis Azijos valstybių?", a: "Pažangios", accept: ["pazangios", "pažangių"], wrong: ["Ekonomiškai stiprios", "Ekonomiškai silpnos", "Išsivysčiusios"], note: "Joms dar toli iki turtingųjų vakarietiškų standartų." },
  { id: "e13", section: S3, q: "Kuriai grupei pagal ekonomiką skiriama Lietuva?", a: "Ekonomiškai stiprių valstybių grupei", accept: ["stiprių", "stipriu", "stiprios", "stipri"], wrong: ["Pažangių valstybių grupei", "Ekonomiškai silpnų grupei", "Besivystančių grupei"] },
  { id: "e14", section: S3, q: "Didelis kūdikių mirtingumas rodo silpną valstybės...", a: "Ekonomiką", accept: ["ekonomika"], wrong: ["Kariuomenę", "Kultūrą", "Geografiją"] },
  { id: "e15", section: S3, q: "Ekonomiškai stiprios dvi pietų pusrutulio valstybės yra...", a: "Australija ir Naujoji Zelandija", accept: ["australija+zelandija"], wrong: ["Brazilija ir Argentina", "Pietų Afrika ir Čilė", "Indonezija ir Madagaskaras"] },
  { id: "e16", section: S3, q: "Ekonomiškai stipriausios Rytų Azijos valstybės yra...", a: "Japonija, Pietų Korėja, Taivanas", accept: ["japonija+korėja", "japonija+koreja", "japonija+taivanas"], wrong: ["Mongolija ir Kazachstanas", "Bangladešas ir Pakistanas", "Indonezija ir Vietnamas"] },
  { id: "e17", section: S3, q: "Pietvakarių Azijos valstybių ekonominę galią lemia išgaunama...", a: "Nafta (ir gamtinės dujos)", accept: ["nafta", "dujos", "gamtines dujos"], wrong: ["Anglis", "Auksas", "Mediena"] },
  { id: "e18", section: S3, q: "Kokie 4 rodikliai atspindi valstybių ekonominę galią?", a: "BVP, BVP 1 gyventojui, perkamoji galia ir „Big Mac“ indeksas", choiceOnly: true, wrong: ["ŽSRI, PLI, raštingumas, gyvenimo trukmė", "Plotas, gyventojai, sienos, sostinė", "Eksportas, importas, muitai, skolos"] },
  { id: "e19", section: S3, q: "BVP ne visada objektyvus rodiklis, todėl naudojamas jam giminingas...", a: "BVP 1 gyventojui", accept: ["bvp 1 gyv", "bvp vienam gyventojui"], wrong: ["ŽSRI", "Laimės indeksas", "Ekologinis pėdsakas"] },
  { id: "e20", section: S3, q: "Kas lemia gyvenimo kokybę valstybėje?", a: "Šalies ekonominė galia", accept: ["ekonominė galia", "ekonomine galia", "ekonomika"], wrong: ["Valstybės plotas", "Klimatas", "Valdymo forma"] },
  /* iš kontrolinio pavyzdžių */
  { id: "e21", section: S3, q: "Kuris iš šių rodiklių NĖRA ekonominės galios rodiklis?", a: "Pasaulinis laimės indeksas", accept: ["laimės indeksas", "laimes indeksas", "pli", "žsri", "zsri"], wrong: ["„Big Mac“ indeksas", "BVP 1 gyv.", "BVP 1 gyv. pagal perkamąją galią"], note: "PLI ir ŽSRI – universalūs gerovės rodikliai, o ne ekonominės galios." },
  { id: "e22", section: S3, q: "Kuris iš šių rodiklių NĖRA ekonominės galios rodiklis?", a: "ŽSRI", accept: ["zsri", "socialinės raidos indeksas", "laimės indeksas", "pli"], wrong: ["„Big Mac“ indeksas", "BVP 1 gyv.", "BVP 1 gyv. pagal perkamąją galią"], note: "ŽSRI – universalus gerovės rodiklis (BVP 1 gyv. + raštingumas + gyvenimo trukmė)." },
  { id: "e23", section: S3, q: "Valstybės BVP – 500 mlrd. USD, gyventojų – 10 mln. Koks BVP 1 gyventojui?", a: "50 000 USD", accept: ["50000", "50 000", "50 tūkst", "50 tukst", "50k"], wrong: ["5 000 USD", "500 000 USD", "50 USD"], note: "500 000 000 000 ÷ 10 000 000 = 50 000." },
  { id: "e24", section: S3, q: "Valstybės BVP – 200 mlrd. USD, gyventojų – 40 mln. Koks BVP 1 gyventojui?", a: "5 000 USD", accept: ["5000", "5 000", "5 tūkst", "5 tukst", "5k"], wrong: ["50 000 USD", "8 000 USD", "500 USD"], note: "200 mlrd. ÷ 40 mln. = 5 000." },
  { id: "e25", section: S3, q: "Valstybės BVP – 60 mlrd. USD, gyventojų – 3 mln. Koks BVP 1 gyventojui?", a: "20 000 USD", accept: ["20000", "20 000", "20 tūkst", "20 tukst", "20k"], wrong: ["2 000 USD", "180 000 USD", "200 USD"], note: "60 mlrd. ÷ 3 mln. = 20 000 (panašu į Lietuvą)." },
  { id: "e26", section: S3, q: "A: BVP 200 mlrd. USD, 40 mln. gyv. B: BVP 100 mlrd. USD, 5 mln. gyv. Kuri ekonomiškai stipresnė pagal BVP 1 gyv.?", a: "B (20 000 USD prieš 5 000 USD)", accept: ["b"], wrong: ["A (jos BVP didesnis)", "Abi vienodos", "Neįmanoma nustatyti"], note: "Didesnis bendras BVP nereiškia stipresnės ekonomikos – reikia dalinti gyventojų skaičiui." },
  { id: "e27", section: S3, q: "A: BVP 4 000 mlrd. USD, 84 mln. gyv. (Vokietija). B: BVP 900 mlrd. USD, 8,7 mln. gyv. (Šveicarija). Kurios BVP 1 gyv. didesnis?", a: "B – Šveicarijos (~100 000 prieš ~48 000 USD)", accept: ["b", "šveicarija", "sveicarija", "šveicarijos", "sveicarijos"], wrong: ["A – Vokietijos", "Vienodas", "Neįmanoma nustatyti"], note: "Mažos turtingos valstybės (Šveicarija, Liuksemburgas, Norvegija) pagal BVP 1 gyv. lenkia dideles." },

  /* ---------- IV. Universalūs gerovės rodikliai (44–45 psl.) ---------- */
  { id: "u1", section: S4, q: "Kokie skiriami du universalūs valstybės gerovės rodikliai?", a: "ŽSRI ir pasaulinis laimės indeksas (PLI)", accept: ["žsri+laimės", "zsri+laimes", "žsri+pli", "zsri+pli"], wrong: ["BVP ir „Big Mac“ indeksas", "Plotas ir gyventojų skaičius", "Eksportas ir importas"] },
  { id: "u2", section: S4, q: "Ką reiškia santrumpa ŽSRI?", a: "Žmonių socialinės raidos indeksas", accept: ["zmoniu socialines raidos indeksas", "socialinės raidos indeksas", "socialines raidos"], wrong: ["Žemės sričių raidos indeksas", "Žmonių sveikatos rodiklių indeksas", "Žaliavų skirstymo rinkos indeksas"] },
  { id: "u3", section: S4, q: "Kokie trys rodikliai sudaro ŽSRI?", a: "BVP 1 gyventojui, raštingumas, vidutinė gyvenimo trukmė", accept: ["bvp+raštingumas+trukmė", "bvp+rastingumas+trukme"], wrong: ["Plotas, gyventojai, sostinė", "Eksportas, importas, muitai", "Laimė, ekologinis pėdsakas, pajamos"] },
  { id: "u4", section: S4, q: "Kokias tris gyvenimo sritis apima ŽSRI?", a: "Ekonomiką (pajamas), švietimą ir sveikatą", accept: ["ekonomika+švietimas+sveikata", "ekonomika+svietimas+sveikata", "pajamos+svietimas+sveikata"], wrong: ["Kariuomenę, politiką, religiją", "Klimatą, reljefą, vandenis", "Sportą, kultūrą, turizmą"] },
  { id: "u5", section: S4, q: "Kodėl ŽSRI objektyvesnis rodiklis už BVP 1 gyventojui?", a: "Nes jį sudaro trys rodikliai (tarp jų ir BVP 1 gyv.), tad valstybes galima tiksliau palyginti", choiceOnly: true, wrong: ["Nes matuojamas eurais", "Nes jį skaičiuoja JT", "Nes neįtraukia BVP"] },
  { id: "u6", section: S4, q: "ŽSRI stipresnis rodiklis, nes jį sudaro trys...", a: "Rodikliai", accept: ["rodikliai", "dalys", "rodikliu"], wrong: ["Valstybės", "Žemynai", "Metai"] },
  { id: "u7", section: S4, q: "Kaip vadinamos valstybės, kurių ŽSRI aukštas (>0,800)?", a: "Išsivysčiusios", accept: ["issivysciusios", "išsivysčiusios valstybės"], wrong: ["Pažangios", "Besivystančios", "Autoritarinės"] },
  { id: "u8", section: S4, q: "Kaip vadinamos valstybės, kurių ŽSRI vidutinis (0,600–0,799)?", a: "Pažangios", accept: ["pazangios"], wrong: ["Išsivysčiusios", "Besivystančios", "Silpnos"] },
  { id: "u9", section: S4, q: "Kaip vadinamos valstybės, kurių ŽSRI žemas (<0,599)?", a: "Besivystančios", accept: ["besivystancios", "ekonomiškai silpnos", "silpnos"], wrong: ["Išsivysčiusios", "Pažangios", "Stiprios"] },
  { id: "u10", section: S4, q: "Kas būdinga aukšto ŽSRI valstybėms?", a: "Išvystyta pramonė, darbas paslaugose, aukšto lygio sveikatos priežiūra ir švietimas", choiceOnly: true, wrong: ["Daug dirba žemės ūkyje, didelis gimstamumas", "Auga eksportas, didelis skirtumas tarp turtingų ir vargšų", "Klastojami rinkimai ir cenzūra"] },
  { id: "u11", section: S4, q: "Kas būdinga vidutinio ŽSRI valstybėms?", a: "Auga eksportas, modernizuojamas ūkis, didelis skirtumas tarp turtingųjų ir vargšų", choiceOnly: true, wrong: ["Išvystyta pramonė ir aukšto lygio švietimas", "Daug dirba žemės ūkyje, didelis gimstamumas", "Visi dirba paslaugose"] },
  { id: "u12", section: S4, q: "Kas būdinga žemo ŽSRI valstybėms?", a: "Daug dirba žemės ūkyje, žemo lygio sveikatos priežiūra ir švietimas, didelis gimstamumas", choiceOnly: true, wrong: ["Išvystyta pramonė ir paslaugos", "Auga eksportas, modernizuojamas ūkis", "Mažas gimstamumas, ilga gyvenimo trukmė"] },
  { id: "u13", section: S4, q: "Kaip apskaičiuojamas pasaulinis laimės indeksas (PLI)?", a: "Vidutinė gyvenimo trukmė × pasitenkinimas gyvenimu ÷ ekologinis pėdsakas", choiceOnly: true, wrong: ["BVP ÷ gyventojų skaičius", "Raštingumas + gyvenimo trukmė", "Mėsainio kaina × gyventojų skaičius"] },
  { id: "u14", section: S4, q: "Nuo kurių metų vertinamas pasaulinis laimės indeksas?", a: "2006", accept: ["2006 m", "nuo 2006"], wrong: ["1957", "1990", "2015"] },
  { id: "u15", section: S4, q: "Valstybių ŽSRI būna aukštas, vidutinis ir...", a: "Žemas", accept: ["zemas"], wrong: ["Neigiamas", "Nulinis", "Vidutiniškas"] },
  { id: "u16", section: S4, q: "Kuo daugiau pajamų, tuo valstybės ŽSRI...", a: "Aukštesnis", accept: ["aukstesnis", "aukštas", "aukstas", "didesnis"], wrong: ["Žemesnis", "Nesikeičia", "Neigiamas"] },
  { id: "u17", section: S4, q: "Jei gyventojų daugėja staigiai, tai valstybės ŽSRI...", a: "Žemas", accept: ["zemas", "žemesnis", "zemesnis", "mažėja"], wrong: ["Aukštas", "Nesikeičia", "Artimas 1"] },
  { id: "u18", section: S4, q: "Jei vidutinė gyvenimo trukmė ilga, tai ŽSRI...", a: "Aukštas", accept: ["aukstas", "aukštesnis", "aukstesnis"], wrong: ["Žemas", "Nesikeičia", "Mažesnis nei 0,5"] },
  { id: "u19", section: S4, q: "Didelis kūdikių mirtingumas rodo žemą valstybės...", a: "ŽSRI", accept: ["zsri", "socialinės raidos indeksą", "zsri indeksa"], wrong: ["Plotą", "Gyventojų tankį", "Eksportą"] },
  { id: "u20", section: S4, q: "Lietuvos ŽSRI yra...", a: "Aukštas", accept: ["aukstas"], wrong: ["Vidutinis", "Žemas", "Mažesnis nei 0,5"] },
  { id: "u21", section: S4, q: "Jei ŽSRI artimas 1, tai valstybės ŽSRI...", a: "Aukštas", accept: ["aukstas", "labai aukštas"], wrong: ["Žemas", "Vidutinis", "Neigiamas"] },
  { id: "u22", section: S4, q: "Jei ŽSRI mažesnis nei 0,5, tai valstybė...", a: "Ekonomiškai silpna / besivystanti", accept: ["silpna", "besivystanti", "besivystancios", "ekonomiskai silpna"], wrong: ["Išsivysčiusi", "Pažangi", "Ekonomiškai stipri"] },
  { id: "u23", section: S4, q: "Aukštas ŽSRI yra Australijoje, Europoje ir...", a: "Šiaurės Amerikoje (Rytų Azijoje)", accept: ["šiaurės amerikoje", "siaures amerikoje", "siaures amerika", "rytų azijoje", "rytu azijoje"], wrong: ["Afrikoje", "Pietų Azijoje", "Vidurinėje Azijoje"] },
  { id: "u24", section: S4, q: "Kurioje eilutėje nurodytos laimingiausių žmonių ir aukščiausio ŽSRI valstybės?", a: "Islandija, Šveicarija, Norvegija", choiceOnly: true, wrong: ["Vokietija, Prancūzija, Italija", "Airija, Didžioji Britanija, Belgija", "Japonija, Pietų Korėja, Čilė"] },

  /* ---------- V. Europos Sąjunga ir mes (52–55 psl.) ---------- */
  { id: "s1", section: S5, q: "Kuriais metais įkurta Europos Sąjunga (įstojo pirmosios 6 valstybės)?", a: "1957", accept: ["1957 m"], wrong: ["1945", "1973", "2004"] },
  { id: "s2", section: S5, q: "Kurios 6 valstybės įkūrė ES 1957 m.?", a: "Belgija, Liuksemburgas, Nyderlandai, Italija, Prancūzija, Vokietija", choiceOnly: true, wrong: ["Danija, Airija, Didžioji Britanija, Graikija, Ispanija, Portugalija", "Švedija, Suomija, Austrija, Lenkija, Čekija, Vengrija", "Estija, Latvija, Lietuva, Bulgarija, Rumunija, Kroatija"] },
  { id: "s3", section: S5, q: "Kurios trys valstybės papildė ES 1973 m.?", a: "Danija, Airija, Didžioji Britanija", accept: ["danija+airija", "danija+britanija", "airija+britanija"], wrong: ["Švedija, Suomija, Austrija", "Ispanija, Portugalija, Graikija", "Estija, Latvija, Lietuva"] },
  { id: "s4", section: S5, q: "Kuri valstybė įstojo į ES 1981 m.?", a: "Graikija", wrong: ["Ispanija", "Kroatija", "Austrija"] },
  { id: "s5", section: S5, q: "Kurios dvi valstybės įstojo į ES 1986 m.?", a: "Ispanija ir Portugalija", accept: ["ispanija+portugalija"], wrong: ["Danija ir Airija", "Bulgarija ir Rumunija", "Švedija ir Suomija"] },
  { id: "s6", section: S5, q: "Kurios trys valstybės įstojo į ES 1995 m.?", a: "Švedija, Suomija, Austrija", accept: ["švedija+suomija", "svedija+suomija", "suomija+austrija"], wrong: ["Danija, Airija, Didžioji Britanija", "Lenkija, Čekija, Slovakija", "Ispanija, Portugalija, Graikija"] },
  { id: "s7", section: S5, q: "Kuriais metais Lietuva įstojo į ES?", a: "2004", accept: ["2004 m"], wrong: ["1995", "2007", "2013"] },
  { id: "s8", section: S5, q: "Kiek valstybių įstojo į ES 2004 m. (didžiausia plėtra)?", a: "10", accept: ["dešimt", "desimt"], wrong: ["6", "3", "12"], note: "Estija, Latvija, Lietuva, Lenkija, Čekija, Slovakija, Vengrija, Slovėnija, Kipras, Malta." },
  { id: "s9", section: S5, q: "Kurios dvi valstybės įstojo į ES 2007 m.?", a: "Bulgarija ir Rumunija", accept: ["bulgarija+rumunija"], wrong: ["Kroatija ir Slovėnija", "Kipras ir Malta", "Ispanija ir Portugalija"] },
  { id: "s10", section: S5, q: "Kuri valstybė paskutinė (2013 m.) įstojo į ES?", a: "Kroatija", wrong: ["Bulgarija", "Slovėnija", "Serbija"] },
  { id: "s11", section: S5, q: "Kiek valstybių šiuo metu sudaro Europos Sąjungą?", a: "27", accept: ["27 valstybės", "dvidešimt septynios"], wrong: ["28", "25", "30"] },
  { id: "s12", section: S5, q: "Kuri valstybė išstojo iš ES?", a: "Didžioji Britanija (Jungtinė Karalystė)", accept: ["didžioji britanija", "didzioji britanija", "jungtinė karalystė", "jungtine karalyste", "jk", "britanija", "anglija"], wrong: ["Norvegija", "Šveicarija", "Danija"] },
  { id: "s13", section: S5, q: "Kas yra breksitas?", a: "Jungtinės Karalystės pasitraukimas iš ES", accept: ["jk pasitraukimas", "britanijos išstojimas", "britanijos isstojimas", "britanijos pasitraukimas"], wrong: ["Naujų narių priėmimas į ES", "Euro įvedimas Didžiojoje Britanijoje", "ES sienų atvėrimas"] },
  { id: "s14", section: S5, q: "Kokios yra 4 ES laisvės?", a: "Nevaržomas prekių, paslaugų, kapitalo ir asmenų judėjimas", accept: ["prekių+paslaugų+kapitalo+asmenų", "prekiu+paslaugu+kapitalo+asmenu"], wrong: ["Žodžio, spaudos, religijos, susirinkimų laisvė", "Prekyba, karyba, mokslas, sportas", "Nemokamas mokslas, gydymas, transportas, būstas"] },
  { id: "s15", section: S5, q: "Kas davė pradžią ES bendradarbiavimui?", a: "Anglių kasyba, plieno lydymas, vėliau atominė energetika", choiceOnly: true, wrong: ["Bendra kariuomenė", "Bendra valiuta – euras", "Žemės ūkio subsidijos"] },
  { id: "s16", section: S5, q: "Išstojus JK, daugiausiai įmokų į ES biudžetą sumoka...", a: "Vokietija ir Prancūzija", accept: ["vokietija+prancūzija", "vokietija+prancuzija"], wrong: ["Italija ir Ispanija", "Lenkija ir Rumunija", "Švedija ir Danija"] },
  { id: "s17", section: S5, q: "Kokie trys didžiausi ES iššūkiai pastaraisiais metais?", a: "Breksitas, COVID-19 pandemija, Rusijos karas prieš Ukrainą", choiceOnly: true, wrong: ["Euro įvedimas, plėtra, turizmas", "Kolonijų praradimas, badas, sausros", "Geležinė uždanga, Šaltasis karas, Berlyno siena"] },
  { id: "s18", section: S5, q: "Kurios dvi sritys ES sulaukia daugiausiai investicijų?", a: "Žemės ūkis ir regionų plėtra", accept: ["žemės ūkis+regionų", "zemes ukis+regionu", "ūkis+regionai", "ukis+regionai"], wrong: ["Kariuomenė ir policija", "Sportas ir kultūra", "Turizmas ir reklama"] },
  { id: "s19", section: S5, q: "Kas yra sanglaudos politika?", a: "Regioninių atsilikimo skirtumų mažinimas", accept: ["regioninių skirtumų mažinimas", "regioniniu skirtumu mazinimas", "atsilikimo skirtumų mažinimas", "skirtumų mažinimas"], wrong: ["Bendros kariuomenės kūrimas", "Sienų kontrolės stiprinimas", "Vienodų mokesčių įvedimas"] },
  { id: "s20", section: S5, q: "Kiek ES valstybių sudaro ES ir kiek jų turi eurą?", a: "27 valstybės; eurą turi 21", accept: ["27+21", "27+20"], wrong: ["28 valstybės; eurą turi visos", "25 valstybės; eurą turi 10", "30 valstybių; eurą turi 15"], note: "Nuo 2026 m. sausio eurą įsivedė Bulgarija – jau 21 valstybė. Vadovėlyje gali būti 20." },
  { id: "s21", section: S5, q: "Kokie ES plėtros tikslai?", a: "Pažangesnė, socialiai atsakingesnė, žalesnė, piliečiams artimesnė, geriau sujungta Europa", choiceOnly: true, wrong: ["Didesnė kariuomenė ir daugiau sienų", "Bendra kalba ir viena vyriausybė", "Daugiau anglių kasybos"] },
  { id: "s22", section: S5, q: "Į ką nukreipti ES finansuojami projektai (be žemės ūkio)?", a: "Aplinkosaugą, klimato kaitą ir sanglaudos politiką", choiceOnly: true, wrong: ["Karybą ir ginklus", "Kosmoso tyrimus", "Kazino ir loterijas"] },
  { id: "s23", section: S5, q: "Paaiškink ES laisvę „nevaržomas kapitalo judėjimas“", a: "Pinigus ir investicijas galima laisvai pervesti ir investuoti bet kurioje ES valstybėje", choiceOnly: true, wrong: ["Žmonės gali laisvai keliauti be vizų", "Prekės gabenamos be muitų", "Galima dirbti bet kurioje ES šalyje"] },
  /* iš kontrolinio pavyzdžių */
  { id: "s24", section: S5, q: "Kurioje eilutėje nurodytos valstybės NĖRA ES narės?", a: "Šveicarija, Norvegija", choiceOnly: true, wrong: ["Kipras, Malta", "Slovakija, Čekija", "Suomija, Estija"], note: "Šveicarija, Norvegija, Islandija, JK, Juodkalnija, Serbija, Ukraina – ne ES." },
  { id: "s25", section: S5, q: "Kurioje eilutėje nurodytos valstybės NĖRA ES narės?", a: "Islandija, Juodkalnija", choiceOnly: true, wrong: ["Slovėnija, Kroatija", "Suomija, Estija", "Kipras, Malta"] },
  { id: "s26", section: S5, q: "Kurioje eilutėje nurodytos ES valstybės?", a: "Kipras, Malta", choiceOnly: true, wrong: ["Šveicarija, Norvegija", "Islandija, Juodkalnija", "Serbija, Ukraina"] },
  { id: "s27", section: S5, q: "Kuri iš šių valstybių yra ES narė?", a: "Kroatija", wrong: ["Norvegija", "Šveicarija", "Serbija"] },
  { id: "s28", section: S5, q: "Kuri iš šių valstybių NĖRA ES narė?", a: "Norvegija", wrong: ["Suomija", "Estija", "Slovėnija"] },

  /* ---------- VI. Stipri ir silpna Europa (58–61 psl.) ---------- */
  { id: "r1", section: S6, q: "Periferija – tai:", a: "Pasyvus, atsilikusios ekonomikos regionas", choiceOnly: true, wrong: ["Ekonomiškai išsivystęs valstybės regionas", "Sparčiai kylančios ekonomikos regionas", "Regionas su daugiausiai universitetų"] },
  { id: "r2", section: S6, q: "Žinių ekonomikos branduolys – tai:", a: "Aktyvus, aukštos ekonomikos regionas", choiceOnly: true, wrong: ["Ekonomiškai atsilikęs regionas", "Sparčiai kylančios ekonomikos regionas", "Žemės ūkio regionas"] },
  { id: "r3", section: S6, q: "Kokios savybės būdingos žinių ekonomikos branduoliui (aktyviems regionams)?", a: "Daug darbo vietų pramonėje ir paslaugose, didelės pajamos, maža bedarbystė, geras transportas, kvalifikuota darbo jėga", choiceOnly: true,
    wrong: ["Emigracija, gyventojų senėjimas, blogas susisiekimas", "Daug dirba žemės ūkyje, didelis gimstamumas", "Seni pramonės rajonai, ribota rinka"] },
  { id: "r4", section: S6, q: "Kokios savybės būdingos periferijai (pasyviems regionams)?", a: "Emigracija, gyventojų senėjimas, seni pramoniniai regionai, blogas susisiekimas", choiceOnly: true,
    wrong: ["Didelės pajamos, maža bedarbystė", "Kvalifikuota darbo jėga, geras transportas", "Daug universitetų ir technologijų"] },
  { id: "r5", section: S6, q: "Kurioje eilutėje minima aktyvaus regiono savybė?", a: "Kvalifikuota darbo jėga", accept: ["kvalifikuota darbo jega"], wrong: ["Seni pramonės rajonai", "Ribota rinka", "Gyventojų senėjimas"] },
  { id: "r6", section: S6, q: "Kurioje eilutėje minima pasyvios ekonomikos savybė?", a: "Gyventojų senėjimas", accept: ["gyventoju senejimas", "senėjimas", "emigracija"], wrong: ["Maža bedarbystė", "Vystomos paslaugos", "Kvalifikuota darbo jėga"] },
  { id: "r7", section: S6, q: "Kas sukūrė mėlynojo banano modelį?", a: "Prancūzai", accept: ["prancuzai", "prancūzija"], wrong: ["Italai", "Ispanai", "Vokiečiai"] },
  { id: "r8", section: S6, q: "Nuo kur iki kur driekiasi mėlynasis bananas?", a: "Nuo Šiaurės Anglijos iki Šiaurės Italijos", accept: ["anglijos+italijos", "anglija+italija"], wrong: ["Nuo Paryžiaus iki Berlyno", "Nuo Lisabonos iki Atėnų", "Nuo Stokholmo iki Helsinkio"] },
  { id: "r9", section: S6, q: "Kurios valstybės patenka į mėlynojo banano modelį?", a: "Didžioji Britanija, Nyderlandai, Belgija, Liuksemburgas, Vokietija, Šveicarija, Šiaurės Italija", choiceOnly: true,
    wrong: ["Ispanija, Portugalija, Graikija, Kipras, Malta", "Lenkija, Lietuva, Latvija, Estija, Suomija", "Rumunija, Bulgarija, Serbija, Albanija"] },
  { id: "r10", section: S6, q: "Tarp kurių dviejų sostinių driekiasi geltonasis bananas?", a: "Paryžius ir Berlynas", accept: ["paryžius+berlynas", "paryzius+berlynas"], wrong: ["Turinas ir Sevilija", "Neapolis ir Atėnai", "Londonas ir Milanas"] },
  { id: "r11", section: S6, q: "Kurios jūros pakrantes apima Saulės juosta?", a: "Viduržemio", accept: ["vidurzemio", "viduržemio jūros"], wrong: ["Juodosios", "Azovo", "Baltijos"] },
  { id: "r12", section: S6, q: "Kur yra Baltijos jūros ekonominė zona?", a: "Pietų Baltijos pakrantės", accept: ["pietų baltijos", "pietu baltijos", "baltijos pakrantes"], wrong: ["Viduržemio jūros pakrantės", "Šiaurės Anglija", "Alpių regionas"] },
  { id: "r13", section: S6, q: "Pagal ką prancūzai išskyrė Europos regionus (mėlynojo banano modelį)?", a: "Gyventojų tankį, universitetus, miestų dydį, paslaugų kokybę, technologijų vystymą", choiceOnly: true, wrong: ["Klimatą, reljefą ir upes", "Kalbą ir religiją", "Vėliavų spalvas ir himnus"] },
  { id: "r14", section: S6, q: "Koks istorinis įvykis pažadino tarptautinę konkurenciją Europoje XX a. pabaigoje (1989 m.)?", a: "Geležinės uždangos griūtis", accept: ["geležinės uždangos", "gelezines uzdangos", "berlyno sienos griūtis", "berlyno sienos griutis"], wrong: ["Antrasis pasaulinis karas", "Rusijos ir Ukrainos karas", "ES įkūrimas"] },
  { id: "r15", section: S6, q: "Kuri savybė stiprina regiono ekonomiką?", a: "Rastos iškasenos", accept: ["iškasenos", "iskasenos"], wrong: ["Emigracija", "Pramonės sumenkimas", "Gyventojų senėjimas"] },
  { id: "r16", section: S6, q: "Pagal ką vertinami Europos regionai?", a: "Pagal perkamosios galios BVP 1 gyventojui", accept: ["perkamosios galios bvp", "bvp 1 gyv pagal perkamąją galią", "bvp pagal pg", "perkamosios galios"], wrong: ["Pagal vidutinę gyvenimo trukmę", "Pagal ŽSRI", "Pagal gyventojų skaičių"] },
  { id: "r17", section: S6, q: "Kokie veiksniai lėmė stiprių Europos regionų plėtrą?", a: "Pramonės augimas XIX a., iškasenos, darbo jėga, rinka, keliai, mokslo potencialas, dideli miestai", choiceOnly: true, wrong: ["Sausros, kalnai ir salos", "Kolonijinė praeitis ir diktatūros", "Emigracija ir gyventojų senėjimas"] },
  { id: "r18", section: S6, q: "Kokie du veiksniai pastaruoju metu stabdė regioninę plėtrą Europoje?", a: "COVID-19 pandemija ir Rusijos–Ukrainos karas", accept: ["covid+karas", "pandemija+karas", "covid+ukrain"], wrong: ["Breksitas ir euro įvedimas", "Geležinės uždangos griūtis ir ES plėtra", "Sausros ir potvyniai"] },
  /* iš kontrolinio pavyzdžių */
  { id: "r19", section: S6, q: "Kaip dėl savo funkcijų ir svarbos dažnai vadinami ekonomiškai aktyvūs Europos regionai?", a: "Žinių ekonomikos branduoliai", accept: ["žinių ekonomikos branduolys", "ziniu ekonomikos branduolys", "branduolys", "branduoliai"], wrong: ["Geltonasis bananas", "Mėlynasis bananas", "Saulės juosta"] },
  { id: "r20", section: S6, q: "Ką vaizduoja juosta, vadinama mėlynuoju bananu, besidriekianti nuo Anglijos iki Italijos?", a: "Europos regionus, kuriuose BVP yra didžiausias", choiceOnly: true,
    wrong: ["Regionus, kuriuose pramonės perversmas prasidėjo anksčiausiai", "Regionus, kur didžiausia dirbančių pramonėje dalis", "Regionus, kur intensyvi prekyba ir kaupiasi pramoninis kapitalas"], note: "1989 m. prancūzų geografai; Europos „ekonomikos stuburas“ – didžiausio gyventojų tankio, miestų ir BVP zona." },
  { id: "r21", section: S6, q: "Kuri valstybė NEPATENKA į mėlynojo banano teritoriją?", a: "Airija", wrong: ["Nyderlandai", "Belgija", "Liuksemburgas"], note: "Mėlynasis bananas: Š. Anglija – Beneliuksas – Vakarų Vokietija – Šveicarija – Š. Italija." },
  { id: "r22", section: S6, q: "Kuri valstybė NEPATENKA į geltonojo banano teritoriją?", a: "Italija", wrong: ["Nyderlandai", "Belgija", "Vokietija"], note: "Geltonasis bananas: nuo Paryžiaus iki Berlyno – Prancūzija, Belgija, Nyderlandai, Vokietija." },
  { id: "r23", section: S6, q: "Paaiškink sąvoką „mėlynasis bananas“", a: "Ekonomiškai aktyviausių Europos regionų juosta nuo Šiaurės Anglijos iki Šiaurės Italijos", choiceOnly: true, wrong: ["Aktyvių regionų juosta nuo Paryžiaus iki Berlyno", "Viduržemio jūros pakrančių regionai", "Pietų Baltijos pakrančių ekonominė zona"] },
  { id: "r24", section: S6, q: "Paaiškink sąvoką „geltonasis bananas“", a: "Aktyvių regionų juosta nuo Paryžiaus iki Berlyno", choiceOnly: true, wrong: ["Juosta nuo Šiaurės Anglijos iki Šiaurės Italijos", "Viduržemio jūros pakrančių regionai", "Pietų Baltijos pakrančių ekonominė zona"] },
  { id: "r25", section: S6, q: "Kuriais metais prancūzų geografai sukūrė mėlynojo banano modelį?", a: "1989", accept: ["1989 m"], wrong: ["1957", "1973", "2004"], note: "Tais pačiais metais griuvo geležinė uždanga." },

  /* ---------- VII. Kas trukdo šalims vystytis (62–63 psl.) ---------- */
  { id: "k1", section: S7, q: "Kokios 4 kliūtys trukdo valstybėms vystytis?", a: "Istorinės, gamtinės, socialinės ir politinės, ekonominės", accept: ["istorinės+gamtinės+ekonominės", "istorines+gamtines+ekonomines"], wrong: ["Kalbinės, religinės, kultūrinės, sportinės", "Klimato, reljefo, vandens, dirvožemio", "Vidaus, užsienio, karinės, švietimo"] },
  { id: "k2", section: S7, q: "Kas yra metropolija?", a: "Šalis valdytoja, kuriai kolonijos tiekė iškasenas ir žaliavas", accept: ["šalis valdytoja", "salis valdytoja", "valdytoja", "kolonijų valdytoja", "koloniju valdytoja"], wrong: ["Kolonija", "Didžiausias šalies miestas", "Sostinė"] },
  { id: "k3", section: S7, q: "Kuo skiriasi kolonija nuo metropolijos?", a: "Kolonija – valdoma teritorija, tiekusi žaliavas; metropolija – ją valdžiusi šalis", choiceOnly: true, wrong: ["Kolonija – miestas, metropolija – kaimas", "Kolonija Europoje, metropolija Afrikoje", "Niekuo nesiskiria"] },
  { id: "k4", section: S7, q: "Kodėl kolonijų sienų nustatymas tampa karų priežastimi?", a: "Sienos išvestos nepaisant tautų – jos išskyrė tautas ir sukėlė etninius konfliktus", choiceOnly: true, wrong: ["Nes sienos per ilgos ir brangios saugoti", "Nes sienos eina per kalnus", "Nes sienos nubrėžtos upėmis"] },
  { id: "k5", section: S7, q: "Kodėl salų, kalnų ir žemyninėms valstybėms sunku vystytis (įsitvirtinti rinkoje)?", a: "Sunku eksportuoti ir importuoti produktus", accept: ["sunku eksportuoti", "eksportuoti+importuoti", "sunkus susisiekimas"], wrong: ["Ten per daug turistų", "Jos neturi gyventojų", "Ten per daug iškasenų"] },
  { id: "k6", section: S7, q: "Kodėl šalto, sauso ar karšto klimato valstybės atsilieka?", a: "Neužsiaugina pakankamai maisto", accept: ["neuzsiaugina maisto", "maisto", "trūksta maisto", "truksta maisto"], wrong: ["Per daug lyja", "Per daug turistų", "Ten nėra upių"] },
  { id: "k7", section: S7, q: "Kas yra diktatūrinis valdymas?", a: "Valdžia vieno žmogaus rankose", accept: ["vieno žmogaus", "vieno zmogaus", "vienas žmogus valdo", "vienas zmogus"], wrong: ["Valdžia tautos renkamo parlamento rankose", "Valdžia karaliaus ir parlamento rankose", "Valdžia dvasininkų rankose"], note: "Diktatorius teikia pirmenybę giminaičiams ir tautiečiams, siekia naudos tik sau." },
  { id: "k8", section: S7, q: "Kas yra korupcija?", a: "Papirkinėjimas", accept: ["papirkinejimas", "kyšininkavimas", "kysininkavimas", "kyšiai"], wrong: ["Emigracija", "Nepotizmas", "Cenzūra"] },
  { id: "k9", section: S7, q: "Kas yra nepotizmas?", a: "Giminių ir draugų įdarbinimas valdžios institucijose", accept: ["giminių įdarbinimas", "giminiu idarbinimas", "giminių+draugų", "giminiu+draugu"], wrong: ["Papirkinėjimas", "Rinkimų klastojimas", "Spaudos cenzūra"] },
  { id: "k10", section: S7, q: "Kodėl iškasenų ir žemės ūkio žaliavų eksportas tampa ekonomine kliūtimi?", a: "Žaliavų kainos svyruoja, o brangesnę pramonės produkciją reikia pirkti", choiceOnly: true, wrong: ["Nes žaliavų niekas neperka", "Nes žaliavas sunku vežti", "Nes žaliavos greitai baigiasi"] },
  { id: "k11", section: S7, q: "Ką daro stipriosios valstybės, saugodamos savo ekonomiką?", a: "Uždeda prekėms muitus", accept: ["muitus", "muitai", "muitas"], wrong: ["Skolina pinigus be palūkanų", "Atidaro sienas", "Perka daugiau žaliavų"] },
  { id: "k12", section: S7, q: "Silpnosios valstybės skolinasi pinigų ir...", a: "Neturi iš kur grąžinti", accept: ["neturi is kur grazinti", "negali grąžinti", "negali grazinti", "negrąžina", "negrazina"], wrong: ["Greitai praturtėja", "Investuoja į kosmosą", "Perka kolonijas"] },
  { id: "k13", section: S7, q: "Kokia kliūtis yra kolonijinė praeitis?", a: "Istorinės kliūtys", accept: ["istorinės", "istorines", "istorinė"], wrong: KLIUTYS.filter((k) => k !== "Istorinės kliūtys") },
  { id: "k14", section: S7, q: "Kokia kliūtis yra nepalanki geografinė padėtis ir klimatas?", a: "Gamtinės kliūtys", accept: ["gamtinės", "gamtines", "gamtinė"], wrong: KLIUTYS.filter((k) => k !== "Gamtinės kliūtys") },
  { id: "k15", section: S7, q: "Kokia kliūtis yra diktatūra ir korupcija?", a: "Socialinės ir politinės kliūtys", accept: ["socialinės ir politinės", "socialines ir politines", "politinės", "politines", "socialinės", "socialines"], wrong: KLIUTYS.filter((k) => k !== "Socialinės ir politinės kliūtys") },
  { id: "k16", section: S7, q: "Kokia kliūtis yra žaliavų eksportas, muitai ir skolos?", a: "Ekonominės kliūtys", accept: ["ekonominės", "ekonomines", "ekonominė"], wrong: KLIUTYS.filter((k) => k !== "Ekonominės kliūtys") },
  kliutis("k17", "Sausrų pažeista teritorija", "Gamtinės kliūtys"),
  kliutis("k18", "Dešimtmečiais nesikeičiantys valstybių prezidentai", "Socialinės ir politinės kliūtys", "Valdžia vieno žmogaus rankose – diktatūra."),
  kliutis("k19", "Diskriminacija rasės, kalbos, religijos, tradicijų pagrindu", "Socialinės ir politinės kliūtys"),
  kliutis("k20", "Ekonomikos sistema kuriama tenkinti metropolijos poreikius", "Istorinės kliūtys", "Kolonijinė praeitis: ūkis tiekė žaliavas metropolijai."),
  kliutis("k21", "Finansų stygius švietimo, sveikatos ir infrastruktūros plėtrai", "Ekonominės kliūtys"),
  kliutis("k22", "Geografinė padėtis atokiai esančiose salose", "Gamtinės kliūtys"),
  kliutis("k23", "Geometrinių sienų nustatymas, nepaisant etninių grupių pasiskirstymo", "Istorinės kliūtys", "Kolonijinės sienos išskyrė tautas ir sukėlė etninius karus."),
  kliutis("k24", "Menkas raštingumo lygis, trūksta vietos specialistų", "Socialinės ir politinės kliūtys"),
  kliutis("k25", "Priklausomybė nuo pasaulinės rinkos kainų svyravimo", "Ekonominės kliūtys", "Parduodamų žaliavų kainos svyruoja."),
  kliutis("k26", "Primesti, vietos kultūros neatitinkantys politiniai valdymo metodai", "Istorinės kliūtys", "Paveldėti iš kolonijinių laikų."),
  kliutis("k27", "Sistemingi žmogaus teisių pažeidimai ir persekiojimas", "Socialinės ir politinės kliūtys"),
  kliutis("k28", "Šalies įsikūrimas aukštikalnių teritorijose", "Gamtinės kliūtys", "Kalnų valstybėms sunku eksportuoti ir importuoti."),
  kliutis("k29", "Šimtmečiais nusistovėję pigių išteklių mainai su Europa", "Istorinės kliūtys"),
  kliutis("k30", "Teritorija, kuriai būdingas sausringas klimatas", "Gamtinės kliūtys", "Sauso klimato šalys neužsiaugina pakankamai maisto."),
  kliutis("k31", "Užsienio pagalbos pinigai nepasiekia tų, kuriems buvo skirti", "Socialinės ir politinės kliūtys", "Korupcija – papirkinėjimas."),
  kliutis("k32", "Giminių ir draugų įdarbinimas valdžios institucijose (nepotizmas)", "Socialinės ir politinės kliūtys"),
  kliutis("k33", "Valdžios papirkinėjimo atvejai ir paplitusi korupcija", "Socialinės ir politinės kliūtys"),
  kliutis("k34", "Vandens išteklių stokojančios teritorijos", "Gamtinės kliūtys"),
  kliutis("k35", "Vyraujantis naudingųjų iškasenų eksportas", "Ekonominės kliūtys", "Parduoda žaliavas, perka brangią pramonės produkciją."),
  kliutis("k36", "Žaliavų ir produkcijos patekimo į kitų šalių rinką apribojimai (muitai)", "Ekonominės kliūtys", "Stipriosios valstybės uždeda muitus."),
  /* iš kontrolinio pavyzdžių */
  kliutis("k37", "Žemės ūkio žaliavų eksportas", "Ekonominės kliūtys", "Žaliavų kainos svyruoja, o pramonės produkciją tenka pirkti brangiai."),
  kliutis("k38", "Gyventojų tautinė, religinė, finansinė diskriminacija", "Socialinės ir politinės kliūtys"),
  { id: "k39", section: S7, q: "Kaip vadinamas giminių ir artimųjų įdarbinimas valstybės sektoriuje?", a: "Nepotizmas", accept: ["nepotizmu"], wrong: ["Absoliutizmas", "Metropolija", "Kolonija"] },

  /* ---------- Šalių pavyzdžiai: Kongo DR ir Bangladešas ---------- */
  { id: "c1", section: S8, q: "Kongo Demokratinės Respublikos sostinė", a: "Kinšasa", accept: ["kinshasa"], wrong: ["Daka", "Bogota", "Seulas"] },
  { id: "c2", section: S8, q: "Bangladešo sostinė", a: "Daka", accept: ["dhaka"], wrong: ["Kinšasa", "Kolkata", "Seulas"] },
  { id: "c3", section: S8, q: "Kolumbijos sostinė", a: "Bogota", accept: ["bogotà", "bogota"], wrong: ["Kinšasa", "Seulas", "Kolkata"] },
  { id: "c4", section: S8, q: "Kurios valstybės sostinė yra Seulas?", a: "Pietų Korėja", accept: ["pietu koreja", "korėja", "koreja"], wrong: ["Kolumbija", "Bangladešas", "Kongo DR"] },
  { id: "c5", section: S8, q: "Kuriame mieste yra Kolkata: Indijoje, Bangladeše, Pakistane ar Kongo DR?", a: "Indijoje", accept: ["indija"], wrong: ["Bangladeše", "Pakistane", "Kongo DR"], note: "Kolkata – Indijos miestas prie Bangladešo sienos, ne sostinė." },
  { id: "c6", section: S8, q: "Kuri pramonės šaka reikšminga Bangladešui?", a: "Tekstilės", accept: ["tekstile", "tekstilė", "drabužių", "drabuziu", "tekstiles pramone"], wrong: ["Aukštųjų technologijų", "Mašinų", "Chemijos"], note: "Bangladešas – vienas didžiausių drabužių eksportuotojų pasaulyje (pigi darbo jėga)." },
  { id: "c7", section: S8, q: "Kokia gamtinė kliūtis būdinga Bangladešui?", a: "Potvyniai ir musonų liūtys (Gango–Brahmaputros delta, ciklonai)", choiceOnly: true, wrong: ["Sausros ir dykumos", "Aukštikalnės ir kalnų perėjos", "Šaltas klimatas ir įšalas"] },
  { id: "c8", section: S8, q: "Kurios metropolijos kolonija buvo Bangladešas (kaip Britų Indijos dalis)?", a: "Didžiosios Britanijos", accept: ["britanija", "britanijos", "jk", "anglija", "anglijos", "jungtinė karalystė", "jungtine karalyste", "didžioji britanija", "didzioji britanija"], wrong: ["Prancūzijos", "Belgijos", "Portugalijos"] },
  { id: "c9", section: S8, q: "Kuriais metais Bangladešas tapo nepriklausomas (atsiskyrė nuo Pakistano)?", a: "1971", accept: ["1971 m"], wrong: ["1947", "1960", "1991"], note: "1947 m. Britų Indija padalyta į Indiją ir Pakistaną; Rytų Pakistanas 1971 m. tapo Bangladešu." },
  { id: "c10", section: S8, q: "Kurios metropolijos kolonija buvo Kongo DR?", a: "Belgijos", accept: ["belgija"], wrong: ["Prancūzijos", "Didžiosios Britanijos", "Portugalijos"], note: "Belgijos Kongas, nepriklausomybė – 1960 m." },
  { id: "c11", section: S8, q: "Kuriais metais Kongo DR tapo nepriklausoma?", a: "1960", accept: ["1960 m"], wrong: ["1947", "1971", "1991"] },
  { id: "c12", section: S8, q: "Kokiais gamtos turtais garsi Kongo DR?", a: "Iškasenomis: varis, kobaltas, koltanas, deimantai", choiceOnly: true, wrong: ["Nafta ir gamtinėmis dujomis", "Anglimi ir geležies rūda", "Derlingu dirvožemiu ir kviečiais"], note: "Turtinga iškasenų, bet skurdi – „išteklių prakeiksmas“." },
  { id: "c13", section: S8, q: "Kokios kliūtys trukdo Kongo DR vystytis?", a: "Kolonijinė praeitis, etniniai konfliktai ir karai, korupcija, priklausomybė nuo iškasenų eksporto", choiceOnly: true, wrong: ["Šaltas klimatas ir atoki sala", "Per mažas gyventojų skaičius", "Per didelė ES priklausomybė"] },
  { id: "c14", section: S8, q: "Kuriai ŽSRI grupei priklauso Kongo DR?", a: "Besivystančios (žemas ŽSRI)", accept: ["besivystančios", "besivystancios", "besivystanti", "žemas", "zemas", "silpna"], wrong: ["Išsivysčiusios (aukštas ŽSRI)", "Pažangios (vidutinis ŽSRI)", "Ekonomiškai stiprios"] },
  { id: "c15", section: S8, q: "Kodėl Bangladeše labai didelis gyventojų tankis?", a: "Maža teritorija derlingoje Gango–Brahmaputros deltoje ir apie 170 mln. gyventojų", choiceOnly: true, wrong: ["Didelė teritorija ir mažai gyventojų", "Kalnuota teritorija", "Didelė imigracija iš Europos"] },
  { id: "c16", section: S8, q: "Kiek maždaug kartų Bangladešo gyventojų (~170 mln.) daugiau nei Lietuvos (~2,9 mln.)?", a: "Apie 60 kartų", accept: ["60", "apie 60", "~60", "58", "59"], wrong: ["Apie 6 kartus", "Apie 600 kartų", "Apie 20 kartų"] },
  { id: "c17", section: S8, q: "Kuriame žemyne yra Kongo DR, o kuriame – Bangladešas?", a: "Kongo DR – Afrikoje, Bangladešas – Azijoje", accept: ["afrika+azija"], wrong: ["Abi Afrikoje", "Abi Azijoje", "Kongo DR – Azijoje, Bangladešas – Afrikoje"] },

  /* ---------- Europos ribos ---------- */
  { id: "b1", section: S9, q: "Kokiais kalnais rytuose vedama Europos ir Azijos riba?", a: "Uralo kalnais", accept: ["uralo", "uralas", "uralo kalnai", "uralu"], wrong: ["Alpėmis", "Karpatais", "Pirėnais"] },
  { id: "b2", section: S9, q: "Kokia upe vedama Europos ir Azijos riba (į pietus nuo Uralo kalnų)?", a: "Uralo upe", accept: ["uralo", "uralas", "uralu", "emba"], wrong: ["Volga", "Dunojumi", "Dniepru"] },
  { id: "b3", section: S9, q: "Kokia ežeru-jūra vedama Europos riba pietryčiuose?", a: "Kaspijos jūra", accept: ["kaspija", "kaspijos"], wrong: ["Baltijos jūra", "Šiaurės jūra", "Raudonąja jūra"] },
  { id: "b4", section: S9, q: "Kokie kalnai tarp Juodosios ir Kaspijos jūrų, kuriais vedama Europos riba?", a: "Kaukazas", accept: ["kaukazo", "kaukazo kalnai", "kaukazu"], wrong: ["Uralas", "Alpės", "Karpatai"] },
  { id: "b5", section: S9, q: "Kuria jūra NĖRA vedama Europos žemyno geografinė riba?", a: "Raudonąja", accept: ["raudonoji", "raudonoji jura", "raudonaja"], wrong: ["Juodąja", "Viduržemio", "Marmuro"], note: "Raudonoji jūra skiria Afriką nuo Azijos." },
  { id: "b6", section: S9, q: "Kokiu sąsiauriu vedama Europos ir Azijos riba (jis skiria Stambulą į dvi dalis)?", a: "Bosforo sąsiauriu", accept: ["bosforo", "bosforas", "bosforu"], wrong: ["Gibraltaro", "Lamanšo", "Beringo"], note: "Bosforas → Marmuro jūra → Dardanelai jungia Juodąją ir Viduržemio jūras." },
  { id: "b7", section: S9, q: "Koks sąsiauris skiria Europą nuo Afrikos?", a: "Gibraltaro", accept: ["gibraltaras", "gibraltaro sąsiauris", "gibraltaro sasiauris"], wrong: ["Bosforo", "Lamanšo", "Dardanelų"] },
  { id: "b8", section: S9, q: "Kokia jūra skiria Europą nuo Afrikos?", a: "Viduržemio", accept: ["vidurzemio", "viduržemio jūra"], wrong: ["Juodoji", "Kaspijos", "Raudonoji"] },
  { id: "b9", section: S9, q: "Išvardink Europos ir Azijos ribos objektus (nuo šiaurės į pietus)", a: "Uralo kalnai, Uralo upė, Kaspijos jūra, Kaukazas, Juodoji jūra, Bosforas, Marmuro jūra, Dardanelai, Viduržemio jūra", choiceOnly: true,
    wrong: ["Alpės, Dunojus, Baltijos jūra, Šiaurės jūra", "Karpatai, Volga, Azovo jūra, Raudonoji jūra", "Pirėnai, Rona, Ligūrijos jūra, Gibraltaras"] },
  { id: "b10", section: S9, q: "Koks sąsiauris skiria Didžiąją Britaniją nuo žemyninės Europos?", a: "Lamanšas", accept: ["lamanšo", "lamanso", "lamansas", "la manche"], wrong: ["Gibraltaro", "Bosforo", "Dardanelų"] },
];

export const topicById = new Map(topics.map((t) => [t.id, t]));
export const KD1_SECTIONS = [S1, S2, S3, S4, S5, S6, S7, S8, S9];
