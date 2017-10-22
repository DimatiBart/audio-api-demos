import React from "react";

export default class DistortionFilter extends React.Component {
    constructor(props) {
        super(props);
        this.distortion = this.props.audioContext.createWaveShaper();

        this.state = {
            distortion: 0,
            enabled: false
        };

        this.toggleFilter = this.toggleFilter.bind(this);
    }
    toggleFilter() {
        let isEnabled = !this.state.enabled;
        this.props.onToggle(this.distortion, isEnabled, "distortion");
        this.setState({enabled : isEnabled});
    }
    changeDistortion(value) {
        let amount = this.makeDistortionCurve(value * 50);
        this.distortion.curve = amount;
        this.setState({distortion: value});
    }
    makeDistortionCurve(amount) {
        var k = typeof amount === 'number' ? amount : 0,
            n_samples = 44100,
            curve = new Float32Array(n_samples),
            deg = Math.PI / 180,
            i = 0,
            x;
        for ( ; i < n_samples; ++i ) {
            x = i * 2 / n_samples - 1;
            curve[i] = ( 3 + k ) * x * 20 * deg / ( Math.PI + k * Math.abs(x) );
        }
        return curve;
    };
    render() {
        return (
            <div>
                <span>Distortion</span>
                <input type="checkbox" checked={this.state.enabled} onChange={this.toggleFilter}/>
                <input min="0" step="1" value={this.state.distortion} max="100" onChange={e => this.changeDistortion(+ e.currentTarget.value)} type="range"/>
            </div>
        )
    }
}