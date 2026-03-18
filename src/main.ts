import {Player} from "./Models/Player.ts";

export function setupTournament() {
    let players: Player[] = [];
    let playerNameInput = $('input#player-name-input');
    let playerTable = $('table#player-table');
    let playerTableBody = playerTable.find('tbody');

    $('button#new-player').on('click', () => {
        let playerName = playerNameInput.val()?.toString() ?? "";
        if (playerName === "") {
            return;
        }
        playerNameInput.val("")

        let newPlayer: Player = {id: crypto.randomUUID(), name: playerName};
        players.push(newPlayer)
        playerTableBody.append('<tr><td>' + newPlayer.name + '</td></tr>');
    });

    $('button#export-players').on('click', () => {
        console.log(players);
    });
}

setupTournament();
