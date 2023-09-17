// Handle to our File upload element
const input = document.querySelector("input");
const canvas = document.querySelector("canvas");
const canvasContext = canvas.getContext("2d");

const audioContext = new AudioContext();
const audioElement = document.createElement("audio");
const analyser = audioContext.createAnalyser();

let source = null;
let gainNode = null;
let distortionNode = null;

analyser.fftSize = 2048;
// When there's a change in the input element, read the file
const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);
console.log(dataArray.length)
analyser.getByteTimeDomainData(dataArray);

let playing = false;

input?.addEventListener("change", (data) => {
    const blob = data.target.files[0];
    const audioSrc = URL.createObjectURL(blob);
    audioElement.src = audioSrc;

    // Required as context will stat on in "Suspend state"
    audioContext.resume();

    source = audioContext.createMediaElementSource(audioElement)
    gainNode = audioContext.createGain();

    // Source Node -> Analyser -> GainNode -> Destination (Speakers)
    source.connect(analyser)
        .connect(gainNode)
        .connect(audioContext.destination)
});

// Select our play button
const playButton = document.querySelector("button");

playButton.addEventListener("click", async () => {
    if (!playing) {
        await audioElement.play();
        playing = true;
        playButton.innerText = "Resume"
    } else {
        audioElement.pause();
        playing = false;
        playButton.innerText = "Play"
    }
});

const loop = () => {
    canvasContext.clearRect(0, 0, 300, 300); // clear canvas
    analyser.getByteTimeDomainData(dataArray);
    const timestamp = audioContext.getOutputTimestamp();
    console.log(timestamp)
    canvasContext.fillStyle = "rgb(200, 200, 200)";
    canvasContext.fillRect(0, 0, 400, 400);
    canvasContext.lineWidth = 2;
    canvasContext.strokeStyle = "rgb(0, 0, 0)";
    canvasContext.beginPath();

    const sliceWidth = 400 / bufferLength;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = v * (200 / 3.0);

        if (i === 0) {
            canvasContext.moveTo(x, y);
        } else {
            canvasContext.lineTo(x, y);
        }

        x += sliceWidth;
    }
    canvasContext.lineTo(400, 400 / 2);
    canvasContext.stroke();

    window.requestAnimationFrame(loop);
}

loop();