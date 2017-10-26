import React from "react";
import {render} from "react-dom";

import SimpleSynth from "./components/Simple-Synth/index.jsx";
import MidiSynth from "./components/Midi-Synth/index.jsx";
import FilteredSynth from "./components/Filtered-Synth/index.jsx";
import ARSynth from "./components/ARSynth/index.jsx";

let app = document.getElementById("app");

switch (app.className) {
    case "S":
        render(<SimpleSynth/>, app);
        break;
    case "M":
        render(<MidiSynth/>, app);
        break;
    case "AR":
        render(<ARSynth/>, app);
        break;
    case "F":
        render(<FilteredSynth/>, app);
        break;
}