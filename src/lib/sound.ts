
// Web Audio API Context
const AudioContext = (window.AudioContext || (window as any).webkitAudioContext);
let audioCtx: AudioContext | null = null;

const getContext = () => {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  return audioCtx;
};

// Helper: Play a tone
const playTone = (freq: number, type: OscillatorType, duration: number, startTime: number = 0) => {
  const ctx = getContext();
  if (ctx.state === 'suspended') ctx.resume();

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime + startTime);

  gain.gain.setValueAtTime(0.1, ctx.currentTime + startTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startTime + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(ctx.currentTime + startTime);
  osc.stop(ctx.currentTime + startTime + duration);
};

export const SoundService = {
  playClick: () => {
    playTone(800, 'sine', 0.05);
  },

  playHover: () => {
    playTone(400, 'triangle', 0.02);
  },

  playSuccess: () => {
    const ctx = getContext();
    const now = ctx.currentTime;
    playTone(523.25, 'sine', 0.1, 0); // C5
    playTone(659.25, 'sine', 0.1, 0.1); // E5
    playTone(783.99, 'sine', 0.2, 0.2); // G5
  },

  playError: () => {
    const ctx = getContext();
    playTone(150, 'sawtooth', 0.2);
    playTone(100, 'sawtooth', 0.2, 0.1);
  },

  playReward: () => {
    SoundService.playCoin();
  },

  playCoin: () => {
    const ctx = getContext();
    playTone(1200, 'sine', 0.1);
    playTone(1600, 'sine', 0.3, 0.05);
  },

  playLevelUp: () => {
    const ctx = getContext();
    // Victory Fanfare
    [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
      playTone(freq, 'square', 0.1, i * 0.08);
    });
    playTone(1046.50, 'square', 0.4, 0.32);
  },

  playCharacterEarcon: (characterId: string) => {
    if (characterId === 'ollie') {
      playTone(440, 'sine', 0.12, 0);
      playTone(554.37, 'sine', 0.18, 0.10);
    } else if (characterId === 'reema') {
      playTone(659.25, 'triangle', 0.08, 0);
      playTone(880.00, 'sine', 0.12, 0.06);
      playTone(1174.66, 'sine', 0.15, 0.12);
    } else if (characterId === 'filo') {
      playTone(220, 'triangle', 0.15, 0);
      playTone(277.18, 'sine', 0.22, 0.10);
    } else if (characterId === 'kami') {
      playTone(880, 'sine', 0.06, 0);
      playTone(1320, 'sine', 0.10, 0.06);
    } else if (characterId === 'rex') {
      playTone(370, 'sawtooth', 0.10, 0);
      playTone(415.30, 'sawtooth', 0.10, 0.08);
      playTone(466.16, 'sawtooth', 0.15, 0.16);
    } else {
      playTone(523.25, 'sine', 0.1, 0);
    }
  },

  playCashRegister: () => {
    playTone(987.77, 'sine', 0.15, 0);
    playTone(1318.51, 'sine', 0.35, 0.08);
  },

  playBadgeUnlock: () => {
    playTone(523.25, 'triangle', 0.12, 0);
    playTone(659.25, 'triangle', 0.12, 0.08);
    playTone(783.99, 'sine', 0.15, 0.16);
    playTone(1046.50, 'sine', 0.35, 0.24);
  },

  playWhoosh: () => {
    const ctx = getContext();
    if (ctx.state === 'suspended') ctx.resume();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.15);
  },

  playStreakFlame: () => {
    playTone(330, 'triangle', 0.08, 0);
    playTone(440, 'sine', 0.12, 0.06);
    playTone(554.37, 'sine', 0.20, 0.12);
  }
};
