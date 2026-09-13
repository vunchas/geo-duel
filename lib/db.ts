import { env } from 'cloudflare:workers';
export function db():D1Database{const binding=(env as unknown as {DB?:D1Database}).DB;if(!binding)throw Error('Mokymosi kambariai laikinai nepasiekiami. Bandyk dar kartą.');return binding;}
