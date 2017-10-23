import React from "react";
import Oscilloscope from "oscilloscope";

export default class Synth extends React.Component {
    constructor(props) {
        super(props);
        this.pitchStandard = 440;
        this.currentOctave = 0;
        this.pressedKey = 4;
        this.waves = {
            "sine":"Sine",
            "square": "Square",
            "sawtooth": "Sawtooth",
            "triangle": "Triangle"
        };

        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.VCO = this.audioContext.createOscillator();
        this.VCA = this.audioContext.createGain();
        this.analyzer = this.audioContext.createAnalyser();
        this.VCA.gain.value = 0;

        this.VCO.connect(this.VCA);
        this.VCA.connect(this.analyzer);
        this.analyzer.connect(this.audioContext.destination);
        this.scope = new Oscilloscope(this.analyzer);
        this.VCO.start();

        this.state = {
            currentPitch: this.getNoteFrequency(this.currentOctave, this.pressedKey),
            VCOType: "sine"
        };

        this.handleDown = this.handleDown.bind(this);
        this.handleUp = this.handleUp.bind(this);
        this.handleOctaveUp = this.handleOctaveUp.bind(this);
        this.handleOctaveDown = this.handleOctaveDown.bind(this);
    }
    componentDidMount() {
        this.canvas.width  = window.innerWidth;
        this.scope.animate(this.canvas.getContext("2d"));
    }
    getNoteFrequency(octave, key) {
        return 2**((octave *  12 + key - 49)/12) * this.pitchStandard;
    }
    handleDown() {
        this.VCO.frequency.value = this.state.currentPitch;
        this.VCO.type = this.state.VCOType;
        this.VCA.gain.value = 1;
    }
    handleUp() {
        this.VCA.gain.value = 0;
    }
    handleOctaveUp() {
        if (this.currentOctave < 10) {
            this.currentOctave++;
            this.setState({currentPitch: this.getNoteFrequency(this.currentOctave, this.pressedKey)})
        }
    }
    handleOctaveDown() {
        if (this.currentOctave > 0) {
            this.currentOctave--;
            this.setState({currentPitch: this.getNoteFrequency(this.currentOctave, this.pressedKey)})
        }
    }
    changeVCO(value) {
        console.log(value);
        this.setState({
            VCOType: value
        });
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
                <p>Current pitch - {this.state.currentPitch}</p>,
                <p>Current octave - {this.currentOctave}</p>,
                <div>{this.renderRadio()}</div>,
                <button onClick={this.handleOctaveUp}>+</button>,
                <button onClick={this.handleOctaveDown}>-</button>,
                <button onMouseDown={this.handleDown}
                        onMouseUp={this.handleUp}>Smack my pitch up!</button>,
                <canvas style={{display: "block", width: "100%"}} width="500" height="400" ref={canvas => this.canvas = canvas}/>
       ]
    }
}