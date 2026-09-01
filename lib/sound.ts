/**
 * Web Audio API synthesizer for clean, subtle 3D spatial UI audio feedback.
 * Uses pure Web Audio nodes — zero external sound assets or network load.
 */

let audioCtx: AudioContext | null = null;
let soundEnabled = false;

if (typeof window !== "undefined") {
  const saved = localStorage.getItem("portfolio_sound_enabled");
  soundEnabled = saved !== "false";
}

function initAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const AudioCtxClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioCtxClass) {
      audioCtx = new AudioCtxClass();
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume().catch(() => { });
  }
  return audioCtx;
}

export function isSoundEnabled(): boolean {
  return soundEnabled;
}

export function toggleSound(): boolean {
  soundEnabled = !soundEnabled;
  if (typeof window !== "undefined") {
    localStorage.setItem("portfolio_sound_enabled", String(soundEnabled));
  }
  const ctx = initAudioContext();
  if (soundEnabled && ctx) {
    playToggleChime(true);
  }
  return soundEnabled;
}

function playToggleChime(on: boolean) {
  const ctx = initAudioContext();
  if (!ctx) return;
  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const now = ctx.currentTime;

    osc.type = "sine";
    const startFreq = on ? 520 : 780;
    const endFreq = on ? 1040 : 390;

    osc.frequency.setValueAtTime(startFreq, now);
    osc.frequency.exponentialRampToValueAtTime(endFreq, now + 0.08);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.08);
  } catch (e) {
    // Ignore audio errors
  }
}

/**
 * Play a high-tech subtle UI hover blip.
 */
export function playHoverSound() {
  if (!soundEnabled) return;
  const ctx = initAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(620, now);
    osc.frequency.exponentialRampToValueAtTime(1240, now + 0.04);

    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.04);
  } catch (e) {
    // Ignore audio errors
  }
}

/**
 * Play a low-pitch sci-fi click when pressing buttons/cards.
 */
export function playClickSound() {
  if (!soundEnabled) return;
  const ctx = initAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(160, now + 0.06);

    gain.gain.setValueAtTime(0.09, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.06);
  } catch (e) {
    // Ignore audio errors
  }
}
