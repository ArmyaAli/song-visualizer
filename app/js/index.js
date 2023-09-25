import {canvasContext, audioGraph, canvasHeight, canvasWidth, audioState } from './state.js'
import './listeners.js'


canvasContext.clearRect(0, 0, canvasWidth, canvasHeight); // clear canvas
// When there's a change in the input element, read the file


let playing = false;
let muted = false;

// FPS Control
let now;
let elapsed;
let stop = false;
let frameCount = 0;
let fps = 60;
let fpsInterval = 1000 / fps;
let then = performance.now();

// Init FPS Control 
let startTime = then;
// Canvas loop
export const loop = () => {
    // debugger;
    if (!audioState.audioPlaying) return;
    window.requestAnimationFrame(loop);

    now = performance.now();
    elapsed = now - then;

    if (elapsed > fpsInterval) {
        then = now - (elapsed % fpsInterval);
        console.log("ALi")
        canvasContext.clearRect(0, 0, canvasWidth, canvasHeight); // clear canvas
        audioGraph.analyserNode.getByteFrequencyData(audioState.dataArray);
        canvasContext.fillStyle = `rgb(0,0,0)`;
        canvasContext.fillRect(0, 0, canvasWidth, canvasHeight);
        canvasContext.fillStyle = `rgb(255,255,255)`;

        const barWidth = (canvasWidth / audioState.bufferLength) * 2.5;
        let barHeight;
        let x = 0;

        for (let i = 0; i < audioState.bufferLength; i++) {
            barHeight = audioState.dataArray[i];
            canvasContext.fillStyle = `rgb(${barHeight + 100}, 50, 50)`;
            let y = canvasHeight - barHeight / 2;
            canvasContext.fillRect(x, y, barWidth, barHeight);
            x += barWidth + 1;
        }

        frameCount += 1
    }
}
