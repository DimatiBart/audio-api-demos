import React from "react";
import {render} from "react-dom";

import SimpleSynth from "./components/Simple-Synth/index.jsx";
import MidiSynth from "./components/Midi-Synth/index.jsx";

render(<SimpleSynth/>, document.getElementById("app"));
render(<MidiSynth/>, document.getElementById("app"));