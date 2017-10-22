import React from "react";
import Bitcrush from "../../utils/bitcrusher";

export default class Bitcrusher extends React.Component {
    constructor(props) {
        super(props);
        this.bits = 16;
        this.normfreq = 1;
        this.bitcrusher = new Bitcrush(this.props.audioContext, this.bits, this.normfreq);
        this.node = this.bitcrusher.getNode();
        this.state = {
            enabled: false
        };

        this.toggleFilter = this.toggleFilter.bind(this);
    }
    changeBits(value) {
        this.bits = value;
        this.bitcrusher.changeBits(this.bits);
    }
    changeFreq(value) {
        this.normfreq = value;
        this.bitcrusher.changeFreq(this.normfreq);
    }
    toggleFilter(event) {
        let isEnabled = !this.state.enabled;
        this.props.onToggle(this.node, isEnabled, "bitcrusher");
        this.setState({enabled : isEnabled});
    }
    render() {
        return (
            <div>
                <span>Bitcrusher</span>
                <input type="checkbox" checked={this.state.enabled} onChange={this.toggleFilter}/>
                <input min="1" step="0.5" max="16" onChange={e => this.changeBits(e.currentTarget.value)} type="range"/>
            </div>
        )
    }
}