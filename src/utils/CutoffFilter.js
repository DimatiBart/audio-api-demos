export default class CutoffFilter {
    constructor(audioContext) {
        this.context = audioContext;
        this.filter = this.context.createBiquadFilter();
        this.filterTypes = ["lowpass", "highpass"];
        this.filter.type = this.filterTypes[0];
        this.filter.frequency = 5000;
    }
    getFilter() {
        return this.filter;
    }
    getFilterTypes() {
        return this.filterTypes;
    }
    setFilter(type) {
        this.filter.type = type;
    }
    setResonance(value) {
        this.filter.Q.value = value;
    }
    setFreq(value) {
        let minValue = 40;
        let maxValue = this.context.sampleRate / 2;
        // Logarithm (base 2) to compute how many octaves fall in the range.
        let numberOfOctaves = Math.log(maxValue / minValue) / Math.LN2;
        // Compute a multiplier from 0 to 1 based on an exponential scale.
        let multiplier = Math.pow(2, numberOfOctaves * (value.value - 1.0));
        // Get back to the frequency value between min and max.
        this.filter.frequency.value = maxValue * multiplier;
    }
}