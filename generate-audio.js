/**
 * Generate placeholder audio files for Kavach safety features.
 * Creates simple WAV files with synthesized tones.
 * 
 * Usage: node generate-audio.js
 */

const fs = require('fs');
const path = require('path');

const SAMPLE_RATE = 44100;
const CHANNELS = 1;
const BITS_PER_SAMPLE = 16;

/**
 * Generate a WAV file buffer from raw PCM samples
 */
function createWAV(samples) {
  const dataLength = samples.length * 2; // 16-bit = 2 bytes per sample
  const buffer = Buffer.alloc(44 + dataLength);

  // RIFF header
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataLength, 4);
  buffer.write('WAVE', 8);

  // fmt chunk
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);           // chunk size
  buffer.writeUInt16LE(1, 20);            // PCM format
  buffer.writeUInt16LE(CHANNELS, 22);
  buffer.writeUInt32LE(SAMPLE_RATE, 24);
  buffer.writeUInt32LE(SAMPLE_RATE * CHANNELS * BITS_PER_SAMPLE / 8, 28);
  buffer.writeUInt16LE(CHANNELS * BITS_PER_SAMPLE / 8, 32);
  buffer.writeUInt16LE(BITS_PER_SAMPLE, 34);

  // data chunk
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataLength, 40);

  for (let i = 0; i < samples.length; i++) {
    const val = Math.max(-1, Math.min(1, samples[i]));
    buffer.writeInt16LE(Math.round(val * 32767), 44 + i * 2);
  }

  return buffer;
}

/**
 * Generate a ringtone: alternating two tones (classic phone ring)
 */
function generateRingtone(durationSec) {
  const totalSamples = SAMPLE_RATE * durationSec;
  const samples = new Float64Array(totalSamples);

  for (let i = 0; i < totalSamples; i++) {
    const t = i / SAMPLE_RATE;
    const cyclePos = t % 4; // 4-second cycle

    if (cyclePos < 1) {
      // Ring: two-tone (440Hz + 480Hz)
      const tone = Math.sin(2 * Math.PI * 440 * t) + Math.sin(2 * Math.PI * 480 * t);
      // Apply envelope
      const env = Math.min(cyclePos * 10, 1) * Math.min((1 - cyclePos) * 10, 1);
      samples[i] = tone * 0.3 * env;
    } else if (cyclePos < 2) {
      samples[i] = 0; // Silence
    } else if (cyclePos < 3) {
      // Ring again
      const tone = Math.sin(2 * Math.PI * 440 * t) + Math.sin(2 * Math.PI * 480 * t);
      const localT = cyclePos - 2;
      const env = Math.min(localT * 10, 1) * Math.min((1 - localT) * 10, 1);
      samples[i] = tone * 0.3 * env;
    } else {
      samples[i] = 0; // Silence
    }
  }

  return samples;
}

/**
 * Generate a siren: sweeping frequency up and down
 */
function generateSiren(durationSec) {
  const totalSamples = SAMPLE_RATE * durationSec;
  const samples = new Float64Array(totalSamples);

  const freqLow = 600;
  const freqHigh = 1400;
  const sweepPeriod = 1.5; // seconds per sweep cycle

  let phase = 0;

  for (let i = 0; i < totalSamples; i++) {
    const t = i / SAMPLE_RATE;
    
    // Sweep frequency sinusoidally between low and high
    const sweepPos = (Math.sin(2 * Math.PI * t / sweepPeriod) + 1) / 2;
    const freq = freqLow + (freqHigh - freqLow) * sweepPos;
    
    phase += (2 * Math.PI * freq) / SAMPLE_RATE;
    
    samples[i] = Math.sin(phase) * 0.5;
  }

  return samples;
}

/**
 * Generate fake voice: muffled speech-like sound using filtered noise + formants
 */
function generateFakeVoice(durationSec) {
  const totalSamples = SAMPLE_RATE * durationSec;
  const samples = new Float64Array(totalSamples);

  for (let i = 0; i < totalSamples; i++) {
    const t = i / SAMPLE_RATE;

    // Simulate speech rhythm (syllables)
    const syllableRate = 4; // syllables per second
    const syllableEnv = Math.pow(Math.abs(Math.sin(Math.PI * syllableRate * t)), 0.5);

    // Mix of formant-like frequencies
    const f1 = Math.sin(2 * Math.PI * 250 * t) * 0.3;
    const f2 = Math.sin(2 * Math.PI * 580 * t) * 0.2;
    const f3 = Math.sin(2 * Math.PI * 1200 * t) * 0.1;

    // Add some "noise" for consonant-like sounds
    const noise = (Math.random() * 2 - 1) * 0.05;

    // Periodic pauses (simulate conversation gaps)
    const pauseCycle = t % 6;
    const speaking = pauseCycle < 3 ? 1 : (pauseCycle < 4 ? 0 : (pauseCycle < 5.5 ? 0.8 : 0));

    samples[i] = (f1 + f2 + f3 + noise) * syllableEnv * speaking * 0.7;
  }

  return samples;
}

// ========== Main ==========

const soundsDir = path.join(__dirname, 'public', 'sounds');

// Ensure directory exists
if (!fs.existsSync(soundsDir)) {
  fs.mkdirSync(soundsDir, { recursive: true });
}

console.log('Generating audio files...\n');

// 1. Ringtone (8 seconds, will loop)
const ringtoneSamples = generateRingtone(8);
const ringtoneWAV = createWAV(ringtoneSamples);
fs.writeFileSync(path.join(soundsDir, 'ringtone.wav'), ringtoneWAV);
console.log('✅ ringtone.wav (8s, phone ring pattern)');

// 2. Siren (6 seconds, will loop)
const sirenSamples = generateSiren(6);
const sirenWAV = createWAV(sirenSamples);
fs.writeFileSync(path.join(soundsDir, 'siren.wav'), sirenWAV);
console.log('✅ siren.wav (6s, sweeping siren)');

// 3. Fake voice (12 seconds)
const voiceSamples = generateFakeVoice(12);
const voiceWAV = createWAV(voiceSamples);
fs.writeFileSync(path.join(soundsDir, 'fake-voice.wav'), voiceWAV);
console.log('✅ fake-voice.wav (12s, speech-like audio)');

console.log('\nAll audio files generated in public/sounds/');
console.log('Note: These are WAV files. The components reference .mp3 — updating references...');
