const WIDTH = 2000;
const HEIGHT = 400;
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

analyser.fftSize = 256;
canvasContext.clearRect(0, 0, WIDTH, HEIGHT); // clear canvas
// When there's a change in the input element, read the file
const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);
analyser.getByteTimeDomainData(dataArray);

let playing = false;
let muted = false;

input?.addEventListener("change", (data) => {
    const blob = data.target.files[0];
    const audioSrc = URL.createObjectURL(blob);
    audioElement.src = audioSrc;

    // Required as context will stat on in "Suspend state"
    audioContext.resume();

    source = audioContext.createMediaElementSource(audioElement)
    gainNode = audioContext.createGain();

    // Source Node -> AnalyserNode -> GainNode -> DestinationNode (Speakers / Hardware etc)
    source.connect(analyser)
        .connect(gainNode)
        .connect(audioContext.destination)
});

// Select our play button
const playButton = document.getElementById("_playBtn");
const muteButton = document.getElementById("_muteBtn");
const volSlider = document.getElementById("_volSlider");

playButton.addEventListener("click", async () => {
    if (audioElement === null) return;
    if (!playing) {
        await audioElement.play();
        playing = true;
        playButton.innerText = "Resume"
        loop();
    } else {
        audioElement.pause();
        playing = false;
        playButton.innerText = "Play"
    }
});

muteButton.addEventListener("click", async () => {
    if (gainNode === null) {
        console.error("No song uploaded.")
        return;
    }

    muted = !muted;

    if (muted) {
        muteButton.innerText = "unmute"
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    } else {
        muteButton.innerText = "mute"
        gainNode.gain.setValueAtTime(1, audioContext.currentTime);
    }

});

volSlider.addEventListener("input", async (e) => {
    if (gainNode === null) {
        console.error("No song uploaded.")
        return;
    }

    // 0 <= volume <= 100 -> 0 <= volume <= 1
    const volume = e.target.value / 100;
    gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
});


// FPS Control
let stop = false;
let frameCount = 0;
let fps = 60;
let fpsInterval;
let startTime;
let now;
let then;
let elapsed;

// Init FPS Control 
fpsInterval = 1000 / fps;
then = Date.now();
startTime = then;

// Canvas loop
const loop = () => {
    // debugger;
    if(!playing) return;
    window.requestAnimationFrame(loop);
    
    now = Date.now();
    elapsed = now - then;
    
    canvasContext.clearRect(0, 0, WIDTH, HEIGHT); // clear canvas
    if (elapsed > fpsInterval) {
        analyser.getByteFrequencyData(dataArray);
        canvasContext.fillStyle = "rgb(0,0,0)";
        canvasContext.fillRect(0, 0, WIDTH, HEIGHT);

        const barWidth = (WIDTH / bufferLength) * 2.5;
        let barHeight;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
            barHeight = dataArray[i] / 2;
            console.log(barHeight)
            canvasContext.fillStyle = `rgb(${barHeight + 100}, 50, 50)`;
            console.log(canvasContext.fillStyle);
            canvasContext.fillRect(x, HEIGHT - barHeight / 2, barWidth, barHeight);
            x += barWidth + 1;
        }
    }
}
