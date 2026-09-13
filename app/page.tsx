"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, BookOpen, Check, Copy, Flame, PenLine, Swords, Trophy, X, Zap } from "lucide-react";
import { WorldMap, neighborIso3 } from "@/components/WorldMap";
import type { PublicGame, Settings } from "@/lib/game";
import { countries, regions } from "@/lib/game";
import { flagUrl } from "@/lib/geo";
import { emptyStats, loadStats, masteredCount, recordAnswer, saveStats, touchDay, type Stats } from "@/lib/stats";

function Flag({ isoA3, size = 28 }: { isoA3?: string; size?: number }) {
  const src = flagUrl(isoA3);
  if (!src) return null;
  // eslint-disable-next-line @next/next/no-img-element
  return <img className="flag" src={src} alt="" width={size * 4 / 3} height={size} loading="lazy" />;
}

const TOKEN_KEY = "atlas-player-token";
const NAME_KEY = "atlas-player-name";

function playerToken() {
  let token = localStorage.getItem(TOKEN_KEY);
  if (!token || !/^[a-f0-9-]{36,80}$/i.test(token)) {
    token = crypto.randomUUID();
    localStorage.setItem(TOKEN_KEY, token);
  }
  return token;
}

async function requestGame(body?: Record<string, unknown>, code?: string) {
  const res = await fetch(body ? "/api/game" : `/api/game?code=${encodeURIComponent(code || "")}`, {
    method: body ? "POST" : "GET",
    cache: "no-store",
    headers: { "Content-Type": "application/json", "X-Player-Token": playerToken() },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = (await res.json()) as PublicGame & { error?: string };
  if (!res.ok) throw new Error(data.error || "Nepavyko susisiekti su kambariu.");
  return data;
}

/** Learn mode: multiple choice on the first pass, typed answers once you retry misses. */
function usesChoice(game: PublicGame) {
  if (!game.question) return false;
  if (game.settings.input === "choice") return true;
  if (game.settings.input === "mix") return game.round === 0;
  return false;
}

const modeOptions: { value: Settings["mode"]; label: string }[] = [
  { value: "mixed", label: "Valstybės ir sostinės" },
  { value: "map", label: "Tik valstybės žemėlapyje" },
  { value: "capital", label: "Tik sostinės" },
];

const duelLengths: { value: number; label: string; hint: string }[] = [
  { value: 20, label: "Greita dvikova", hint: "20 klausimų" },
  { value: 40, label: "Apšilimas", hint: "40 klausimų" },
  { value: 60, label: "Ruošiuosi kontroliniam", hint: "60 klausimų" },
  { value: 80, label: "Išmokti viską", hint: "80 klausimų" },
];

const countryByName = new Map(countries.map((c) => [c.country, c]));
const countryByIso = new Map(countries.map((c) => [c.isoA3, c]));
const capitalCount = countries.filter((c) => c.capitalRequired).length;
const totalItems = countries.length + capitalCount;

export default function Home() {
  const [name, setName] = useState("");
  const [mode, setMode] = useState<Settings["mode"]>("mixed");
  const [joinCode, setJoinCode] = useState("");
  const [duelRounds, setDuelRounds] = useState(20);
  const [showDuel, setShowDuel] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [game, setGame] = useState<PublicGame | null>(null);
  const [answer, setAnswer] = useState("");
  const [copied, setCopied] = useState(false);
  const [now, setNow] = useState(0);
  const [stats, setStats] = useState<Stats>(emptyStats);
  const [streak, setStreak] = useState(0);
  const [sessionBest, setSessionBest] = useState(0);
  const [toast, setToast] = useState("");
  const streakRef = useRef(0);
  const scoredRef = useRef<string | null>(null);

  useEffect(() => {
    // Hydration-safe read of persisted state; only runs on the client after mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStats(loadStats());
    setName(localStorage.getItem(NAME_KEY) || "");
    const code = (new URLSearchParams(window.location.search).get("code") || "").toUpperCase();
    if (!code) return;
    // Refreshing mid-session should resume it; otherwise treat the code as an invite.
    requestGame(undefined, code)
      .then((existing) => setGame(existing))
      .catch(() => {
        setJoinCode(code);
        setShowDuel(true);
      });
  }, []);

  useEffect(() => {
    if (!game?.code || game.solo) return;
    const tick = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(tick);
  }, [game?.code, game?.solo]);

  useEffect(() => {
    if (!game?.code || game.status === "finished" || game.solo) return;
    const id = setInterval(async () => {
      try {
        setGame(await requestGame(undefined, game.code));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Ryšys nutrūko.");
      }
    }, 1000);
    return () => clearInterval(id);
  }, [game?.code, game?.status, game?.solo]);

  const resetStreak = useCallback(() => {
    streakRef.current = 0;
    setStreak(0);
    scoredRef.current = null;
  }, []);

  // Streak + XP bookkeeping, once per answered question.
  const score = useCallback((next: PublicGame) => {
    const fb = next.feedback;
    const q = next.question;
    if (!fb || !q || scoredRef.current === q.id) return;
    scoredRef.current = q.id;
    const nextStreak = fb.correct ? streakRef.current + 1 : 0;
    streakRef.current = nextStreak;
    setStreak(nextStreak);
    setSessionBest((b) => Math.max(b, nextStreak));
    const bonus = fb.correct ? Math.min(nextStreak - 1, 5) * 5 : 0;
    setStats((s) => {
      const updated = recordAnswer(s, `${fb.country}|${q.kind}`, fb.correct, nextStreak, fb.correct ? 10 + bonus : 0);
      saveStats(updated);
      return updated;
    });
    if (fb.correct && nextStreak >= 3) {
      setToast(nextStreak >= 10 ? `${nextStreak} iš eilės. Nesustok.` : `${nextStreak} iš eilės!`);
      setTimeout(() => setToast(""), 1400);
    }
  }, []);

  const run = useCallback(
    async (body: Record<string, unknown>) => {
      setBusy(true);
      setError("");
      try {
        const next = await requestGame(body);
        setGame(next);
        setAnswer("");
        if (body.action === "answer") score(next);
        if (next.code) {
          const url = new URL(window.location.href);
          url.searchParams.set("code", next.code);
          window.history.replaceState(null, "", url);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Nepavyko.");
      } finally {
        setBusy(false);
      }
    },
    [score]
  );

  // Solo: correct answers advance on their own; wrong ones wait so you can read the fact card.
  const advanceCode = game?.solo && game.status === "playing" && game.feedback?.correct ? game.code : "";
  const advanceId = advanceCode ? game?.question?.id ?? "" : "";
  useEffect(() => {
    if (!advanceId) return;
    const t = setTimeout(() => run({ action: "next", code: advanceCode, questionId: advanceId }), 900);
    return () => clearTimeout(t);
  }, [advanceCode, advanceId, run]);

  const remaining = useMemo(() => {
    if (!game || game.solo || game.status !== "playing" || !now) return 60;
    const offset = now - game.serverNow;
    return Math.max(0, Math.ceil((60000 - (now - offset - game.startedAt)) / 1000));
  }, [game, now]);

  function start(kind: "learn" | "test" | "duel") {
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Įrašyk savo vardą.");
      return;
    }
    localStorage.setItem(NAME_KEY, trimmed);
    if (kind !== "duel") {
      setStats((s) => {
        const updated = touchDay(s);
        saveStats(updated);
        return updated;
      });
    }
    resetStreak();
    setSessionBest(0);
    return run({
      action: "create",
      name: trimmed,
      solo: kind !== "duel",
      settings: { mode, input: kind === "learn" ? "mix" : "write", region: regions[0], rounds: kind === "duel" ? duelRounds : 20 },
    });
  }

  function leave() {
    setGame(null);
    resetStreak();
    window.history.replaceState(null, "", "/");
  }

  async function copyText(text: string) {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  /* ---------- Lobby ---------- */
  if (game?.status === "lobby") {
    const host = game.me === 0;
    const link = `${window.location.origin}/?code=${game.code}`;
    return (
      <main className="study">
        <div className="study-top">
          <button className="icon-btn" onClick={leave} aria-label="Išeiti"><X size={20} /></button>
          <span className="study-count">Kambarys</span>
          <span />
        </div>
        <section className="lobby">
          <p className="label">Pasidalyk kodu</p>
          <p className="lobby-code">{game.code}</p>
          <div className="row">
            <button className="btn ghost" onClick={() => copyText(game.code)}><Copy size={18} />{copied ? "Nukopijuota" : "Kodas"}</button>
            <button className="btn ghost" onClick={() => copyText(link)}>Nuoroda</button>
          </div>
          <div className="row wrap">
            <span className="pill">{game.total} klausimų</span>
            <span className="pill">{modeOptions.find((o) => o.value === game.settings.mode)?.label}</span>
          </div>
          <p className="label">Žaidėjai · {game.players.length} / 8</p>
          <ul className="players">
            {game.players.map((p, i) => <li key={`${i}-${p.name}`}><Check size={16} />{p.name}{i === 0 ? <small className="dim"> · kūrėjas</small> : null}</li>)}
            {game.players.length < 2 && <li className="dim">Laukiama varžovų…</li>}
          </ul>
          {host ? (
            <button className="btn primary" disabled={busy || game.players.length < 2} onClick={() => run({ action: "start", code: game.code })}>
              Pradėti dvikovą{game.players.length > 1 ? ` (${game.players.length})` : ""} <ArrowRight size={18} />
            </button>
          ) : (
            <p className="dim">Kambario kūrėjas paleis žaidimą, kai visi susirinks.</p>
          )}
          {error && <p className="error">{error}</p>}
        </section>
      </main>
    );
  }

  /* ---------- Question ---------- */
  if (game?.status === "playing" && game.question) {
    const q = game.question;
    const fb = game.feedback;
    const choice = usesChoice(game);
    const done = game.index + (fb ? 1 : 0);
    const fact = fb ? countryByName.get(fb.country) : undefined;
    const neighborNames = fact ? neighborIso3(fact.isoA3).map((iso) => countryByIso.get(iso)?.country).filter(Boolean) : [];

    return (
      <main className="study">
        <div className="study-top">
          <button className="icon-btn" onClick={leave} aria-label="Išeiti"><X size={20} /></button>
          <span className="study-count">{game.index + 1} / {game.total}</span>
          <span className="chip streak" data-hot={streak >= 3}><Flame size={15} />{streak}</span>
        </div>
        <div className="bar"><span style={{ width: `${(done / game.total) * 100}%` }} /></div>

        {!game.solo && (
          <div className="duel-strip">
            {game.players.map((p, i) => (
              <span key={`${i}-${p.name}`} className="chip">{p.name} · {p.score}{p.answered ? " ✓" : ""}</span>
            ))}
            <span className="chip time">{remaining}s</span>
          </div>
        )}

        <section className="prompt">
          {q.kind === "map" ? (
            <>
              <p className="label">Kuri valstybė pažymėta?</p>
              <WorldMap isoA3={q.isoA3} highlightNeighbors={Boolean(fb)} />
            </>
          ) : (
            <>
              <p className="label">Sostinė</p>
              <h1 className="prompt-title"><Flag isoA3={countryByName.get(q.country || "")?.isoA3} size={30} /> {q.country}</h1>
            </>
          )}
        </section>

        {choice ? (
          <section className="answers">
            <p className="label">Pasirink atsakymą</p>
            {q.options.map((option) => {
              const isCorrect = fb?.expected === option;
              const isWrong = Boolean(fb && fb.text === option && !fb.correct);
              return (
                <button
                  key={option}
                  className={`answer${isCorrect && fb ? " is-correct" : ""}${isWrong ? " is-wrong" : ""}`}
                  disabled={busy || Boolean(fb)}
                  onClick={() => run({ action: "answer", code: game.code, questionId: q.id, answer: option })}
                >
                  {option}
                  {fb && isCorrect && <Check size={20} />}
                  {isWrong && <X size={20} />}
                </button>
              );
            })}
          </section>
        ) : !fb ? (
          <form
            className="answers"
            onSubmit={(e) => {
              e.preventDefault();
              run({ action: "answer", code: game.code, questionId: q.id, answer });
            }}
          >
            <p className="label">Įrašyk atsakymą</p>
            <input className="field" value={answer} onChange={(e) => setAnswer(e.target.value)} autoFocus autoComplete="off" maxLength={160} placeholder="Atsakymas" />
            <button className="btn primary" disabled={busy || !answer.trim()}>Atsakyti</button>
          </form>
        ) : null}

        {fb && (
          <section
            className={`verdict ${fb.correct ? "good" : "bad"}`}
            ref={(el) => el?.scrollIntoView({ behavior: "smooth", block: "nearest" })}
          >
            <p className="verdict-title">{fb.correct ? "Teisingai" : `Teisingas atsakymas: ${fb.expected}`}</p>
            {(!fb.correct || !game.solo) && fact && (
              <div className="fact">
                <div className="fact-head">
                  <Flag isoA3={fact.isoA3} size={34} />
                  <div>
                    <strong>{fact.country}</strong>
                    <span>{fact.continent}{fact.capitalRequired ? ` · sostinė ${fact.capital}` : ""}</span>
                  </div>
                </div>
                {q.kind === "capital" && <WorldMap isoA3={fact.isoA3} highlightNeighbors />}
                {neighborNames.length > 0 && (
                  <p className="neighbors">Kaimynės: {neighborNames.join(", ")}</p>
                )}
              </div>
            )}
            {(!fb.correct || !game.solo) && (
              <button
                className="btn primary"
                disabled={busy || (!game.solo && (!game.players.every((p) => p.answered) || game.players[game.me].ready))}
                onClick={() => run({ action: "next", code: game.code, questionId: q.id })}
              >
                {game.solo
                  ? "Toliau"
                  : !game.players.every((p) => p.answered)
                    ? `Atsakė ${game.players.filter((p) => p.answered).length} / ${game.players.length}`
                    : game.players[game.me].ready
                      ? "Laukiame kitų"
                      : game.me === 0 ? "Toliau visiems" : "Toliau"} <ArrowRight size={18} />
              </button>
            )}
          </section>
        )}
        {toast && <div className="toast"><Flame size={18} />{toast}</div>}
        {error && <p className="error">{error}</p>}
      </main>
    );
  }

  /* ---------- Results ---------- */
  if (game?.status === "finished") {
    const missed = game.review.filter((r) => !r.answer?.correct);
    const right = game.review.length - missed.length;
    const pct = Math.round((right / Math.max(1, game.review.length)) * 100);
    const ranked = game.players
      .map((p, index) => ({ ...p, index }))
      .sort((a, b) => b.score - a.score);
    const myPlace = ranked.findIndex((p) => p.index === game.me) + 1;
    const tiedForFirst = ranked.length > 1 && ranked[0].score === ranked[1].score;
    return (
      <main className="study">
        <div className="study-top">
          <button className="icon-btn" onClick={leave} aria-label="Išeiti"><X size={20} /></button>
          <span className="study-count">Rezultatai</span>
          <span />
        </div>
        <section className="results">
          <div className="ring" style={{ ["--pct" as string]: `${pct}%` }}>
            <strong>{pct}%</strong>
          </div>
          <h1 className="results-title">
            {game.solo
              ? pct === 100 ? "Idealiai." : pct >= 70 ? "Gerai einasi." : "Kartok ir įsiminsi."
              : myPlace === 1 ? (tiedForFirst ? "Lygiosios!" : "Laimėjai!") : `${myPlace} vieta iš ${ranked.length}`}
          </h1>
          <div className="pills">
            <span className="pill good"><Check size={15} />Žinai {right}</span>
            <span className="pill bad"><PenLine size={15} />Mokaisi {missed.length}</span>
            <span className="pill"><Flame size={15} />Geriausia serija {sessionBest}</span>
          </div>
          {!game.solo && (
            <ol className="scoreboard">
              {ranked.map((p, i) => (
                <li key={`${p.index}-${p.name}`} className={p.index === game.me ? "is-me" : ""}>
                  <span className="place">{i + 1}</span>
                  <span className="who">{p.name}</span>
                  <strong>{p.score}</strong>
                </li>
              ))}
            </ol>
          )}
          <div className="actions">
            {game.solo && missed.length > 0 && (
              <button className="btn primary" disabled={busy} onClick={() => { resetStreak(); run({ action: "retry", code: game.code }); }}>
                Kartoti {missed.length} klaidas <ArrowRight size={18} />
              </button>
            )}
            <button className={`btn ${game.solo && missed.length ? "ghost" : "primary"}`} onClick={leave}>Į pradžią</button>
          </div>
          <ul className="review">
            {game.review.map((r) => (
              <li key={r.id} className={r.answer?.correct ? "good" : "bad"}>
                <Flag isoA3={r.isoA3} size={22} />
                <span className="review-main">
                  <strong>{r.kind === "map" ? r.country : `${r.country} → ${r.expected}`}</strong>
                  {!r.answer?.correct && <small>{r.answer?.text ? `Tu: ${r.answer.text}` : "Praleista"}</small>}
                </span>
                {r.answer?.correct ? <Check size={18} /> : <X size={18} />}
              </li>
            ))}
          </ul>
          {error && <p className="error">{error}</p>}
        </section>
      </main>
    );
  }

  /* ---------- Home ---------- */
  const mastered = masteredCount(stats);
  return (
    <main className="home">
      <div className="home-top">
        <span className="brand">atlas</span>
        <div className="row">
          <span className="chip" title="Dienų iš eilės"><Flame size={15} />{stats.dayStreak}</span>
          <span className="chip" title="Patirtis"><Zap size={15} />{stats.xp} XP</span>
        </div>
      </div>

      <section className="hero">
        <p className="label">Geografijos rinkinys</p>
        <h1>{countries.length} valstybės.<br />{capitalCount} sostinės.</h1>
        <div className="hero-progress">
          <div className="bar"><span style={{ width: `${(mastered / totalItems) * 100}%` }} /></div>
          <span>{mastered} / {totalItems} išmokta</span>
        </div>
        <div className="row wrap">
          <span className="pill"><Trophy size={15} />Serija {stats.bestStreak}</span>
          <span className="pill">{stats.sessions} treniruotės</span>
        </div>
      </section>

      <section className="setup">
        <input className="field" value={name} onChange={(e) => setName(e.target.value)} placeholder="Tavo vardas" maxLength={20} />
        <select className="field" value={mode} onChange={(e) => setMode(e.target.value as Settings["mode"])}>
          {modeOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </section>

      <section className="modes">
        <button className="mode" disabled={busy} onClick={() => start("learn")}>
          <span className="mode-icon"><BookOpen size={20} /></span>
          <span className="mode-text"><strong>Mokytis</strong><small>4 pasirinkimai, klaidas kartoji raštu</small></span>
          <ArrowRight size={18} />
        </button>
        <button className="mode" disabled={busy} onClick={() => start("test")}>
          <span className="mode-icon"><PenLine size={20} /></span>
          <span className="mode-text"><strong>Testas</strong><small>Viską rašai pats, kaip per kontrolinį</small></span>
          <ArrowRight size={18} />
        </button>
        <button className="mode" disabled={busy} onClick={() => setShowDuel((v) => !v)}>
          <span className="mode-icon"><Swords size={20} /></span>
          <span className="mode-text"><strong>Dvikova</strong><small>2–8 žaidėjai, kiekvienas iš savo telefono</small></span>
          <ArrowRight size={18} style={{ transform: showDuel ? "rotate(90deg)" : undefined }} />
        </button>
        {showDuel && (
          <div className="duel-box">
            <p className="label">Dvikovos ilgis</p>
            <div className="lengths">
              {duelLengths.map((o) => (
                <button
                  key={o.value}
                  type="button"
                  className={`length${duelRounds === o.value ? " is-active" : ""}`}
                  onClick={() => setDuelRounds(o.value)}
                >
                  <strong>{o.label}</strong>
                  <small>{o.hint}</small>
                </button>
              ))}
            </div>
            <button className="btn primary" disabled={busy} onClick={() => start("duel")}>Sukurti kambarį</button>
            <div className="row">
              <input className="field" value={joinCode} onChange={(e) => setJoinCode(e.target.value.toUpperCase())} placeholder="Kodas" maxLength={6} />
              <button className="btn ghost" disabled={busy || joinCode.trim().length !== 6} onClick={() => { localStorage.setItem(NAME_KEY, name.trim()); run({ action: "join", name, code: joinCode }); }}>
                Prisijungti
              </button>
            </div>
          </div>
        )}
      </section>
      {error && <p className="error">{error}</p>}
    </main>
  );
}
