const fs = require('fs');
const path = require('path');

const soundPath = path.resolve('src/lib/sound.ts');
let content = fs.readFileSync(soundPath, 'utf8');

const newMethods = `  playLevelUp: () => {
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
  }`;

const oldLevelUp = `  playLevelUp: () => {
    const ctx = getContext();
    // Victory Fanfare
    [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
      playTone(freq, 'square', 0.1, i * 0.08);
    });
    playTone(1046.50, 'square', 0.4, 0.32);
  }`;

content = content.replace(oldLevelUp, newMethods);
content = content.replace(oldLevelUp.replace(/\n/g, '\r\n'), newMethods.replace(/\n/g, '\r\n'));

fs.writeFileSync(soundPath, content, 'utf8');
console.log('sound.ts updated with synthesized character earcons and celebration sounds');
