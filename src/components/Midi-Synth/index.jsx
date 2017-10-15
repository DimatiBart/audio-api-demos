import React from "react";
import MidiController from "../../controllers/MidiController";

export default class Synth extends React.Component {
    constructor(props) {
        super(props);
        this.pitchStandard = 440;
        this.waves = {
            "sine":"Sine",
            "square": "Square",
            "sawtooth": "Sawtooth",
            "triangle": "Triangle"
        };

        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.VCO = this.audioContext.createOscillator();
        this.VCA = this.audioContext.createGain();
        this.VCA.gain.value = 0;

        this.VCO.connect(this.VCA);
        this.VCA.connect(this.audioContext.destination);
        this.VCO.start();

        this.synthState = {
            currentPitch: 0,
            latestPressedKey: 0,
            pressedKeys: []
        };

        this.state = {
            VCOType: "sine"
        };

        this.onKeyPress = this.onKeyPress.bind(this);

        this.midiController = new MidiController(this.onKeyPress);
    }
    componentDidMount() {
        this.midiController.connect();
    }
    getNoteFrequency(key) {
        return 2**((key - 69)/12) * this.pitchStandard;
    }
    playNote() {
        this.VCO.frequency.value = this.synthState.currentPitch;
        this.VCO.type = this.state.VCOType;
        this.VCA.gain.value = 1;
    }
    releaseNote() {
        this.VCA.gain.value = 0;
    }
    onKeyPress(event) {
        console.log(event);
        let pressedKey = event.data[1];

        if (event.data[0] === 128 || event.data[2] === 0) {
            let index = this.synthState.pressedKeys.indexOf(pressedKey);
            let releasedKey = this.synthState.pressedKeys.splice(index, 1)[0];

            if (!this.synthState.pressedKeys.length) {
                this.releaseNote();
            }
            else if (releasedKey === this.synthState.latestPressedKey) {
                this.synthState.currentPitch = this.getNoteFrequency(this.synthState.pressedKeys[this.synthState.pressedKeys.length - 1]);
                this.playNote();
            }
        }
        else {
            this.synthState.latestPressedKey = pressedKey;
            this.synthState.pressedKeys.push(pressedKey);
            this.synthState.currentPitch = this.getNoteFrequency(pressedKey);
            this.playNote();
        }
    }
    changeVCO(value) {
        this.setState({VCOType: value});
    }
    renderRadio(){
        return (
            <div>
                {Object.keys(this.waves).map(elem => (
                    <div>
                        <input type="radio"
                               name="wave" value={elem}
                               id={elem}
                               checked={this.state.VCOType === elem}
                               onChange={(e) => this.changeVCO(e.currentTarget.value)}/>
                        <label htmlFor={elem}>{this.waves[elem]}</label>
                    </div>
                ))}
            </div>
        )
    }
    render() {
        return [
            <div>{this.renderRadio()}</div>,
        ]
    }
}