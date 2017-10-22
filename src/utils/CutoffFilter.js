export default class CutoffFilter {
    constructor(audioContext) {
        this.context = audioContext;
        this.node = this.context.createBiquadFilter();
        this.filterTypes = ["lowpass", "highpass"];
        this.node.type = this.filterTypes[0];
        this.node.frequency.value = 5000;
    }
    getNode() {
        return this.node;
    }
    getFilterTypes() {
        return this.filterTypes;
    }
    setFilter(type) {
        this.node.type = type;
    }
    setResonance(value) {
        let QUAL_MUL = 30; //???
        this.node.Q.value = value * QUAL_MUL;
    }
    setFreq(value) {
        let minValue = 40;
        let maxValue = this.context.sampleRate / 2;
        // Logarithm (base 2) to compute how many octaves fall in the range.
        let numberOfOctaves = Math.log(maxValue / minValue) / Math.LN2;
        // Compute a multiplier from 0 to 1 based on an exponential scale.
        let multiplier = Math.pow(2, numberOfOctaves * (value - 1.0));
        // Get back to the frequency value between min and max.
        this.node.frequency.value = maxValue * multiplier;
    }
}