import { Simulator } from "./Simulator.ts";

const sim = new Simulator('simCanvas');
sim.startLoop();

const magSlider = document.getElementById('magnitude') as HTMLInputElement;
const magVal = document.getElementById('mag-val') as HTMLSpanElement;
const triggerBtn = document.getElementById('trigger-btn') as HTMLButtonElement;

magSlider.addEventListener('input', (e: Event) => {
    const target = e.target as HTMLInputElement;
    magVal.textContent = parseFloat(target.value).toFixed(1);
});

triggerBtn.addEventListener('click', () => {
    const mag = parseFloat(magSlider.value);
    sim.triggerEarthquake(mag);
});