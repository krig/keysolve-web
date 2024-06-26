const themes = ["Synthwave", "Mono", "Tropics", "Playground", "Scuba", "Catppuccin", "12bit", "DR05", "Oceanic"]

export function init() {
    const selectTheme = document.getElementById('themes')

    for (let theme of themes) {
        let option = document.createElement('option')
        option.className = 'settings-text';
        option.value = theme;
        option.innerText = theme;

        selectTheme.appendChild(option)
    }

    selectTheme.addEventListener('change', setTheme)
}

async function setTheme(event) {
    const curr = document.getElementById('theme')
    curr.href = `themes/${event.target.value.toLowerCase()}.css`
}
