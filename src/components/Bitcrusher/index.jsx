import React from "react";
import Bitcrush from "../../utils/bitcrusher";

export default class Bitcrusher extends React.Component {
    constructor(props) {
        super(props);
        this.bits = 16;
        this.normfreq = 1;
        this.bitcrusher = new Bitcrush(this.props.audioContext, this.bits, this.normfreq);
        this.state = {
            enabled: false
        }

        this.handleSwitch = this.handleSwitch.bind(this);
    }
    componentDidMount() {
        let node = this.bitcrusher.getNode();
        this.props.origin.connect(node);
        node.connect(this.props.destination)
        //this.props.origin.connect(this.props.destination);
    }
    changeBits(value) {
        this.bits = value;
        this.bitcrusher.changeBits(this.bits);
    }
    changeFreq(value) {
        this.normfreq = value;
        this.bitcrusher.changeFreq(this.normfreq);
    }
    handleSwitch(event) {
        this.setState({enabled : !this.state.enabled});
    }
    render() {
        return (
            <div>
                <input type="checkbox" checked={this.state.enabled} onChange={this.handleSwitch}/>
                <input min="1" step="0.5" max="16" onChange={e => this.changeBits(e.currentTarget.value)} type="range"/>
            </div>
        )
    }
}