export function setupMatchRow(matchRow: HTMLElement) {
    const setCounter = () => {
        let cellPlayerA = matchRow.getElementsByClassName('cell-player-A')[0];
        cellPlayerA.innerHTML = cellPlayerA.innerHTML + cellPlayerA.innerHTML;
    };

    let buttons = matchRow.getElementsByTagName('button');
    for (let button of buttons) {
        button.addEventListener('click', () => setCounter());
    }
}

let matchRows = document.getElementsByClassName('match-row')
for (let matchRow of matchRows) {
    setupMatchRow(matchRow as HTMLElement);
}
