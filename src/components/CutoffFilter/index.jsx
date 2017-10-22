import React from "react";
import Cutoff from "../../utils/CutoffFilter";

export default class CutoffFilter extends React.Component {
    constructor(props) {
        super(props);
        this.bits = 16;
        this.normfreq = 1;
        this.cutoffFilter = new Cutoff(this.props.audioContext);
        this.node = this.cutoffFilter.getNode();
        this.state = {
            enabled: false
        };

        this.toggleFilter = this.toggleFilter.bind(this);
    }
    toggleFilter() {
        let isEnabled = !this.state.enabled;
        this.props.onToggle(this.node, isEnabled, "cutoff");
        this.setState({enabled : isEnabled});
    }
    render() {
        return (
            <div>
                <span>CutoffFilter</span>
                <input type="checkbox" checked={this.state.enabled} onChange={this.toggleFilter}/>
                <input min="0" step="0.01" max="1" onChange={e => this.cutoffFilter.setFreq(+ e.currentTarget.value)} type="range"/>
                <input min="0" step="0.01" max="1" onChange={e => this.cutoffFilter.setResonance(+ e.currentTarget.value)} type="range"/>
            </div>
        )
    }
}