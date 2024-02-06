import * as search from './search.mjs'
import * as drag from './drag.mjs'
import * as board from './board.mjs'
import * as disable from './disable.mjs'
import * as stats from './stats.mjs'
import * as settings from './settings.mjs'
import * as themes from './themes.mjs'

let base = {}

function open_info() {
    const url = 'https://github.com/ClemenPine/keysolve-web'
    window.open(url, '_blank')
}

function update_stats() {
    const res = stats.analyze()
    if (res === null) {
        setTimeout(() => update_stats(), 200);
        return;
    }

    for (const [stat, freq] of Object.entries(res)) {
        const cell = document.getElementById(stat)
        const perc = freq.toLocaleString(
            undefined, { style: 'percent', minimumFractionDigits:2 }
        )

        if (!(stat in base)) {
            continue
        }

        let color = ''
        for (let i=0; i < 5; i++) {
            if (freq > base[stat][i]) {
                color = `var(--color-${4-i})`
            }
        }

        cell.innerHTML = `${stat}: ${perc}`
        cell.style.background = color
    } 
}

function mirror() {
    const grid = document.getElementById('grid')
    const keys = grid.children

    let letters = []
    for (const key of keys) {
        letters.push(key.innerHTML)
    }

    letters = letters.slice(0, 30)

    for (let row=0; row < 3; row++) {
        for (let col=0; col < 10; col++) {
            const key = keys[(2-row)*10 + col]
            const letter = letters.pop()

            key.className = `cell center ${letter}`
            key.innerHTML = letter
        }
    }

    update_stats()
}

function invert() {
    const grid = document.getElementById('grid')
    const keys = grid.children

    let letters = []
    for (const key of keys) {
        letters.push(key.innerHTML)
    }

    letters = letters.slice(0, 30)

    for (let row=0; row < 3; row++) {
        for (let col=0; col < 10; col++) {
            const key = keys[(2-row)*10 + col]
            const letter = letters.shift()

            key.className = `cell center ${letter}`
            key.innerHTML = letter
        }
    }

    update_stats()
}

function copy_layout() {
    const matrix = document.getElementById('matrix')
    navigator.clipboard.writeText(matrix.value)
}

function open_settings() {
    settings.open()
}

function toggle_board() {
    switch (board.board) {
        case 'stagger':
            board.ortho()
            break
        case 'ortho':
            board.stagger()
            break
        }
}

function toggle_heatmap() {
    const repeatmap = document.getElementById('repeatmap')

    if (repeatmap.disabled) {
        repeatmap.removeAttribute('disabled')
    } else {
        repeatmap.setAttribute('disabled', '')
    }
}

window.info = open_info;
window.stats = update_stats;
window.mirror = mirror;
window.invert = invert;
window.copy = copy_layout;
window.settings = open_settings;
window.board = toggle_board;
window.heatmap = toggle_heatmap;


addEventListener("load", async () => {
    search.init()
    drag.init()
    disable.init()
    stats.init()
    settings.init()
    themes.init()

    board.ortho()

    base = await (await fetch('percentiles.json')).json()

    setTimeout(() => { search.update(); }, 400);
});

