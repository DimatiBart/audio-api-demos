import React from "react";
import Oscilloscope from "oscilloscope";
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
        this.analyzer = this.audioContext.createAnalyser();
        this.VCA.gain.value = 0;

        this.VCO.connect(this.VCA);
        this.VCO.start();

        this.VCA.connect(this.analyzer);
        this.analyzer.connect(this.audioContext.destination);
        this.scope = new Oscilloscope(this.analyzer);

        this.synthState = {
            currentPitch: 0,
            latestPressedKey: 0,
            pressedKeys: [],
            attackEnd: 0
        };

        this.state = {
            VCOType: "sine",
            release: 0,
            attack: 0
        };

        this.onKeyPress = this.onKeyPress.bind(this);
        this.changeFrequency = this.changeFrequency.bind(this);
        this.changeRelease = this.changeRelease.bind(this);
        this.changeAttack = this.changeAttack.bind(this);

        this.midiController = new MidiController(this.onKeyPress);
    }
    componentDidMount() {
        this.midiController.connect();
        this.canvas.width  = window.innerWidth;
        this.scope.animate(this.canvas.getContext("2d"));
    }
    getNoteFrequency(key) {
        return 2**((key - 69)/12) * this.pitchStandard;
    }
    playNote() {
        let now = this.audioContext.currentTime;
        this.VCO.type = this.state.VCOType;
        //this.VCA.gain.cancelScheduledValues(now);
        //this.VCA.gain.setValueAtTime(0, now);
        this.VCO.frequency.value = this.synthState.currentPitch;
        this.VCO.frequency.setValueAtTime(this.synthState.currentPitch, now);
        this.VCA.gain.linearRampToValueAtTime(1, now + this.state.attack);
        this.synthState.attackEnd = new Date().getTime() + this.state.attack * 1000;
        //this.VCA.gain.value = 1;
    }
    continueNote() {
        let now = this.audioContext.currentTime;
        //this.VCO.frequency.cancelScheduledValues(now);
        //this.VCO.frequency.linearRampToValueAtTime(this.synthState.currentPitch, now);
        this.VCO.frequency.value = this.synthState.currentPitch
    }
    releaseNote() {
        let now = this.audioContext.currentTime,
            timeDifference = this.synthState.attackEnd - new Date().getTime() + this.state.attack * 1000;
        if (timeDifference < 0) {
            this.VCA.gain.cancelScheduledValues(now);
            this.VCA.gain.linearRampToValueAtTime(0, now + this.state.release);
        }
        else {
            setTimeout(this.releaseNote.bind(this), timeDifference);
        }

        //this.VCA.gain.value = 0;

        //this.VCA.gain.exponentialRampToValueAtTime(0.0001, now + this.state.release);
    }
    onKeyPress(event) {
        let pressedKey = event.data[1];

        if (event.data[0] === 128 || event.data[2] === 0) {
            let index = this.synthState.pressedKeys.indexOf(pressedKey);
            let releasedKey = this.synthState.pressedKeys.splice(index, 1)[0];

            if (!this.synthState.pressedKeys.length) {
                this.releaseNote();
            }
            else if (releasedKey === this.synthState.latestPressedKey) {
                this.synthState.currentPitch = this.getNoteFrequency(this.synthState.pressedKeys[this.synthState.pressedKeys.length - 1]);
                this.continueNote();
            }
        }
        else {
            this.synthState.latestPressedKey = pressedKey;
            this.synthState.pressedKeys.push(pressedKey);
            this.synthState.currentPitch = this.getNoteFrequency(pressedKey);
            this.playNote();
        }
    }
    changeFrequency(event) {
        if (this.VCA.gain.value !== 0) {
            this.VCA.gain.value = event.target.value * this.synthState.currentPitch;
        }
    }
    changeVCO(value) {
        this.setState({VCOType: value});
    }
    changeRelease(e) {
        this.setState({release: + e.target.value});
    }
    changeAttack(e) {
        this.setState({attack: + e.target.value});
    }
    renderPanel(){
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
                <div>
                    <span>Attack</span><input type="range" value={this.state.attack} min="0" max="1" step="0.01" onChange={this.changeAttack}/>
                </div>
                <div>
                    <span>Release</span><input type="range" value={this.state.release} min="0" max="1" step="0.01" onChange={this.changeRelease}/>
                </div>
            </div>
        )
    }
    render() {
        return <div>
            {this.renderPanel()}
            <canvas style={{display: "block", width: "100%"}} width="500" height="400" ref={canvas => this.canvas = canvas}/>
        </div>
    }
}