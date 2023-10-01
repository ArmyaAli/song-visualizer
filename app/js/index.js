import { canvasContext, audioGraph, canvasHeight, canvasWidth, audioState, visualisationDropdown, canvas } from './state.js'
import './listeners.js'

// TODO: refactor some of the below state variables
canvasContext.clearRect(0, 0, canvasWidth, canvasHeight); // clear canvas

// FPS Control
let now;
let elapsed;
let stop = false;
let frameCount = 0;
let fps = 60;
let fpsInterval = 1000 / fps;
let then = performance.now();

class VisualisationContext {
    curr = "BAR"
    constructor() {
        visualisationDropdown.addEventListener('change', ($e) => {
            let text = visualisationDropdown.selectedOptions[0]?.text;
            this.curr = text?.toUpperCase();
        })
    }

    exec() {
        if (this.curr === "BAR") this.barExec();
        if (this.curr === "CIRCLE") this.circleExec();
    }

    barExec() {
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

    circleExec() {
        canvasContext.clearRect(0, 0, canvasWidth, canvasHeight); // clear canvas
        audioGraph.analyserNode.getByteFrequencyData(audioState.dataArray);
        canvasContext.fillStyle = `rgb(0,0,0)`;
        canvasContext.fillRect(0, 0, canvasWidth, canvasHeight);
        canvasContext.fillStyle = `rgb(255,255,255)`;

        let x = 0;
        const r = 10;
        for (let i = 0; i < audioState.bufferLength; i++) { 
            let radius = audioState.dataArray[i];
            canvasContext.beginPath();
            canvasContext.fillStyle = `rgb(${radius + 100}, 50, 50)`;
            canvasContext.ellipse(x, 100, radius, radius, 0, 0, 2 * Math.PI)
            canvasContext.fill();
            canvasContext.stroke();
            x += 2*r + 1;
        } 
    
    }
}

const vContext = new VisualisationContext();

// Canvas loop
export const loop = () => {
    // debugger;
    if (!audioState.audioPlaying) return;
    window.requestAnimationFrame(loop);

    now = performance.now();
    elapsed = now - then;
    
    if (elapsed > fpsInterval){
        then = now - (elapsed % fpsInterval);
        vContext.exec();
    } 
}