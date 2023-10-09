import { audioState, Visualisation, _DS_Fps, _DS_DispatchMap } from './state.js'
import './listeners.js'


// Canvas loop
export const loop = () => {
    // debugger;
    if (!audioState.audioPlaying) return;

    window.requestAnimationFrame(loop);

    _DS_Fps.now = performance.now();
    _DS_Fps.elapsed = (_DS_Fps.now - _DS_Fps.then);
    
    if (_DS_Fps.elapsed > _DS_Fps.interval) {
        _DS_Fps.then = _DS_Fps.now - (_DS_Fps.elapsed % _DS_Fps.interval);
        _DS_DispatchMap[Visualisation.CURRENT_VISULIZATION](); 
    }
}