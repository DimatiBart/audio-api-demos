import React from "react";

export default class DelayFilter extends React.Component {
    constructor(props) {
        super(props);
        this.delayFilter = this.props.audioContext.createDelay();
        this.feedback = this.props.audioContext.createGain();
        this.filter = this.props.audioContext.createBiquadFilter();

        this.feedback.gain.value = 0.08;
        this.filter.frequency.value = 0;
        this.delayFilter.delayTime.value = 0;

        this.state = {
            delay: 0,
            feedback: 0.08,
            frequency: 0,
            enabled: false
        };

        this.toggleFilter = this.toggleFilter.bind(this);
    }
    toggleFilter() {
        let isEnabled = !this.state.enabled;
        this.props.onToggle(this.delayFilter, isEnabled, "delay", () => this.connectToNeightbours());

        if (isEnabled) {
            this.delayFilter.connect(this.feedback);
            this.feedback.connect(this.filter);
            this.filter.connect(this.delayFilter);
        }
        else {
            this.feedback.disconnect();
            this.filter.disconnect();
        }

        this.setState({enabled : isEnabled});
    }
    connectToNeightbours(){
        this.delayFilter.connect(this.feedback);
        this.feedback.connect(this.filter);
        this.filter.connect(this.delayFilter);
    }
    changeDelay(value) {
        this.delayFilter.delayTime.value = value;
        this.setState({delay:value});
    }
    changeFilter(value) {
        this.filter.frequency.value = value;
        this.setState({frequency:value});
    }
    changeFeedback(value) {
        this.feedback.gain.value = value;
        this.setState({feedback:value});
    }
    render() {
        return (
            <div>
                <span>Delay</span>
                <input type="checkbox" checked={this.state.enabled} onChange={this.toggleFilter}/>
                <div>
                    <span>Delay time </span>
                    <input min="0" step="0.01" value={this.state.delay} max="1" onChange={e => this.changeDelay(+ e.currentTarget.value)} type="range"/>
                </div>
                <div>
                    <span>Feedback time</span>
                    <input min="0" step="0.05" value={this.state.feedback} max="1" onChange={e => this.changeFeedback(+ e.currentTarget.value)} type="range"/>
                </div>
                <div>
                    <span>Filter frequency</span>
                    <input min="0" step="100" value={this.state.frequency} max="4000" onChange={e => this.changeFilter(+ e.currentTarget.value)} type="range"/>
                </div>
            </div>
        )
    }
}