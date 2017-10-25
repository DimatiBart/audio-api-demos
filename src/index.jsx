import React from "react";
import {render} from "react-dom";

import SimpleSynth from "./components/Simple-Synth/index.jsx";
import MidiSynth from "./components/Midi-Synth/index.jsx";
import FilteredSynth from "./components/Filtered-Synth/index.jsx";
import ARSynth from "./components/ARSynth/index.jsx";

//render(<SimpleSynth/>, document.getElementById("app"));
//render(<MidiSynth/>, document.getElementById("app"));
render(<FilteredSynth/>, document.getElementById("app"));
//render(<ARSynth/>, document.getElementById("app"));