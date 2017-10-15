import React from "react";
import Cutoff from "../../utils/CutoffFilter";

export default class CutoffFilter extends React.Component {
    constructor(props) {
        super(props);
        this.bits = 16;
        this.normfreq = 1;
        this.cutoffFilter = new Cutoff(this.props.audioContext);
        this.state = {
            enabled: false
        };

        this.handleSwitch = this.handleSwitch.bind(this);
    }
    componentDidMount() {
        let node = this.bitcrusher.getFilter();
        this.props.origin.connect(node);
        node.connect(this.props.destination)
    }
    toggleFilter() {
        if (this.state.enabled) {

        }
        else {

        }
    }
    componentDidUpdate() {

    }
    handleSwitch(event) {
        this.setState({enabled : !this.state.enabled});
    }
    render() {
        return (
            <div>
                <input type="checkbox" checked={this.state.enabled} onChange={this.handleSwitch}/>
                <input min="1" step="0.5" max="16" onChange={e => this.cutoffFilter.setFreq(e.currentTarget.value)} type="range"/>
                <input min="1" step="0.5" max="16" onChange={e => this.changeBits(e.currentTarget.value)} type="range"/>
            </div>
        )
    }
}