import { audioState, Visualisation, m__FPS } from './state.js'
import './listeners.js'
import { dispatchMap } from './constants.js';


// Canvas loop
export const loop = () => {
    // debugger;
    if (!audioState.audioPlaying) return;

    window.requestAnimationFrame(loop);

    m__FPS.now = performance.now();
    m__FPS.elapsed = (m__FPS.now - m__FPS.then);
    
    if (m__FPS.elapsed > m__FPS.interval) {
        m__FPS.then = m__FPS.now - (m__FPS.elapsed % m__FPS.interval);
        dispatchMap[Visualisation.CURRENT_VISULIZATION](); 
    }
}