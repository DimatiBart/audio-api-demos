export default class MidiController {
    constructor(onKeyPress) {
        this.midi = null;
        this.inputs = null;
        this.onKeyPress = onKeyPress;
    }
    connect() {
        if (navigator.requestMIDIAccess) {
            navigator.requestMIDIAccess()
                .then(
                    (midi) => this.initMIDI(midi),
                    () => console.log("sorry, no MIDI for you :c")
                )
        }
    }
    initMIDI(midi) {
        this.midi = midi;
        console.log(this.midi);
        this.inputs = this.midi.inputs.values();

        for (let input = this.inputs.next(); input && !input.done; input = this.inputs.next()) {
            // each time there is a midi message call the onMIDIMessage function
            input.value.onmidimessage = this.onKeyPress;
        }
    }
}