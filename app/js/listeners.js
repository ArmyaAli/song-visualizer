import { htmlInput, playButton, muteButton, volSlider, audioContext, audioElement, audioGraph, audioState, visualisationDropdown, Visualisation } from './state.js'
import { loop } from './main.js'

visualisationDropdown.addEventListener('change', () => Visualisation.CURRENT_VISULIZATION = visualisationDropdown.selectedOptions[0]?.text )
htmlInput?.addEventListener("change", (data) => {
    const blob = data.target.files[0];
    const audioSrc = URL.createObjectURL(blob);
    audioElement.src = audioSrc;

    // Required as context will stat on in "Suspend state"
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
});


playButton?.addEventListener("click", async () => {
    if (audioElement === null) return;
    if (!audioState.audioPlaying) {
        await audioElement.play();
        audioState.audioPlaying = true;
        playButton.innerText = "Resume"
        audioGraph.gainNode.gain.setValueAtTime(volSlider.value / 100, audioContext.currentTime);
        loop();
    } else {
        audioElement.pause();
        audioState.audioPlaying = false;
        playButton.innerText = "Play"
    }

});

muteButton?.addEventListener("click", async () => {
    if (audioGraph.gainNode === null) {
        console.error("No song uploaded.")
        return;
    }

    audioState.audioMute = !audioState.audioMute;

    if (audioState.audioMute) {
        muteButton.innerText = "unmute"
        audioGraph.gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    } else {
        muteButton.innerText = "mute"
        audioGraph.gainNode.gain.setValueAtTime(1, audioContext.currentTime);
    }

});

volSlider?.addEventListener("input", async (e) => {
    if (audioGraph.gainNode === null) {
        console.error("No song uploaded.")
        return;
    }

    // 0 <= volume <= 100 -> 0 <= volume <= 1
    const volume = e.target.value / 100;
    audioGraph.gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
});