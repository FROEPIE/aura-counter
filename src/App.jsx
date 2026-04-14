import { useEffect, useMemo, useRef, useState } from "react";

const BUTTON_VALUES = [1, 10, 100, 1000];

export function getAuraLevel(count) {
  const abs = Math.abs(count);
  if (count <= -100000) return "Void Goblin Aura";
  if (count <= -10000) return "Negative Rizz Aura";
  if (count <= -1000) return "Suspicious NPC Aura";
  if (count <= -100) return "Lagging Villain Aura";
  if (count < 0) return "Cringe Aura";
  if (abs >= 100000) return "Galaxy Brain Aura";
  if (abs >= 10000) return "Sigma Overdrive Aura";
  if (abs >= 1000) return "Main Character Aura";
  if (abs >= 100) return "Rizzler Aura";
  if (abs >= 10) return "Unfolding Meme Aura";
  return "NPC Calm Aura";
}

export function getGlowClass(count) {
  if (count <= -100000) return "shadow-[0_0_42px_rgba(239,68,68,0.95)]";
  if (count <= -10000) return "shadow-[0_0_36px_rgba(244,63,94,0.9)]";
  if (count <= -1000) return "shadow-[0_0_30px_rgba(249,115,22,0.85)]";
  if (count < 0) return "shadow-[0_0_20px_rgba(251,146,60,0.8)]";

  const abs = Math.abs(count);
  if (abs >= 100000) return "shadow-[0_0_40px_rgba(236,72,153,0.95)]";
  if (abs >= 10000) return "shadow-[0_0_35px_rgba(168,85,247,0.9)]";
  if (abs >= 1000) return "shadow-[0_0_30px_rgba(59,130,246,0.9)]";
  if (abs >= 100) return "shadow-[0_0_24px_rgba(34,197,94,0.85)]";
  if (abs >= 10) return "shadow-[0_0_18px_rgba(250,204,21,0.85)]";
  return "shadow-[0_0_12px_rgba(255,255,255,0.35)]";
}

export function getStatusText(count) {
  if (count <= -100000) return "bro deleted the timeline";
  if (count <= -10000) return "aura debt is getting serious";
  if (count <= -1000) return "certified side quest behavior";
  if (count < 0) return "that was not very sigma";
  if (count >= 100000) return "chat is moving DIFFERENT";
  if (count >= 10000) return "the aura farm is unreal";
  if (count >= 1000) return "main character energy detected";
  if (count >= 100) return "lowkey cooking";
  if (count >= 10) return "meme potential rising";
  return "neutral spawn point vibes";
}

const TEST_CASES = [
  { input: 0, expected: "NPC Calm Aura" },
  { input: 10, expected: "Unfolding Meme Aura" },
  { input: 100, expected: "Rizzler Aura" },
  { input: 1000, expected: "Main Character Aura" },
  { input: 10000, expected: "Sigma Overdrive Aura" },
  { input: 100000, expected: "Galaxy Brain Aura" },
  { input: -1, expected: "Cringe Aura" },
  { input: -100, expected: "Lagging Villain Aura" },
  { input: -1000, expected: "Suspicious NPC Aura" },
  { input: -10000, expected: "Negative Rizz Aura" },
  { input: -100000, expected: "Void Goblin Aura" },
];

function MemeBadge({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-white/80">
      {children}
    </span>
  );
}

export default function AuraCounterApp() {
  const [count, setCount] = useState(0);
  const [soundOn, setSoundOn] = useState(true);
  const [lastChange, setLastChange] = useState(0);
  const audioContextRef = useRef(null);

  const auraLevel = useMemo(() => getAuraLevel(count), [count]);
  const glowClass = useMemo(() => getGlowClass(count), [count]);
  const statusText = useMemo(() => getStatusText(count), [count]);

  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, []);

  function playClickSound(type) {
    if (!soundOn || typeof window === "undefined") return;

    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;

    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContextClass();
    }

    const context = audioContextRef.current;
    if (context.state === "suspended") {
      context.resume().catch(() => {});
    }

    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    oscillator.type = type === "plus" ? "triangle" : "sawtooth";
    oscillator.frequency.value = type === "plus" ? 620 : 180;
    gainNode.gain.setValueAtTime(0.001, context.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.06, context.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.12);

    oscillator.connect(gainNode);
    gainNode.connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.12);
  }

  function updateCount(delta) {
    setCount((current) => current + delta);
    setLastChange(delta);
    playClickSound(delta >= 0 ? "plus" : "minus");
  }

  return (
    <div className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_#4c1d95_0%,_#111827_38%,_#020617_100%)] text-white flex items-center justify-center p-4 md:p-6">
      <div className="pointer-events-none absolute inset-0 opacity-50">
        <div className="absolute left-[8%] top-[10%] h-28 w-28 rounded-full bg-fuchsia-500/20 blur-3xl" />
        <div className="absolute right-[10%] top-[18%] h-36 w-36 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="absolute bottom-[12%] left-[20%] h-40 w-40 rounded-full bg-yellow-300/10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-4xl rounded-[32px] border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl md:p-10">
        <div className="text-center mb-8">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <MemeBadge>Aura Counter</MemeBadge>
            <MemeBadge>Meme Engine</MemeBadge>
            <MemeBadge>{soundOn ? "Sound On" : "Sound Off"}</MemeBadge>
          </div>

          <h1 className="mt-4 text-4xl font-black tracking-tight md:text-7xl">
            Unlimited Aura Farming
          </h1>
          <p className="mt-3 text-base text-white/70 md:text-lg">
            Klik harder, stijg sneller, verlies alles, herstel weer. Pure chaos.
          </p>
        </div>

        <div className={`mx-auto mb-8 flex w-full max-w-2xl flex-col items-center justify-center rounded-[28px] border border-white/15 bg-black/20 px-6 py-8 text-center transition-all duration-300 ${glowClass}`}>
          <div className="text-xs uppercase tracking-[0.35em] text-white/50 md:text-sm">
            {auraLevel}
          </div>
          <div className="mt-4 text-6xl font-black tracking-tight md:text-8xl">
            {count.toLocaleString("nl-NL")}
          </div>
          <div className="mt-3 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-white/80 md:text-base">
            {statusText}
          </div>
          <div className={`mt-4 text-sm font-bold ${lastChange > 0 ? "text-emerald-300" : lastChange < 0 ? "text-rose-300" : "text-white/40"}`}>
            {lastChange > 0 ? `+${lastChange.toLocaleString("nl-NL")} aura gained` : lastChange < 0 ? `${lastChange.toLocaleString("nl-NL")} aura lost` : "waiting for the first move"}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-[24px] border border-emerald-400/20 bg-emerald-400/10 p-4 md:p-5">
            <div className="mb-3 text-lg font-bold">Plus aura</div>
            <div className="grid grid-cols-2 gap-3">
              {BUTTON_VALUES.map((value) => (
                <button
                  key={`plus-${value}`}
                  onClick={() => updateCount(value)}
                  className="rounded-2xl border border-emerald-300/20 bg-emerald-300/15 px-4 py-4 text-lg font-black transition hover:scale-[1.03] hover:bg-emerald-300/25 active:scale-[0.98]"
                >
                  +{value}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-[24px] border border-rose-400/20 bg-rose-400/10 p-4 md:p-5">
            <div className="mb-3 text-lg font-bold">Min aura</div>
            <div className="grid grid-cols-2 gap-3">
              {BUTTON_VALUES.map((value) => (
                <button
                  key={`minus-${value}`}
                  onClick={() => updateCount(-value)}
                  className="rounded-2xl border border-rose-300/20 bg-rose-300/15 px-4 py-4 text-lg font-black transition hover:scale-[1.03] hover:bg-rose-300/25 active:scale-[0.98]"
                >
                  -{value}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-4">
          <button
            onClick={() => {
              setCount(0);
              setLastChange(0);
              playClickSound("minus");
            }}
            className="rounded-2xl border border-white/15 bg-white/10 px-6 py-4 text-base font-semibold transition hover:bg-white/15"
          >
            Reset aura
          </button>
          <button
            onClick={() => updateCount(10000)}
            className="rounded-2xl border border-fuchsia-300/20 bg-fuchsia-300/15 px-6 py-4 text-base font-semibold transition hover:bg-fuchsia-300/25"
          >
            Ultra boost +10.000
          </button>
          <button
            onClick={() => updateCount(-10000)}
            className="rounded-2xl border border-orange-300/20 bg-orange-300/15 px-6 py-4 text-base font-semibold transition hover:bg-orange-300/25"
          >
            Void hit -10.000
          </button>
          <button
            onClick={() => setSoundOn((current) => !current)}
            className="rounded-2xl border border-cyan-300/20 bg-cyan-300/15 px-6 py-4 text-base font-semibold transition hover:bg-cyan-300/25"
          >
            {soundOn ? "Geluid uit" : "Geluid aan"}
          </button>
        </div>

        <div className="mt-8 rounded-[24px] border border-white/10 bg-white/5 p-4 md:p-5">
          <div className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-white/60">
            Aura checks
          </div>
          <div className="grid gap-2 md:grid-cols-2">
            {TEST_CASES.map((test) => {
              const actual = getAuraLevel(test.input);
              const passed = actual === test.expected;

              return (
                <div
                  key={`${test.input}-${test.expected}`}
                  className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm"
                >
                  <div className="font-semibold">{test.input.toLocaleString("nl-NL")}</div>
                  <div className="text-white/70">verwacht: {test.expected}</div>
                  <div className={passed ? "text-emerald-300" : "text-rose-300"}>
                    {passed ? "ok" : `fout: ${actual}`}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
