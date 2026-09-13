"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowRight, BookOpen, Copy, Globe2, MapPinned, Swords } from "lucide-react";
import { countryShapeUrl } from "@/lib/iso2";
import type { PublicGame, Settings } from "@/lib/game";
import { regions } from "@/lib/game";

const TOKEN_KEY = "atlas-player-token";

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
    headers: {
      "Content-Type": "application/json",
      "X-Player-Token": playerToken(),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = (await res.json()) as PublicGame & { error?: string };
  if (!res.ok) throw new Error(data.error || "Nepavyko susisiekti su kambariu.");
  return data;
}

const modeOptions: { value: Settings["mode"]; label: string }[] = [
  { value: "map", label: "Valstybės žemėlapyje" },
  { value: "capital", label: "Neišbrauktos sostinės" },
  { value: "mixed", label: "Viskas kartu" },
];

export default function Home() {
  const [tab, setTab] = useState<"duel" | "solo">("duel");
  const [name, setName] = useState("");
  const [mode, setMode] = useState<Settings["mode"]>("map");
  const [joinCode, setJoinCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [game, setGame] = useState<PublicGame | null>(null);
  const [answer, setAnswer] = useState("");
  const [copied, setCopied] = useState(false);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = (params.get("code") || "").toUpperCase();
    if (code) setJoinCode(code);
  }, []);

  useEffect(() => {
    if (!game?.code) return;
    const tick = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(tick);
  }, [game?.code, game?.status]);

  useEffect(() => {
    if (!game?.code || game.status === "finished") return;
    const poll = async () => {
      try {
        const next = await requestGame(undefined, game.code);
        setGame(next);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Ryšys nutrūko.");
      }
    };
    const id = setInterval(poll, 1000);
    return () => clearInterval(id);
  }, [game?.code, game?.status]);

  const remaining = useMemo(() => {
    if (!game || game.solo || game.status !== "playing") return 60;
    const offset = now - game.serverNow;
    return Math.max(0, Math.ceil((60000 - (now - offset - game.startedAt)) / 1000));
  }, [game, now]);

  async function run(body: Record<string, unknown>) {
    setBusy(true);
    setError("");
    try {
      const next = await requestGame(body, typeof body.code === "string" ? body.code : game?.code);
      setGame(next);
      setAnswer("");
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
  }

  function startRoom(solo: boolean) {
    return run({
      action: "create",
      name,
      solo,
      settings: { mode, input: "write", region: regions[0], rounds: 20 },
    });
  }

  function shareLink() {
    if (!game) return "";
    const url = new URL(window.location.href);
    url.searchParams.set("code", game.code);
    return url.toString();
  }

  async function copyCode() {
    if (!game) return;
    await navigator.clipboard.writeText(game.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  const header = (
    <header>
      <a className="brand" href="/">
        <Globe2 />
        <span>
          atlas<span className="brand-light"> / dvikova</span>
        </span>
      </a>
      <span className="header-note">{game ? `Kambarys ${game.code}` : "Pasaulis. Po vieną šalį."}</span>
    </header>
  );

  if (game?.status === "lobby") {
    const host = game.me === 0;
    return (
      <main className="shell">
        {header}
        <section className="panel lobby">
          <span className="eyebrow">LAUKIAME ANTRO ŽAIDĖJO</span>
          <h1>Kodas</h1>
          <p className="lobby-code">{game.code}</p>
          <div className="lobby-actions">
            <button className="secondary" onClick={copyCode}>
              <Copy size={18} />
              {copied ? "Nukopijuota" : "Kopijuoti kodą"}
            </button>
            <button className="ghost" onClick={() => navigator.clipboard.writeText(shareLink())}>
              Kopijuoti nuorodą
            </button>
          </div>
          <ul className="players">
            {game.players.map((player) => (
              <li key={player.name}>{player.name}</li>
            ))}
            {game.players.length < 2 && <li className="muted">Laukiama varžovo…</li>}
          </ul>
          {host ? (
            <button className="primary" disabled={busy || game.players.length < 2} onClick={() => run({ action: "start", code: game.code })}>
              Pradėti dvikovą
              <ArrowRight size={19} />
            </button>
          ) : (
            <p className="muted">Kambario kūrėjas paleis žaidimą, kai būsite abu.</p>
          )}
          {error && <p className="error">{error}</p>}
        </section>
      </main>
    );
  }

  if (game?.status === "playing" && game.question) {
    const mine = game.players[game.me];
    const q = game.question;
    const mapUrl = countryShapeUrl(q.isoA3);
    return (
      <main className="shell">
        {header}
        <section className="panel play">
          <div className="play-top">
            <span className="eyebrow">
              {q.kind === "map" ? "KURI TAI VALSTYBĖ?" : "SOSTINĖ"} · {game.index + 1}/{game.total}
            </span>
            {!game.solo && <span className="timer">{remaining}s</span>}
          </div>
          <div className="scores">
            {game.players.map((player) => (
              <div key={player.name}>
                <strong>{player.score}</strong>
                <span>{player.name}{player.answered ? " · atsakė" : ""}</span>
              </div>
            ))}
          </div>
          {q.kind === "map" && mapUrl && (
            <div className="map-shape">
              <img src={mapUrl} alt="Valstybės kontūras" />
            </div>
          )}
          {q.kind === "capital" && <h2>{q.country}</h2>}
          {game.feedback ? (
            <>
              <p className={game.feedback.correct ? "ok" : "bad"}>
                {game.feedback.correct ? "Teisingai." : `Buvo: ${game.feedback.expected}`}
              </p>
              <button
                className="primary"
                disabled={busy || (!game.solo && !game.players.every((player) => player.answered))}
                onClick={() => run({ action: "next", code: game.code, questionId: q.id })}
              >
                {mine.ready ? "Laukiame kito žaidėjo" : "Toliau"}
                <ArrowRight size={19} />
              </button>
            </>
          ) : (
            <form
              onSubmit={(event) => {
                event.preventDefault();
                run({ action: "answer", code: game.code, questionId: q.id, answer });
              }}
            >
              <label>
                Tavo atsakymas
                <input value={answer} onChange={(event) => setAnswer(event.target.value)} autoComplete="off" maxLength={160} />
              </label>
              <button className="primary" disabled={busy || !answer.trim()}>
                Atsakyti
              </button>
            </form>
          )}
          {error && <p className="error">{error}</p>}
        </section>
      </main>
    );
  }

  if (game?.status === "finished") {
    return (
      <main className="shell">
        {header}
        <section className="panel play">
          <span className="eyebrow">REZULTATAI</span>
          <h1>Baigta.</h1>
          <div className="scores">
            {game.players.map((player) => (
              <div key={player.name}>
                <strong>{player.score}</strong>
                <span>{player.name}</span>
              </div>
            ))}
          </div>
          <ul className="review">
            {game.review.map((item) => (
              <li key={item.id} className={item.answer?.correct ? "ok" : "bad"}>
                {item.country}: {item.expected}
                {item.answer?.text ? ` · tu: ${item.answer.text}` : " · praleista"}
              </li>
            ))}
          </ul>
          <button className="primary" onClick={() => { setGame(null); window.history.replaceState(null, "", "/"); }}>
            Naujas kambarys
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="shell">
      {header}
      <section className="intro">
        <span className="eyebrow">JŪSŲ GEOGRAFIJOS TRENIRUOTĖ</span>
        <h1>
          Susitinkam
          <br />
          <em>žemėlapyje.</em>
        </h1>
        <p>86 valstybės. 68 sostinės. Ir vienas vertas dėmesio varžovas.</p>
      </section>
      <div className="home-grid">
        <section className="panel setup">
          <div className="tabs">
            <button className={tab === "duel" ? "active" : ""} onClick={() => setTab("duel")}>
              <Swords size={18} />
              Dvikova
            </button>
            <button className={tab === "solo" ? "active" : ""} onClick={() => setTab("solo")}>
              <BookOpen size={18} />
              Treniruotė
            </button>
          </div>
          <h2>{tab === "duel" ? "Dviese iš skirtingų telefonų" : "Pirmiausia apšilk"}</h2>
          <label>
            Tavo vardas
            <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Kaip tave vadinti?" maxLength={20} />
          </label>
          <label>
            Ką mokomės?
            <select value={mode} onChange={(event) => setMode(event.target.value as Settings["mode"])}>
              {modeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          {tab === "duel" && (
            <label>
              Arba įvesk kambario kodą
              <input value={joinCode} onChange={(event) => setJoinCode(event.target.value.toUpperCase())} placeholder="PVZ. 7K2M9P" maxLength={6} />
            </label>
          )}
          {tab === "duel" && joinCode.trim() ? (
            <button className="primary" disabled={busy} onClick={() => run({ action: "join", name, code: joinCode })}>
              Prisijungti
              <ArrowRight size={19} />
            </button>
          ) : (
            <button className="primary" disabled={busy} onClick={() => startRoom(tab === "solo")}>
              {tab === "duel" ? "Sukurti kambarį" : "Pradėti treniruotę"}
              <ArrowRight size={19} />
            </button>
          )}
          {error && <p className="error">{error}</p>}
          <p className="muted">
            {tab === "duel" ? "Sukurk kambarį ir pasidalyk kodu." : "Rašyk atsakymus ir kartok savo klaidas."}
          </p>
        </section>
        <section className="map-teaser">
          <MapPinned size={58} />
          <span className="eyebrow">PASIRUOŠĘ KELIAUTI?</span>
          <h2>
            Nuo Kanados
            <br />
            iki Albanijos.
          </h2>
          <p>
            Mokomės tik tai, kas tavo lape.
            <br />
            Išbrauktų sostinių neklausime.
          </p>
          <div className="stats">
            <div>
              <strong>86</strong>
              <span>valstybės</span>
            </div>
            <div>
              <strong>68</strong>
              <span>sostinės</span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
