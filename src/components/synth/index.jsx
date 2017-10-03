import React from "react";

export default class Synth extends React.Component {
    constructor(props) {
        super(props);
        this.pitchStandard = 440;
        this.currentOctave = 0;
        this.pressedNote = null;
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.VCO = this.audioContext.createOscillator();
        this.VCA = this.audioContext.createGain();
        this.VCA.gain.value = 0;

        this.VCO.connect(this.VCA);
        this.VCA.connect(this.audioContext.destination);
        this.VCO.start();

        this.handleDown = this.handleDown.bind(this);
        this.handleUp = this.handleUp.bind(this);
    }
    handleDown() {
        this.VCA.gain.value = 1;
    }
    handleUp() {
        this.VCA.gain.value = 0;
    }
    render() {
        return (
            <button onMouseDown={this.handleDown}
                    onMouseUp={this.handleUp}>Smack my bitch up!</button>
        )
    }
}