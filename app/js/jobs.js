import { canvasContext, ViewState, _DS_Fps } from "./state.js";
import { audioGraph, audioState } from "./state.js";

export const drawVerticalBars = () => {
    canvasContext.clearRect(0, 0, ViewState.canvasWidth, ViewState.canvasHeight); // clear canvas
    audioGraph.analyserNode.getByteFrequencyData(audioState.dataArray);
    canvasContext.fillStyle = `rgb(0,0,0)`;
    canvasContext.fillRect(0, 0, ViewState.canvasWidth, ViewState.canvasHeight);
    canvasContext.fillStyle = `rgb(255,255,255)`;

    const barWidth = (ViewState.canvasWidth / audioState.bufferLength) * 2.5;
    let barHeight;
    let x = 0;
    for (let i = 0; i < audioState.bufferLength; i++) {
        barHeight = audioState.dataArray[i];
        canvasContext.fillStyle = `rgb(${barHeight + ViewState.color[0]}, ${ViewState.color[1]}, ${ViewState.color[2]})`;
        let y = ViewState.canvasHeight - barHeight / 2;
        canvasContext.fillRect(x, y, barWidth, barHeight);
        x += barWidth + 1;
    }

    _DS_Fps.count++;
}

export const drawCircles = () => {
    canvasContext.clearRect(0, 0, ViewState.canvasWidth, ViewState.canvasHeight); // clear canvas
    audioGraph.analyserNode.getByteFrequencyData(audioState.dataArray);
    canvasContext.fillStyle = `rgb(0,0,0)`;
    canvasContext.fillRect(0, 0, ViewState.canvasWidth, ViewState.canvasHeight);
    canvasContext.fillStyle = `rgb(255,255,255)`;

    let x = 0;
    const r = 10;
    for (let i = 0; i < audioState.bufferLength; i++) {
        let radius = audioState.dataArray[i] / 2;
        canvasContext.beginPath();
        canvasContext.fillStyle = `rgb(${radius + ViewState.color[0]}, ${ViewState.color[1]}, ${ViewState.color[2]})`;
        canvasContext.ellipse(x, ViewState.canvasHeight / 2, radius, radius, 0, 0, 2 * Math.PI)
        canvasContext.fill();
        canvasContext.stroke();
        x += 2 * r + 1;
    }

    _DS_Fps.count++;

}


// TO-IMP: 2023-10-02
export const drawHorizontalBars = () => { canvasContext.clearRect(0, 0, ViewState.canvasWidth, ViewState.canvasHeight); }
export const drawPD = () => { canvasContext.clearRect(0, 0, ViewState.canvasWidth, ViewState.canvasHeight);  }
export const drawStars = () => { canvasContext.clearRect(0, 0, ViewState.canvasWidth, ViewState.canvasHeight); }