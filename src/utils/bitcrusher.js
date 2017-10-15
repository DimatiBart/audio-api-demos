//It works by quantizing the input signal. In other words, it samples the input signal every so often, then “holds” that sample until it’s time to sample again (based on the bits and normfreq settings).
export default class Bitcrusher {
    constructor(audioContext, bits, normfreq) {
        this.bufferSize = 4096;
        this.node = audioContext.createScriptProcessor(this.bufferSize, 1, 1);
        this.node.bits = bits; // between 1 and 16
        this.node.normfreq = normfreq; // between 0.0 and 1.0
        this.phaser = 0;
        this.initFilter()
    }
    initFilter() {
        this.node.onaudioprocess = (e) => {
            let input = e.inputBuffer.getChannelData(0),
                output = e.outputBuffer.getChannelData(0),
                step = Math.pow(1/2, this.node.bits),
                last = 0;
            for (let i = 0; i < this.bufferSize; i++) {
                this.phaser += this.node.normfreq;
                if (this.phaser >= 1.0) {
                    this.phaser -= 1.0;
                    last = step * Math.floor(input[i] / step + 0.5);
                }
                output[i] = last;
            }
        };
    }
    getNode() {
        return this.node;
    }
    changeBits(value) {
        this.node.bits = value;
    }
    changeFreq(value) {
        this.node.normfreq = value;
    }
}