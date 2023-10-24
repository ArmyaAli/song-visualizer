import { htmlInput, playButton, muteButton, volSlider, audioContext, audioElement, audioGraph, audioState, visualisationDropdown, Visualisation, canvas, ViewState, canvasContext, colorPicker, _rangeValueLabel, _DS_UploadMap } from './state.js'
import { hexToRgb } from './util.js'
import { loop } from './main.js'
import { updateFileUploadLabel } from './jobs.js';
import { errorPopup } from './errors.js';

// GLOBAL
window.addEventListener('load', () => {
    canvasContext.fillRect(0, 0, ViewState.canvasWidth, ViewState.canvasHeight);
    canvasContext.fillStyle = `rgb(255,255,255)`;
})

window.addEventListener('resize', () => {
    const view = document.getElementById("_content");
    if (view.clientWidth <= 800) {
        canvas.height = ViewState.canvasHeight = view.clientHeight / 2;
        canvas.width = ViewState.canvasWidth = view.clientWidth - 8;
        return;
    }

    canvas.width = ViewState.canvasWidth = view.clientWidth / 2;
    canvas.height = ViewState.canvasHeight = view.clientHeight;
    canvasContext.fillRect(0, 0, ViewState.canvasWidth, ViewState.canvasHeight);
    canvasContext.fillStyle = `rgb(255,255,255)`;
});

// CONTROLS
colorPicker.addEventListener('change', ($event) => {
    const value = $event.target.value;
    const rgb = hexToRgb(value);
    if (rgb) {
        ViewState.color[0] = rgb.r;
        ViewState.color[1] = rgb.g;
        ViewState.color[2] = rgb.b;
    } else {
        console.error("Error reading color");
    }
});

visualisationDropdown.addEventListener('change', () => Visualisation.CURRENT_VISULIZATION = visualisationDropdown.selectedOptions[0]?.text)
htmlInput?.addEventListener("change", (data) => {
    const blob = data.target.files[0];
    const audioSrc = URL.createObjectURL(blob);
    audioElement.src = audioSrc;

    // If the file is not an audio file, we can't do much
    if (!blob.type.includes("audio")) {
        console.log("Error, please upload a music file");
        errorPopup(0);
        return;
    }

    // Set file data
    audioState.fileSize = blob.size;
    audioState.songName = blob.name;
    // Required as context will start on in "Suspend state"
    audioContext.resume();

    audioGraph.sourceNode = audioContext.createMediaElementSource(audioElement)
    audioGraph.gainNode = audioContext.createGain();
    audioGraph.analyserNode = audioContext.createAnalyser();
    audioGraph.analyserNode.fftSize = 256;

    audioState.bufferLength = audioGraph.analyserNode.frequencyBinCount;
    audioState.dataArray = new Uint8Array(audioState.bufferLength);

    audioGraph.analyserNode.getByteTimeDomainData(audioState.dataArray);

    // Source Node -> AnalyserNode -> GainNode -> DestinationNode (Speakers / Hardware etc)
    audioGraph.sourceNode.connect(audioGraph.gainNode)
        .connect(audioGraph.analyserNode)
        .connect(audioContext.destination)

    // Add to our uploadMap
    _DS_UploadMap[blob.name] = audioSrc;
    // Update label
    updateFileUploadLabel(audioState.songName);
    // Persist
    localStorage.setItem(blob.name, audioSrc);
});


playButton?.addEventListener("click", async () => {
    if (audioElement.src === null || audioElement.src === undefined || audioElement.src === "") {
        console.error("No song uploaded.")
        errorPopup(1);
        return;
    }

    if (!audioState.audioPlaying) {
        await audioElement.play();
        audioState.audioPlaying = true;
        playButton.innerText = "Resume"
        audioGraph.gainNode.gain.setValueAtTime(volSlider.value / 100, audioContext.currentTime);
        loop();
    } else {
        audioElement.pause();
        audioState.audioPlaying = false;
        audioState.audioMute = false;
        playButton.innerText = "Play"
    }

});

muteButton?.addEventListener("click", async () => {
    if (audioGraph.gainNode === null) {
        console.error("No song uploaded.")
        errorPopup(2);
        return;
    }

    audioState.audioMute = !audioState.audioMute;

    if (audioState.audioMute) {
        audioState.lastVolumeValue = audioGraph.gainNode.gain.value;
        audioGraph.gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        muteButton.innerText = "unmute"
    } else {
        audioGraph.gainNode.gain.setValueAtTime(audioState.lastVolumeValue, audioContext.currentTime);
        muteButton.innerText = "mute"
    }

});

volSlider?.addEventListener("input", async (e) => {
    if (audioGraph.gainNode === null) {
        console.error("No song uploaded.")
        errorPopup(3);
        return;
    }

    // 0 <= volume <= 100 -> 0 <= volume <= 1
    const volume = e.target.value / 100;
    audioGraph.gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
    _rangeValueLabel.innerHTML = `Volume: ${e.target.value}%`
});