import { dispatchMap } from "./constants.js";
// CANVAS
export const canvas = document.querySelector("canvas");

const view = document.getElementById("_content");
canvas.width = view.clientWidth / 2;
canvas.height = view.clientHeight;

export const canvasContext = canvas.getContext("2d");

export const ViewState = {
    canvasHeight: canvas.height,
    canvasWidth: canvas.width,
};

canvasContext.clearRect(0, 0, ViewState.canvasWidth, ViewState.canvasHeight); // clear canvas

// AUDIO
export const audioContext = new AudioContext();
export const audioElement = document.createElement("audio");

export const audioGraph = {
    sourceNode: null,
    gainNode: null,
    AnalyserNode: null
};

export const audioState = { 
    bufferLength: null, 
    dataArray: null, 
    audioPlaying: false,
    audioMute: false
};

// CONTROLS
export const htmlInput = document.querySelector("input");
export const playButton = document.getElementById("_playBtn");
export const muteButton = document.getElementById("_muteBtn");
export const volSlider = document.getElementById("_volSlider");

export const visualisationDropdown = document.getElementById("_DDvisualisation");
// populate
for(const opt of Object.keys(dispatchMap)) visualisationDropdown.appendChild(new Option(opt, `_${opt}`));

export const Visualisation = { CURRENT_VISULIZATION:Object.keys(dispatchMap)[0] }

export const m__FPS = {
    count: 0,
    elapsed: 0,
    stop: false,
    interval: 1000 / 60,
    then: performance.now()
}