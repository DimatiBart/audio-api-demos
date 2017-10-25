import React from "react";
import Bitcrusher from "../Bitcrusher/index.jsx";
import CutoffFilter from "../CutoffFilter/index.jsx";
import DelayFilter from "../Delay/index.jsx";
import DistortionFilter from "../Distortion/index.jsx";

export default class Filters extends React.Component {
    constructor(props) {
        super(props);
        this.origin = this.props.origin;
        this.destination = this.props.destination;
        this.audioContext = this.props.audioContext;
        this.originNodes = [{node: this.origin, type: "gain"}];
        this.onFilterToggle = this.onFilterToggle.bind(this);
    }
    onFilterToggle(node, isEnabled, type, disconnectCallBack) {
        let lastOriginIndex = this.originNodes.length - 1;
        if (isEnabled) {
            this.originNodes[lastOriginIndex].node.disconnect();
            this.originNodes[lastOriginIndex].node.connect(node);
            node.connect(this.props.destination);

            if (this.originNodes[lastOriginIndex].type === "delay") {
                this.originNodes[lastOriginIndex - 1].node.disconnect();
                this.originNodes[lastOriginIndex].disconnectCallBack();
                this.originNodes[lastOriginIndex - 1].node.connect(node);
                this.originNodes[lastOriginIndex - 1].node.connect(this.originNodes[lastOriginIndex].node);
            }

            this.originNodes.push({node, type, disconnectCallBack});

            if (type === "delay") {
                this.originNodes[lastOriginIndex].node.connect(this.props.destination);
            }
        }
        else {
            let nodeOriginIndex = -1;

            this.originNodes.forEach((elem, index) => {
                if (elem.type === type) {
                    nodeOriginIndex = index;
                }
            });

            let destination = this.originNodes[nodeOriginIndex + 1] ? this.originNodes[nodeOriginIndex + 1].node : this.props.destination;

            this.originNodes[nodeOriginIndex - 1].node.disconnect();
            node.disconnect();

            if (this.originNodes[nodeOriginIndex - 1].type === "delay") {
                this.originNodes[nodeOriginIndex - 1].disconnectCallBack();
                this.originNodes[nodeOriginIndex - 2].node.disconnect();
                this.originNodes[nodeOriginIndex - 2].node.connect(destination);
                this.originNodes[nodeOriginIndex - 2].node.connect(this.originNodes[lastOriginIndex - 1].node);
            }

            this.originNodes[nodeOriginIndex - 1].node.connect(destination);

            this.originNodes.splice(nodeOriginIndex, 1);
        }
    }
    render() {
        return (
            <div>
                <Bitcrusher onToggle={this.onFilterToggle} audioContext={this.audioContext}/>
                <CutoffFilter onToggle={this.onFilterToggle} audioContext={this.audioContext}/>
                <DelayFilter onToggle={this.onFilterToggle} audioContext={this.audioContext}/>
                <DistortionFilter onToggle={this.onFilterToggle} audioContext={this.audioContext}/>
            </div>
        )
    }
}