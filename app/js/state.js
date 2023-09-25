// CANVAS
export const canvas = document.querySelector("canvas");
export const canvasContext = canvas.getContext("2d");
export const canvasHeight = canvas.height;
export const canvasWidth = canvas.width;

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
