const { Factory, EasyScore, System } = Vex.Flow

const $scoreBoard = document.getElementById('scoreBoard')
const $sheetFigure = document.getElementById('sheetFigure')
const $options = document.getElementById('options')
const $trebleClefOption = document.getElementById('trebleClefOption')
const $bassClefOption = document.getElementById('bassClefOption')
const $chooseGameMode = document.getElementById('chooseGameMode')

const notesTreble = ['G3','A3','B3','C4','D4','E4','F4','G4','A4','B4','C5','D5','E5','F5','G5','A5','B5']
const notesBass = ['A3','B3','C4','D4','E4','F4','G4','A4','B4','C5','D5','E5','F5','G5','A5','B5']
const options = []
let currentNote
let green = 0
let red = 0
let notes
let currentClef

$trebleClefOption.addEventListener('mousedown', () => {
    currentClef = 'treble'
    start()
    closeGamemodeChoose()
})
$bassClefOption.addEventListener('mousedown', () => {
    currentClef = 'bass'
    start()
    closeGamemodeChoose()
})

function start(){
    renderScore()
    notes = currentClef == 'treble' ? notesTreble : notesBass
    const note = notes[getRandomIntInclusive(0,notes.length - 1)]
    drawNote(note)

    currentNote = note.substring(0,1)
    options.push(currentNote)

    for(var i=0; i<5; i++){
        options.push(getRandomNote())
    }

    const shuffledOptions = shuffleArray(options)

    for(o of shuffledOptions){
        $options.appendChild(createButton(o,parseNoteName(o)))
    }
}

function closeGamemodeChoose(){
    $chooseGameMode.style.display = 'none'
}

function drawNote(note){
    $sheetFigure.innerHTML = ''

    const vf = new Factory({
        renderer: { elementId: 'sheetFigure', width: 100, height: 150 }
    })
    
    const score = vf.EasyScore()
    const system = vf.System()
    
    if(currentClef == 'treble'){
        system.addStave({
            voices: [
                score.voice(score.notes(`${note}/w`, { stem: 'up' })),
            ]
        }).addClef('treble').addTimeSignature('4/4')
    }else{
        system.addStave({
            voices: [
                score.voice(score.notes(`${note}/w`, { stem: 'up' })),
            ]
        }).addClef('bass').addTimeSignature('4/4')
    }
    
    vf.draw()
}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function getRandomNote(){
    let note = notes[getRandomIntInclusive(0,notes.length - 1)].substring(0,1)
    while(options.indexOf(note) != -1){
        note = notes[getRandomIntInclusive(0,notes.length - 1)].substring(0,1)
    }
    return note
}

function shuffleArray(array){
    const newArray = []
    let number = Math.floor(Math.random() * array.length)
    let count = 1
    newArray.push(array[number])

    while (count < array.length) {
        const newNumber = Math.floor(Math.random() * array.length)
        if (!newArray.includes(array[newNumber])) {
            count++
            number = newNumber
            newArray.push(array[number])
        }
    }
    return newArray
}

function createButton(id,inner){
    const $div = document.createElement('div')
    $div.classList.add('buttonShield')

    const $el = document.createElement('button')
    $el.innerHTML = inner
    $el.setAttribute('id',id)
    $el.classList.add('option')
    $div.appendChild($el)

    $el.addEventListener('mousedown', (ev) => {
        select(ev.target.id)
    })

    return $div
}

function select(id){
    if(id == currentNote){
        green++
    }else{
        red++
    }
    clearOptions()
    start()
}

function renderScore(){
    const gS = $scoreBoard.getElementsByClassName('green')[0]
    const rS = $scoreBoard.getElementsByClassName('red')[0]

    gS.innerHTML = green
    rS.innerHTML = red
}

function clearOptions(){
    while(options.length > 0){
        options.pop()
    }
    $options.innerHTML = ''
}

function parseNoteName(note){
    const dictionary = {
        A: currentClef == 'treble' ? 'Lá' : 'Dó',
        B: currentClef == 'treble' ? 'Si' : 'Ré',
        C: currentClef == 'treble' ? 'Dó' : 'Mi',
        D: currentClef == 'treble' ? 'Ré' : 'Fá',
        E: currentClef == 'treble' ? 'Mi' : 'Sol',
        F: currentClef == 'treble' ? 'Fá' : 'Lá',
        G: currentClef == 'treble' ? 'Sol' : 'Si'
    }

    return dictionary[note]
}