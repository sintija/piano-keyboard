const audioContext = new AudioContext();

const NOTE_DETAILS = [
    { note: "C", key: "Z", frequency: 261.626, active: false },
    { note: "Db", key: "S", frequency: 277.183, active: false },
    { note: "D", key: "X", frequency: 293.665, active: false },
    { note: "Eb", key: "D", frequency: 311.127, active: false },
    { note: "E", key: "C", frequency: 329.628, active: false },
    { note: "F", key: "V", frequency: 349.228, active: false },
    { note: "Gb", key: "G", frequency: 369.994, active: false },
    { note: "G", key: "B", frequency: 391.995, active: false },
    { note: "Ab", key: "H", frequency: 415.305, active: false },
    { note: "A", key: "N", frequency: 440, active: false },
    { note: "Bb", key: "J", frequency: 466.164, active: false },
    { note: "B", key: "M", frequency: 493.883, active: false }
]


document.addEventListener('keydown', e => {
    if (e.repeat == true) return
    const keyboardKey = e.code
    const noteDetail = getNoteDetail(keyboardKey)
    if (noteDetail == null) return
    //Actions below if we have a note 
    noteDetail.active = true
    playNotes()
})

document.addEventListener('keyup', e => {
    const keyboardKey = e.code
    const noteDetail = getNoteDetail(keyboardKey)

    if (noteDetail == null) return
    //Actions below if we have a note 
    noteDetail.active = false
    playNotes()
})

//getting individual note on the key we press
function getNoteDetail(keyboardKey) {
    return NOTE_DETAILS.find(n => `Key${n.key}` === keyboardKey)

}

function playNotes() {
    NOTE_DETAILS.forEach(n => {
        const keyElement = document.querySelector(`[data-note="${n.note}"]`)
        keyElement.classList.toggle("active", n.active)
        //Check if note has an oscillator
        if (n.oscilator != null) {
            n.oscilator.stop()
            n.oscilator.disconnect()
        }
    })

    const activeNotes = NOTE_DETAILS.filter(n => n.active)
    const gain = 1 / activeNotes.length
    activeNotes.forEach(n => {
        startNote(n, gain)
    })
}

function startNote(noteDetail, gain) {
    const gainNode = audioContext.createGain()
    gainNode.gain.value = gain
    const oscilator = audioContext.createOscillator()
    oscilator.frequency.value = noteDetail.frequency
    oscilator.type = 'sine'
    oscilator.connect(gainNode).connect(audioContext.destination)
    oscilator.start()
    //Stop playing the notes
    noteDetail.oscilator = oscilator
}