import {Player} from "./Models/Player.ts";

export function setupTournament() {
    let players: Player[] = [];
    let playerNameInput = $('input#player-name-input');
    let playerTable = $('table#player-table');
    let playerTableBody = playerTable.find('tbody');

    let roundDisplay = $('#roundDisplay');

    $('button#new-player').on('click', () => {
        let playerName = playerNameInput.val()?.toString() ?? "";
        if (playerName === "") {
            return;
        }
        playerNameInput.val("")

        let newPlayer: Player = {id: crypto.randomUUID(), name: playerName};
        players.push(newPlayer)
        playerTableBody.append('<tr><td>' + newPlayer.name + '</td></tr>');
        updateRoundDisplay()
    });

    $('button#export-players').on('click', () => {
        console.log(players);
    });
    
    function updateRoundDisplay() {
        let rounds = players.length == 0 ? 0 : Math.ceil(Math.log2(players.length));
        roundDisplay.html('Rondas necesarias: ' + rounds);
    }
    updateRoundDisplay()
}

setupTournament();
