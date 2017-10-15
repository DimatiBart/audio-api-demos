import React from "react";
import Bitcrusher from "../Bitcrusher/index.jsx";

export default class Filters extends React.Component {
    constructor(props) {
        super(props);
        this.origin = this.props.origin;
        this.destination = this.props.destination;
        this.audioContext = this.props.audioContext;
    }

    render() {
        return (
            <div>
                <Bitcrusher audioContext={this.audioContext} origin={this.origin} destination={this.destination}/>
            </div>
        )
    }
}