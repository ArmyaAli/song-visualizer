import { drawVerticalBars, drawCircles, drawHorizontalBars, drawStars, drawPD } from './jobs.js'

// CANVAS
export const canvas = document.querySelector("canvas");

export const canvasContext = canvas.getContext("2d");
// AUDIO
export const audioContext = new AudioContext();
export const audioElement = document.createElement("audio");


// CONTROLS
export const htmlInput = document.querySelector("input");
export const playButton = document.getElementById("_playBtn");
export const muteButton = document.getElementById("_muteBtn");
export const volSlider = document.getElementById("_volSlider");
export const colorPicker = document.getElementById("_colorPicker");
export const _rangeValueLabel = document.getElementById("_rangeValue");
export const visualisationDropdown = document.getElementById("_DDvisualisation");


// DATA STRUCTURES
export const _DS_UploadMap = {}
export const _DS_DispatchMap = {
    "Vertical Bars": drawVerticalBars,
    "Horizontal Bars": drawHorizontalBars,
    "Circles": drawCircles,
    "Possion distribution": drawPD,
    "Stars": drawStars
}
export const _DS_Fps = {
    count: 0,
    elapsed: 0,
    stop: false,
    interval: 1000 / 60,
    then: performance.now()
}

export const audioGraph = {
    sourceNode: null,
    gainNode: null,
    AnalyserNode: null
};

export const audioState = {
    bufferLength: null,
    dataArray: null,
    audioPlaying: false,
    audioMute: false,
    lastVolumeValue: 0.5,
    songName: null,
    fileSize: -1,
};

export const ViewState = {
    canvasHeight: canvas.height,
    canvasWidth: canvas.width,
    color: [100, 50, 50]
};

// populate
for (const opt of Object.keys(_DS_DispatchMap)) visualisationDropdown.appendChild(new Option(opt, `_${opt}`));

export const Visualisation = { CURRENT_VISULIZATION: Object.keys(_DS_DispatchMap)[0] }

const view = document.getElementById("_content");
if (view.clientWidth <= 800) {
    canvas.height = ViewState.canvasHeight = view.clientHeight / 2;
    canvas.width = ViewState.canvasWidth = view.clientWidth - 8;
} else {
    canvas.width = ViewState.canvasWidth = view.clientWidth / 2;
    canvas.height = ViewState.canvasHeight = view.clientHeight;
}