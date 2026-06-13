import { Simulator } from "./Simulator.js";
const sim = new Simulator('simCanvas');
sim.startLoop();
const magSlider = document.getElementById('magnitude');
const magVal = document.getElementById('mag-val');
const triggerBtn = document.getElementById('trigger-btn');
magSlider.addEventListener('input', (e) => {
    const target = e.target;
    magVal.textContent = parseFloat(target.value).toFixed(1);
});
triggerBtn.addEventListener('click', () => {
    const mag = parseFloat(magSlider.value);
    sim.triggerEarthquake(mag);
});
