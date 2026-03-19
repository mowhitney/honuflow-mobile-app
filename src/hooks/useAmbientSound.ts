import { useState, useEffect, useCallback, useRef } from "react";

// Bilateral Stimulation sounds (left-right panning)
export type BilateralSound = "bilateral-ocean" | "bilateral-rain" | "bilateral-forest";

// Ocean & Water sounds
export type OceanSound = "ocean-swell" | "distant-waves" | "underwater";

// Rain & Storm sounds
export type RainSound = "rain-water" | "rainforest-rain" | "thunderstorm";

// Forest & Night sounds
export type ForestSound = "wind-trees" | "evening-crickets" | "stream-river";

// Fire & Evening sounds
export type FireSound = "campfire";

// Air & Breath sounds
export type AirSound = "breath-pacing" | "white-air";

// Grounding Ambience sounds
export type GroundingSound = "low-hum" | "brown-noise";

// Frequency (Hz) sounds
export type FrequencySound = "hz-432" | "hz-528" | "hz-174" | "hz-10-alpha" | "hz-6-theta";

// Silent Regulation (visual only)
export type SilentOption = "visual-only";

export type SoundType = 
  | BilateralSound 
  | OceanSound 
  | RainSound 
  | ForestSound 
  | FireSound 
  | AirSound 
  | GroundingSound 
  | FrequencySound
  | SilentOption;

export type SoundCategory = 
  | "bilateral" 
  | "ocean" 
  | "rain" 
  | "forest" 
  | "fire" 
  | "air" 
  | "grounding" 
  | "frequency"
  | "silent";

interface AmbientSoundOptions {
  volume?: number;
  fadeInDuration?: number;
  fadeOutDuration?: number;
}

interface UseAmbientSoundReturn {
  isPlaying: boolean;
  currentSound: SoundType | null;
  volume: number;
  play: (sound: SoundType) => void;
  stop: () => void;
  setVolume: (volume: number) => void;
  toggle: (sound: SoundType) => void;
}

// Create noise buffers with improved quality
function createNoiseBuffer(
  audioContext: AudioContext,
  type: "white" | "pink" | "brown"
): AudioBuffer {
  const bufferSize = audioContext.sampleRate * 4; // Longer buffer for smoother loops
  const buffer = audioContext.createBuffer(2, bufferSize, audioContext.sampleRate);

  for (let channel = 0; channel < 2; channel++) {
    const data = buffer.getChannelData(channel);
    
    if (type === "white") {
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
    } else if (type === "pink") {
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
        b6 = white * 0.115926;
      }
    } else if (type === "brown") {
      let lastOut = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = data[i];
        data[i] *= 3.5;
      }
    }
  }

  return buffer;
}

// ============================================
// BILATERAL STIMULATION SOUNDS (Left-Right Panning)
// ============================================

// Bilateral ocean - gentle waves with left-right panning
function createBilateralOcean(audioContext: AudioContext, gainNode: GainNode) {
  const merger = audioContext.createChannelMerger(2);
  const leftGain = audioContext.createGain();
  const rightGain = audioContext.createGain();
  
  const bufferSource = audioContext.createBufferSource();
  const filter = audioContext.createBiquadFilter();
  const filter2 = audioContext.createBiquadFilter();
  
  bufferSource.buffer = createNoiseBuffer(audioContext, "brown");
  bufferSource.loop = true;
  
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(350, audioContext.currentTime);
  filter.Q.setValueAtTime(0.6, audioContext.currentTime);
  
  filter2.type = "highpass";
  filter2.frequency.setValueAtTime(35, audioContext.currentTime);
  
  // Bilateral panning LFO (slow, calming rhythm ~0.5Hz = 2 second cycle)
  const panLfo = audioContext.createOscillator();
  const panLfoGain = audioContext.createGain();
  panLfo.type = "sine";
  panLfo.frequency.setValueAtTime(0.5, audioContext.currentTime);
  panLfoGain.gain.setValueAtTime(0.8, audioContext.currentTime);
  panLfo.connect(panLfoGain);
  
  // Create left/right crossfade
  const leftGainLfo = audioContext.createGain();
  const rightGainLfo = audioContext.createGain();
  leftGainLfo.gain.setValueAtTime(0.5, audioContext.currentTime);
  rightGainLfo.gain.setValueAtTime(0.5, audioContext.currentTime);
  
  panLfoGain.connect(leftGainLfo.gain);
  
  // Invert for right channel
  const inverter = audioContext.createGain();
  inverter.gain.setValueAtTime(-1, audioContext.currentTime);
  panLfoGain.connect(inverter);
  inverter.connect(rightGainLfo.gain);
  
  bufferSource.connect(filter);
  filter.connect(filter2);
  filter2.connect(leftGain);
  filter2.connect(rightGain);
  
  leftGain.connect(leftGainLfo);
  rightGain.connect(rightGainLfo);
  
  leftGainLfo.connect(merger, 0, 0);
  rightGainLfo.connect(merger, 0, 1);
  merger.connect(gainNode);
  
  panLfo.start();
  
  return { source: bufferSource, extras: [panLfo] };
}

// Bilateral rain - rainfall with gentle left-right alternation
function createBilateralRain(audioContext: AudioContext, gainNode: GainNode) {
  const merger = audioContext.createChannelMerger(2);
  
  // Create two separate rain sources for left and right
  const leftSource = audioContext.createBufferSource();
  const rightSource = audioContext.createBufferSource();
  const leftFilter = audioContext.createBiquadFilter();
  const rightFilter = audioContext.createBiquadFilter();
  const leftGain = audioContext.createGain();
  const rightGain = audioContext.createGain();
  
  leftSource.buffer = createNoiseBuffer(audioContext, "pink");
  rightSource.buffer = createNoiseBuffer(audioContext, "pink");
  leftSource.loop = true;
  rightSource.loop = true;
  
  leftFilter.type = "bandpass";
  leftFilter.frequency.setValueAtTime(2500, audioContext.currentTime);
  leftFilter.Q.setValueAtTime(0.4, audioContext.currentTime);
  
  rightFilter.type = "bandpass";
  rightFilter.frequency.setValueAtTime(2500, audioContext.currentTime);
  rightFilter.Q.setValueAtTime(0.4, audioContext.currentTime);
  
  // Bilateral panning - alternating emphasis
  const panLfo = audioContext.createOscillator();
  const panLfoGainLeft = audioContext.createGain();
  const panLfoGainRight = audioContext.createGain();
  
  panLfo.type = "sine";
  panLfo.frequency.setValueAtTime(0.4, audioContext.currentTime); // Gentle 2.5s cycle
  
  panLfoGainLeft.gain.setValueAtTime(0.4, audioContext.currentTime);
  panLfoGainRight.gain.setValueAtTime(-0.4, audioContext.currentTime);
  
  panLfo.connect(panLfoGainLeft);
  panLfo.connect(panLfoGainRight);
  
  leftGain.gain.setValueAtTime(0.5, audioContext.currentTime);
  rightGain.gain.setValueAtTime(0.5, audioContext.currentTime);
  
  panLfoGainLeft.connect(leftGain.gain);
  panLfoGainRight.connect(rightGain.gain);
  
  leftSource.connect(leftFilter);
  rightSource.connect(rightFilter);
  leftFilter.connect(leftGain);
  rightFilter.connect(rightGain);
  
  leftGain.connect(merger, 0, 0);
  rightGain.connect(merger, 0, 1);
  merger.connect(gainNode);
  
  panLfo.start();
  leftSource.start();
  rightSource.start();
  
  return { sources: [leftSource, rightSource], extras: [panLfo] };
}

// Bilateral forest - nature sounds with left-right movement
function createBilateralForest(audioContext: AudioContext, gainNode: GainNode) {
  const merger = audioContext.createChannelMerger(2);
  
  // Layered forest ambience
  const windSource = audioContext.createBufferSource();
  const rustleSource = audioContext.createBufferSource();
  
  windSource.buffer = createNoiseBuffer(audioContext, "pink");
  rustleSource.buffer = createNoiseBuffer(audioContext, "white");
  windSource.loop = true;
  rustleSource.loop = true;
  
  // Filters for natural forest sound
  const windFilter = audioContext.createBiquadFilter();
  windFilter.type = "lowpass";
  windFilter.frequency.setValueAtTime(800, audioContext.currentTime);
  windFilter.Q.setValueAtTime(0.5, audioContext.currentTime);
  
  const rustleFilter = audioContext.createBiquadFilter();
  rustleFilter.type = "bandpass";
  rustleFilter.frequency.setValueAtTime(3000, audioContext.currentTime);
  rustleFilter.Q.setValueAtTime(1.5, audioContext.currentTime);
  
  const rustleGain = audioContext.createGain();
  rustleGain.gain.setValueAtTime(0.15, audioContext.currentTime);
  
  // Bilateral panning
  const panner = audioContext.createStereoPanner();
  const panLfo = audioContext.createOscillator();
  const panLfoGain = audioContext.createGain();
  
  panLfo.type = "sine";
  panLfo.frequency.setValueAtTime(0.35, audioContext.currentTime); // ~3s cycle
  panLfoGain.gain.setValueAtTime(0.85, audioContext.currentTime);
  
  panLfo.connect(panLfoGain);
  panLfoGain.connect(panner.pan);
  
  windSource.connect(windFilter);
  rustleSource.connect(rustleFilter);
  rustleFilter.connect(rustleGain);
  
  windFilter.connect(panner);
  rustleGain.connect(panner);
  panner.connect(gainNode);
  
  panLfo.start();
  windSource.start();
  rustleSource.start();
  
  return { sources: [windSource, rustleSource], extras: [panLfo] };
}

// ============================================
// OCEAN & WATER SOUNDS
// ============================================

// Maui ocean morning - high-fidelity recorded audio from Kamaole Beach
import mauiOceanAudio from "@/assets/audio/maui-ocean-morning.mp3";
// Distant waves - high-fidelity recorded audio
import distantWavesAudio from "@/assets/audio/distant-waves.mp3";
// Underwater ambience - high-fidelity recorded audio
import underwaterAudio from "@/assets/audio/underwater-ambience.mp3";
// Rainforest rain - high-fidelity recorded audio
import rainforestRainAudio from "@/assets/audio/rainforest-rain.mp3";
// Thunderstorm - high-fidelity recorded audio
import thunderstormAudio from "@/assets/audio/thunderstorm.mp3";
// Stream/river - high-fidelity recorded audio
import streamRiverAudio from "@/assets/audio/stream-river.mp3";
// Iao Valley River - high-fidelity recorded audio
import iaoValleyRiverAudio from "@/assets/audio/iao-valley-river.mp3";
// Forest love - high-fidelity recorded audio
import forestLoveAudio from "@/assets/audio/forest-love.mp3";
// Evening crickets - high-fidelity recorded audio
import eveningCricketsAudio from "@/assets/audio/evening-crickets.mp3";
// Campfire crackle - high-fidelity recorded audio
import campfireAudio from "@/assets/audio/campfire.mp3";
// Brown noise - high-fidelity recorded audio
import brownNoiseAudio from "@/assets/audio/brown-noise.mp3";
// Low-frequency hum - high-fidelity recorded audio
import lowHumAudio from "@/assets/audio/low-hum.mp3";
// 432 Hz - high-fidelity recorded audio
import hz432Audio from "@/assets/audio/hz-432.mp3";
// 528 Hz - high-fidelity recorded audio
import hz528Audio from "@/assets/audio/hz-528.mp3";
// 174 Hz - high-fidelity recorded audio
import hz174Audio from "@/assets/audio/hz-174.mp3";
// 10 Hz Alpha - high-fidelity recorded audio
import hz10AlphaAudio from "@/assets/audio/hz-10-alpha.mp3";
// 6 Hz Theta - high-fidelity recorded audio
import hz6ThetaAudio from "@/assets/audio/hz-6-theta.mp3";

let mauiOceanBuffer: AudioBuffer | null = null;
let distantWavesBuffer: AudioBuffer | null = null;
let underwaterBuffer: AudioBuffer | null = null;
let rainforestRainBuffer: AudioBuffer | null = null;
let thunderstormBuffer: AudioBuffer | null = null;
let streamRiverBuffer: AudioBuffer | null = null;
let iaoValleyRiverBuffer: AudioBuffer | null = null;
let forestLoveBuffer: AudioBuffer | null = null;
let eveningCricketsBuffer: AudioBuffer | null = null;
let campfireBuffer: AudioBuffer | null = null;
let brownNoiseBuffer: AudioBuffer | null = null;
let lowHumBuffer: AudioBuffer | null = null;
let hz432Buffer: AudioBuffer | null = null;
let hz528Buffer: AudioBuffer | null = null;
let hz174Buffer: AudioBuffer | null = null;
let hz10AlphaBuffer: AudioBuffer | null = null;
let hz6ThetaBuffer: AudioBuffer | null = null;

async function loadMauiOceanBuffer(audioContext: AudioContext): Promise<AudioBuffer> {
  if (mauiOceanBuffer) return mauiOceanBuffer;
  
  const response = await fetch(mauiOceanAudio);
  const arrayBuffer = await response.arrayBuffer();
  mauiOceanBuffer = await audioContext.decodeAudioData(arrayBuffer);
  return mauiOceanBuffer;
}

async function loadDistantWavesBuffer(audioContext: AudioContext): Promise<AudioBuffer> {
  if (distantWavesBuffer) return distantWavesBuffer;
  
  const response = await fetch(distantWavesAudio);
  const arrayBuffer = await response.arrayBuffer();
  distantWavesBuffer = await audioContext.decodeAudioData(arrayBuffer);
  return distantWavesBuffer;
}

async function loadUnderwaterBuffer(audioContext: AudioContext): Promise<AudioBuffer> {
  if (underwaterBuffer) return underwaterBuffer;
  
  const response = await fetch(underwaterAudio);
  const arrayBuffer = await response.arrayBuffer();
  underwaterBuffer = await audioContext.decodeAudioData(arrayBuffer);
  return underwaterBuffer;
}

function createOceanSwell(audioContext: AudioContext, gainNode: GainNode): { source: AudioBufferSourceNode; extras: OscillatorNode[]; isAsync: true; loadPromise: Promise<void> } {
  const bufferSource = audioContext.createBufferSource();
  bufferSource.loop = true;
  
  const loadPromise = loadMauiOceanBuffer(audioContext).then((buffer) => {
    bufferSource.buffer = buffer;
    bufferSource.connect(gainNode);
  });
  
  return { source: bufferSource, extras: [], isAsync: true, loadPromise };
}

// Distant waves - high-fidelity recorded audio
function createDistantWaves(audioContext: AudioContext, gainNode: GainNode): { source: AudioBufferSourceNode; extras: OscillatorNode[]; isAsync: true; loadPromise: Promise<void> } {
  const bufferSource = audioContext.createBufferSource();
  bufferSource.loop = true;
  
  const loadPromise = loadDistantWavesBuffer(audioContext).then((buffer) => {
    bufferSource.buffer = buffer;
    bufferSource.connect(gainNode);
  });
  
  return { source: bufferSource, extras: [], isAsync: true, loadPromise };
}


// Underwater ambience - high-fidelity recorded audio
function createUnderwater(audioContext: AudioContext, gainNode: GainNode): { source: AudioBufferSourceNode; extras: OscillatorNode[]; isAsync: true; loadPromise: Promise<void> } {
  const bufferSource = audioContext.createBufferSource();
  bufferSource.loop = true;
  
  const loadPromise = loadUnderwaterBuffer(audioContext).then((buffer) => {
    bufferSource.buffer = buffer;
    bufferSource.connect(gainNode);
  });
  
  return { source: bufferSource, extras: [], isAsync: true, loadPromise };
}

// ============================================
// RAIN & STORM SOUNDS
// ============================================

// Iao Valley River - high-fidelity recorded audio
async function loadIaoValleyRiverBuffer(audioContext: AudioContext): Promise<AudioBuffer> {
  if (iaoValleyRiverBuffer) return iaoValleyRiverBuffer;
  
  const response = await fetch(iaoValleyRiverAudio);
  const arrayBuffer = await response.arrayBuffer();
  iaoValleyRiverBuffer = await audioContext.decodeAudioData(arrayBuffer);
  return iaoValleyRiverBuffer;
}

function createRainWater(audioContext: AudioContext, gainNode: GainNode): { source: AudioBufferSourceNode; extras: OscillatorNode[]; isAsync: true; loadPromise: Promise<void> } {
  const bufferSource = audioContext.createBufferSource();
  bufferSource.loop = true;
  
  const loadPromise = loadIaoValleyRiverBuffer(audioContext).then((buffer) => {
    bufferSource.buffer = buffer;
    bufferSource.connect(gainNode);
  });
  
  return { source: bufferSource, extras: [], isAsync: true, loadPromise };
}

// Rainforest rain - high-fidelity recorded audio
async function loadRainforestRainBuffer(audioContext: AudioContext): Promise<AudioBuffer> {
  if (rainforestRainBuffer) return rainforestRainBuffer;
  
  const response = await fetch(rainforestRainAudio);
  const arrayBuffer = await response.arrayBuffer();
  rainforestRainBuffer = await audioContext.decodeAudioData(arrayBuffer);
  return rainforestRainBuffer;
}

function createRainforestRain(audioContext: AudioContext, gainNode: GainNode): { source: AudioBufferSourceNode; extras: OscillatorNode[]; isAsync: true; loadPromise: Promise<void> } {
  const bufferSource = audioContext.createBufferSource();
  bufferSource.loop = true;
  
  const loadPromise = loadRainforestRainBuffer(audioContext).then((buffer) => {
    bufferSource.buffer = buffer;
    bufferSource.connect(gainNode);
  });
  
  return { source: bufferSource, extras: [], isAsync: true, loadPromise };
}

// Thunderstorm - high-fidelity recorded audio
async function loadThunderstormBuffer(audioContext: AudioContext): Promise<AudioBuffer> {
  if (thunderstormBuffer) return thunderstormBuffer;
  
  const response = await fetch(thunderstormAudio);
  const arrayBuffer = await response.arrayBuffer();
  thunderstormBuffer = await audioContext.decodeAudioData(arrayBuffer);
  return thunderstormBuffer;
}

function createThunderstorm(audioContext: AudioContext, gainNode: GainNode): { source: AudioBufferSourceNode; extras: OscillatorNode[]; isAsync: true; loadPromise: Promise<void> } {
  const bufferSource = audioContext.createBufferSource();
  bufferSource.loop = true;
  
  const loadPromise = loadThunderstormBuffer(audioContext).then((buffer) => {
    bufferSource.buffer = buffer;
    bufferSource.connect(gainNode);
  });
  
  return { source: bufferSource, extras: [], isAsync: true, loadPromise };
}

// ============================================
// FOREST & NIGHT SOUNDS
// ============================================

// Forest love - high-fidelity recorded audio
async function loadForestLoveBuffer(audioContext: AudioContext): Promise<AudioBuffer> {
  if (forestLoveBuffer) return forestLoveBuffer;
  
  const response = await fetch(forestLoveAudio);
  const arrayBuffer = await response.arrayBuffer();
  forestLoveBuffer = await audioContext.decodeAudioData(arrayBuffer);
  return forestLoveBuffer;
}

function createWindTrees(audioContext: AudioContext, gainNode: GainNode): { source: AudioBufferSourceNode; extras: OscillatorNode[]; isAsync: true; loadPromise: Promise<void> } {
  const bufferSource = audioContext.createBufferSource();
  bufferSource.loop = true;
  
  const loadPromise = loadForestLoveBuffer(audioContext).then((buffer) => {
    bufferSource.buffer = buffer;
    bufferSource.connect(gainNode);
  });
  
  return { source: bufferSource, extras: [], isAsync: true, loadPromise };
}

// Evening crickets - high-fidelity recorded audio
async function loadEveningCricketsBuffer(audioContext: AudioContext): Promise<AudioBuffer> {
  if (eveningCricketsBuffer) return eveningCricketsBuffer;
  
  const response = await fetch(eveningCricketsAudio);
  const arrayBuffer = await response.arrayBuffer();
  eveningCricketsBuffer = await audioContext.decodeAudioData(arrayBuffer);
  return eveningCricketsBuffer;
}

function createEveningCrickets(audioContext: AudioContext, gainNode: GainNode): { source: AudioBufferSourceNode; extras: OscillatorNode[]; isAsync: true; loadPromise: Promise<void> } {
  const bufferSource = audioContext.createBufferSource();
  bufferSource.loop = true;
  
  const loadPromise = loadEveningCricketsBuffer(audioContext).then((buffer) => {
    bufferSource.buffer = buffer;
    bufferSource.connect(gainNode);
  });
  
  return { source: bufferSource, extras: [], isAsync: true, loadPromise };
}

// Stream/river - high-fidelity recorded audio
async function loadStreamRiverBuffer(audioContext: AudioContext): Promise<AudioBuffer> {
  if (streamRiverBuffer) return streamRiverBuffer;
  
  const response = await fetch(streamRiverAudio);
  const arrayBuffer = await response.arrayBuffer();
  streamRiverBuffer = await audioContext.decodeAudioData(arrayBuffer);
  return streamRiverBuffer;
}

function createStreamRiver(audioContext: AudioContext, gainNode: GainNode): { source: AudioBufferSourceNode; extras: OscillatorNode[]; isAsync: true; loadPromise: Promise<void> } {
  const bufferSource = audioContext.createBufferSource();
  bufferSource.loop = true;
  
  const loadPromise = loadStreamRiverBuffer(audioContext).then((buffer) => {
    bufferSource.buffer = buffer;
    bufferSource.connect(gainNode);
  });
  
  return { source: bufferSource, extras: [], isAsync: true, loadPromise };
}

// ============================================
// FIRE & EVENING SOUNDS
// ============================================

// Campfire crackle - high-fidelity recorded audio
async function loadCampfireBuffer(audioContext: AudioContext): Promise<AudioBuffer> {
  if (campfireBuffer) return campfireBuffer;
  
  const response = await fetch(campfireAudio);
  const arrayBuffer = await response.arrayBuffer();
  campfireBuffer = await audioContext.decodeAudioData(arrayBuffer);
  return campfireBuffer;
}

function createCampfire(audioContext: AudioContext, gainNode: GainNode): { source: AudioBufferSourceNode; extras: OscillatorNode[]; isAsync: true; loadPromise: Promise<void> } {
  const bufferSource = audioContext.createBufferSource();
  bufferSource.loop = true;
  
  const loadPromise = loadCampfireBuffer(audioContext).then((buffer) => {
    bufferSource.buffer = buffer;
    bufferSource.connect(gainNode);
  });
  
  return { source: bufferSource, extras: [], isAsync: true, loadPromise };
}

// ============================================
// AIR & BREATH SOUNDS
// ============================================

// Breath pacing - slow oscillating tone for breathing rhythm
function createBreathPacing(audioContext: AudioContext, gainNode: GainNode) {
  const oscillators: OscillatorNode[] = [];
  const gains: GainNode[] = [];
  
  const osc = audioContext.createOscillator();
  const oscGain = audioContext.createGain();
  
  osc.type = "sine";
  osc.frequency.setValueAtTime(80, audioContext.currentTime);
  
  // Breathing rhythm modulation
  const lfo = audioContext.createOscillator();
  const lfoGain = audioContext.createGain();
  lfo.frequency.setValueAtTime(0.1, audioContext.currentTime);
  lfoGain.gain.setValueAtTime(0.15, audioContext.currentTime);
  lfo.connect(lfoGain);
  lfoGain.connect(oscGain.gain);
  
  oscGain.gain.setValueAtTime(0.1, audioContext.currentTime);
  
  osc.connect(oscGain);
  oscGain.connect(gainNode);
  
  osc.start();
  lfo.start();
  
  oscillators.push(osc, lfo);
  gains.push(oscGain);
  
  return { oscillators, gains };
}

// Soft white air noise
function createWhiteAir(audioContext: AudioContext, gainNode: GainNode) {
  const bufferSource = audioContext.createBufferSource();
  const filter = audioContext.createBiquadFilter();
  
  bufferSource.buffer = createNoiseBuffer(audioContext, "white");
  bufferSource.loop = true;
  
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(4000, audioContext.currentTime);
  filter.Q.setValueAtTime(0.3, audioContext.currentTime);
  
  bufferSource.connect(filter);
  filter.connect(gainNode);
  
  return { source: bufferSource, extras: [] };
}

// ============================================
// GROUNDING AMBIENCE SOUNDS
// ============================================

// Low frequency hum - high-fidelity recorded audio
async function loadLowHumBuffer(audioContext: AudioContext): Promise<AudioBuffer> {
  if (lowHumBuffer) return lowHumBuffer;
  
  const response = await fetch(lowHumAudio);
  const arrayBuffer = await response.arrayBuffer();
  lowHumBuffer = await audioContext.decodeAudioData(arrayBuffer);
  return lowHumBuffer;
}

function createLowHum(audioContext: AudioContext, gainNode: GainNode): { source: AudioBufferSourceNode; extras: OscillatorNode[]; isAsync: true; loadPromise: Promise<void> } {
  const bufferSource = audioContext.createBufferSource();
  bufferSource.loop = true;
  
  const loadPromise = loadLowHumBuffer(audioContext).then((buffer) => {
    bufferSource.buffer = buffer;
    bufferSource.connect(gainNode);
  });
  
  return { source: bufferSource, extras: [], isAsync: true, loadPromise };
}

// Brown noise - high-fidelity recorded audio
async function loadBrownNoiseBuffer(audioContext: AudioContext): Promise<AudioBuffer> {
  if (brownNoiseBuffer) return brownNoiseBuffer;
  
  const response = await fetch(brownNoiseAudio);
  const arrayBuffer = await response.arrayBuffer();
  brownNoiseBuffer = await audioContext.decodeAudioData(arrayBuffer);
  return brownNoiseBuffer;
}

function createBrownNoise(audioContext: AudioContext, gainNode: GainNode): { source: AudioBufferSourceNode; extras: OscillatorNode[]; isAsync: true; loadPromise: Promise<void> } {
  const bufferSource = audioContext.createBufferSource();
  bufferSource.loop = true;
  
  const loadPromise = loadBrownNoiseBuffer(audioContext).then((buffer) => {
    bufferSource.buffer = buffer;
    bufferSource.connect(gainNode);
  });
  
  return { source: bufferSource, extras: [], isAsync: true, loadPromise };
}

// ============================================
// FREQUENCY (Hz) SOUNDS
// ============================================

// 432 Hz - Grounding & Gentle Calm - high-fidelity recorded audio
async function loadHz432Buffer(audioContext: AudioContext): Promise<AudioBuffer> {
  if (hz432Buffer) return hz432Buffer;
  
  const response = await fetch(hz432Audio);
  const arrayBuffer = await response.arrayBuffer();
  hz432Buffer = await audioContext.decodeAudioData(arrayBuffer);
  return hz432Buffer;
}

function createHz432(audioContext: AudioContext, gainNode: GainNode): { source: AudioBufferSourceNode; extras: OscillatorNode[]; isAsync: true; loadPromise: Promise<void> } {
  const bufferSource = audioContext.createBufferSource();
  bufferSource.loop = true;
  
  const loadPromise = loadHz432Buffer(audioContext).then((buffer) => {
    bufferSource.buffer = buffer;
    bufferSource.connect(gainNode);
  });
  
  return { source: bufferSource, extras: [], isAsync: true, loadPromise };
}

// 528 Hz - Mood-Lifting & Heart-Centered - high-fidelity recorded audio
async function loadHz528Buffer(audioContext: AudioContext): Promise<AudioBuffer> {
  if (hz528Buffer) return hz528Buffer;
  
  const response = await fetch(hz528Audio);
  const arrayBuffer = await response.arrayBuffer();
  hz528Buffer = await audioContext.decodeAudioData(arrayBuffer);
  return hz528Buffer;
}

function createHz528(audioContext: AudioContext, gainNode: GainNode): { source: AudioBufferSourceNode; extras: OscillatorNode[]; isAsync: true; loadPromise: Promise<void> } {
  const bufferSource = audioContext.createBufferSource();
  bufferSource.loop = true;
  
  const loadPromise = loadHz528Buffer(audioContext).then((buffer) => {
    bufferSource.buffer = buffer;
    bufferSource.connect(gainNode);
  });
  
  return { source: bufferSource, extras: [], isAsync: true, loadPromise };
}

// 174 Hz - Deep Body Calm - high-fidelity recorded audio
async function loadHz174Buffer(audioContext: AudioContext): Promise<AudioBuffer> {
  if (hz174Buffer) return hz174Buffer;
  
  const response = await fetch(hz174Audio);
  const arrayBuffer = await response.arrayBuffer();
  hz174Buffer = await audioContext.decodeAudioData(arrayBuffer);
  return hz174Buffer;
}

function createHz174(audioContext: AudioContext, gainNode: GainNode): { source: AudioBufferSourceNode; extras: OscillatorNode[]; isAsync: true; loadPromise: Promise<void> } {
  const bufferSource = audioContext.createBufferSource();
  bufferSource.loop = true;
  
  const loadPromise = loadHz174Buffer(audioContext).then((buffer) => {
    bufferSource.buffer = buffer;
    bufferSource.connect(gainNode);
  });
  
  return { source: bufferSource, extras: [], isAsync: true, loadPromise };
}

// 10 Hz Alpha - Calm & Focus - high-fidelity recorded audio
async function loadHz10AlphaBuffer(audioContext: AudioContext): Promise<AudioBuffer> {
  if (hz10AlphaBuffer) return hz10AlphaBuffer;
  
  const response = await fetch(hz10AlphaAudio);
  const arrayBuffer = await response.arrayBuffer();
  hz10AlphaBuffer = await audioContext.decodeAudioData(arrayBuffer);
  return hz10AlphaBuffer;
}

function createHz10Alpha(audioContext: AudioContext, gainNode: GainNode): { source: AudioBufferSourceNode; extras: OscillatorNode[]; isAsync: true; loadPromise: Promise<void> } {
  const bufferSource = audioContext.createBufferSource();
  bufferSource.loop = true;
  
  const loadPromise = loadHz10AlphaBuffer(audioContext).then((buffer) => {
    bufferSource.buffer = buffer;
    bufferSource.connect(gainNode);
  });
  
  return { source: bufferSource, extras: [], isAsync: true, loadPromise };
}

// 6 Hz Theta - Nervous System Ease - high-fidelity recorded audio
async function loadHz6ThetaBuffer(audioContext: AudioContext): Promise<AudioBuffer> {
  if (hz6ThetaBuffer) return hz6ThetaBuffer;
  
  const response = await fetch(hz6ThetaAudio);
  const arrayBuffer = await response.arrayBuffer();
  hz6ThetaBuffer = await audioContext.decodeAudioData(arrayBuffer);
  return hz6ThetaBuffer;
}

function createHz6Theta(audioContext: AudioContext, gainNode: GainNode): { source: AudioBufferSourceNode; extras: OscillatorNode[]; isAsync: true; loadPromise: Promise<void> } {
  const bufferSource = audioContext.createBufferSource();
  bufferSource.loop = true;
  
  const loadPromise = loadHz6ThetaBuffer(audioContext).then((buffer) => {
    bufferSource.buffer = buffer;
    bufferSource.connect(gainNode);
  });
  
  return { source: bufferSource, extras: [], isAsync: true, loadPromise };
}

// ============================================
// MAIN HOOK
// ============================================

interface AudioSources {
  sources: (AudioBufferSourceNode | OscillatorNode)[];
  extras: OscillatorNode[];
}

export function useAmbientSound(options: AmbientSoundOptions = {}): UseAmbientSoundReturn {
  const {
    volume: initialVolume = 0.3,
    fadeInDuration = 2500,
    fadeOutDuration = 2000,
  } = options;

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSound, setCurrentSound] = useState<SoundType | null>(null);
  const [volume, setVolumeState] = useState(initialVolume);

  const audioContextRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const sourcesRef = useRef<AudioSources | null>(null);

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      // Create AudioContext only on first user interaction to comply with autoplay policies
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      audioContextRef.current = new AudioCtx();
      gainNodeRef.current = audioContextRef.current.createGain();
      gainNodeRef.current.connect(audioContextRef.current.destination);
      gainNodeRef.current.gain.setValueAtTime(0, audioContextRef.current.currentTime);
    }
    // Always attempt resume synchronously within user gesture for iOS/Safari compatibility
    if (audioContextRef.current.state === "suspended") {
      audioContextRef.current.resume().catch(() => {});
    }
    return audioContextRef.current;
  }, []);

  const stopSources = useCallback(() => {
    if (sourcesRef.current) {
      sourcesRef.current.sources.forEach((source) => {
        try { source.stop(); } catch {}
      });
      sourcesRef.current.extras.forEach((extra) => {
        try { extra.stop(); } catch {}
      });
      sourcesRef.current = null;
    }
  }, []);

  const stop = useCallback(() => {
    if (!audioContextRef.current || !gainNodeRef.current) return;

    const ctx = audioContextRef.current;
    const gain = gainNodeRef.current;

    gain.gain.setValueAtTime(gain.gain.value, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + fadeOutDuration / 1000);

    setTimeout(() => {
      stopSources();
      setIsPlaying(false);
      setCurrentSound(null);
    }, fadeOutDuration);
  }, [fadeOutDuration, stopSources]);

  const play = useCallback((sound: SoundType) => {
    // Silent option doesn't play audio
    if (sound === "visual-only") {
      stopSources();
      setIsPlaying(true);
      setCurrentSound(sound);
      return;
    }

    // getAudioContext already calls resume() synchronously within the user tap gesture
    const ctx = getAudioContext();
    const gain = gainNodeRef.current!;

    stopSources();

    // Wait for resume to complete before starting audio nodes
    const resumePromise =
      ctx.state === "suspended"
        ? ctx.resume().catch((err) => {
            console.warn("AudioContext resume failed", err);
          })
        : Promise.resolve();

    void resumePromise.then(() => {
      let sources: (AudioBufferSourceNode | OscillatorNode)[] = [];
      let extras: OscillatorNode[] = [];
      let skipDefaultFadeIn = false;

      // Bilateral Stimulation sounds
      if (sound === "bilateral-ocean") {
        const result = createBilateralOcean(ctx, gain);
        sources = [result.source];
        extras = result.extras;
        result.source.start();
      } else if (sound === "bilateral-rain") {
        const result = createBilateralRain(ctx, gain);
        sources = result.sources;
        extras = result.extras;
      } else if (sound === "bilateral-forest") {
        const result = createBilateralForest(ctx, gain);
        sources = result.sources;
        extras = result.extras;
      }
      // Ocean & Water sounds
      else if (sound === "ocean-swell") {
        const result = createOceanSwell(ctx, gain);
        sources = [result.source];
        extras = result.extras;
        result.loadPromise.then(() => {
          // If user switched sounds while loading, starting may throw.
          try {
            result.source.start();
          } catch {
            return;
          }
          gain.gain.setValueAtTime(0, ctx.currentTime);
          gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + fadeInDuration / 1000);
        });
        skipDefaultFadeIn = true;
      } else if (sound === "distant-waves") {
        const result = createDistantWaves(ctx, gain);
        sources = [result.source];
        extras = result.extras;
        result.loadPromise.then(() => {
          try {
            result.source.start();
          } catch {
            return;
          }
          gain.gain.setValueAtTime(0, ctx.currentTime);
          gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + fadeInDuration / 1000);
        });
        skipDefaultFadeIn = true;
      } else if (sound === "underwater") {
        const result = createUnderwater(ctx, gain);
        sources = [result.source];
        extras = result.extras;
        result.loadPromise.then(() => {
          try {
            result.source.start();
          } catch {
            return;
          }
          gain.gain.setValueAtTime(0, ctx.currentTime);
          gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + fadeInDuration / 1000);
        });
        skipDefaultFadeIn = true;
      }
      // Rain & Storm sounds
      else if (sound === "rain-water") {
        const result = createRainWater(ctx, gain);
        sources = [result.source];
        extras = result.extras;
        result.loadPromise.then(() => {
          try {
            result.source.start();
          } catch {
            return;
          }
          gain.gain.setValueAtTime(0, ctx.currentTime);
          gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + fadeInDuration / 1000);
        });
        skipDefaultFadeIn = true;
      } else if (sound === "rainforest-rain") {
        const result = createRainforestRain(ctx, gain);
        sources = [result.source];
        extras = result.extras;
        result.loadPromise.then(() => {
          try {
            result.source.start();
          } catch {
            return;
          }
          gain.gain.setValueAtTime(0, ctx.currentTime);
          gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + fadeInDuration / 1000);
        });
        skipDefaultFadeIn = true;
      } else if (sound === "thunderstorm") {
        const result = createThunderstorm(ctx, gain);
        sources = [result.source];
        extras = result.extras;
        result.loadPromise.then(() => {
          try {
            result.source.start();
          } catch {
            return;
          }
          gain.gain.setValueAtTime(0, ctx.currentTime);
          gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + fadeInDuration / 1000);
        });
        skipDefaultFadeIn = true;
      }
      // Forest & Night sounds
      else if (sound === "wind-trees") {
        const result = createWindTrees(ctx, gain);
        sources = [result.source];
        extras = result.extras;
        result.source.start();
      } else if (sound === "evening-crickets") {
        const result = createEveningCrickets(ctx, gain);
        sources = [result.source];
        extras = result.extras;
        result.loadPromise.then(() => {
          try {
            result.source.start();
          } catch {
            return;
          }
          gain.gain.setValueAtTime(0, ctx.currentTime);
          gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + fadeInDuration);
        });
        skipDefaultFadeIn = true;
      } else if (sound === "stream-river") {
        const result = createStreamRiver(ctx, gain);
        sources = [result.source];
        extras = result.extras;
        result.loadPromise.then(() => {
          try {
            result.source.start();
          } catch {
            return;
          }
          gain.gain.setValueAtTime(0, ctx.currentTime);
          gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + fadeInDuration / 1000);
        });
        skipDefaultFadeIn = true;
      }
      // Fire & Evening sounds
      else if (sound === "campfire") {
        const result = createCampfire(ctx, gain);
        sources = [result.source];
        extras = result.extras;
        result.loadPromise.then(() => {
          try {
            result.source.start();
          } catch {
            return;
          }
          gain.gain.setValueAtTime(0, ctx.currentTime);
          gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + fadeInDuration);
        });
        skipDefaultFadeIn = true;
      }
      // Air & Breath sounds
      else if (sound === "breath-pacing") {
        const result = createBreathPacing(ctx, gain);
        sources = result.oscillators;
      } else if (sound === "white-air") {
        const result = createWhiteAir(ctx, gain);
        sources = [result.source];
        extras = result.extras;
        result.source.start();
      }
      // Grounding Ambience sounds
      else if (sound === "low-hum") {
        const result = createLowHum(ctx, gain);
        sources = [result.source];
        extras = result.extras;
        result.loadPromise.then(() => {
          try {
            result.source.start();
          } catch {
            return;
          }
          gain.gain.setValueAtTime(0, ctx.currentTime);
          gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + fadeInDuration);
        });
        skipDefaultFadeIn = true;
      } else if (sound === "brown-noise") {
        const result = createBrownNoise(ctx, gain);
        sources = [result.source];
        extras = result.extras;
        result.loadPromise.then(() => {
          try {
            result.source.start();
          } catch {
            return;
          }
          gain.gain.setValueAtTime(0, ctx.currentTime);
          gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + fadeInDuration);
        });
        skipDefaultFadeIn = true;
      }
      // Frequency (Hz) sounds
      else if (sound === "hz-432") {
        const result = createHz432(ctx, gain);
        sources = [result.source];
        extras = result.extras;
        result.loadPromise.then(() => {
          try {
            result.source.start();
          } catch {
            return;
          }
          gain.gain.setValueAtTime(0, ctx.currentTime);
          gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + fadeInDuration);
        });
        skipDefaultFadeIn = true;
      } else if (sound === "hz-528") {
        const result = createHz528(ctx, gain);
        sources = [result.source];
        extras = result.extras;
        result.loadPromise.then(() => {
          try {
            result.source.start();
          } catch {
            return;
          }
          gain.gain.setValueAtTime(0, ctx.currentTime);
          gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + fadeInDuration);
        });
        skipDefaultFadeIn = true;
      } else if (sound === "hz-174") {
        const result = createHz174(ctx, gain);
        sources = [result.source];
        extras = result.extras;
        result.loadPromise.then(() => {
          try {
            result.source.start();
          } catch {
            return;
          }
          gain.gain.setValueAtTime(0, ctx.currentTime);
          gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + fadeInDuration);
        });
        skipDefaultFadeIn = true;
      } else if (sound === "hz-10-alpha") {
        const result = createHz10Alpha(ctx, gain);
        sources = [result.source];
        extras = result.extras;
        result.loadPromise.then(() => {
          try {
            result.source.start();
          } catch {
            return;
          }
          gain.gain.setValueAtTime(0, ctx.currentTime);
          gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + fadeInDuration);
        });
        skipDefaultFadeIn = true;
      } else if (sound === "hz-6-theta") {
        const result = createHz6Theta(ctx, gain);
        sources = [result.source];
        extras = result.extras;
        result.loadPromise.then(() => {
          try {
            result.source.start();
          } catch {
            return;
          }
          gain.gain.setValueAtTime(0, ctx.currentTime);
          gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + fadeInDuration);
        });
        skipDefaultFadeIn = true;
      }

      sourcesRef.current = { sources, extras };

      // Fade in (skip for async sounds that handle their own fade-in)
      if (!skipDefaultFadeIn) {
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + fadeInDuration / 1000);
      }

      setIsPlaying(true);
      setCurrentSound(sound);
    });
  }, [getAudioContext, volume, fadeInDuration, stopSources]);

  const setVolume = useCallback((newVolume: number) => {
    setVolumeState(newVolume);
    if (gainNodeRef.current && audioContextRef.current && currentSound !== "visual-only") {
      gainNodeRef.current.gain.setValueAtTime(
        newVolume,
        audioContextRef.current.currentTime
      );
    }
  }, [currentSound]);

  const toggle = useCallback((sound: SoundType) => {
    if (isPlaying && currentSound === sound) {
      stop();
    } else {
      play(sound);
    }
  }, [isPlaying, currentSound, play, stop]);

  useEffect(() => {
    return () => {
      stopSources();
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [stopSources]);

  return {
    isPlaying,
    currentSound,
    volume,
    play,
    stop,
    setVolume,
    toggle,
  };
}
