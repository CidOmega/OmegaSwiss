import {Player} from "../Models/Player.ts";
import {Tools} from "../Tools.ts";

export function setupPlayersController(players: Player[]) {
    let playerNameInput = $('input#player-name-input');
    let playerTable = $('table#player-table');
    let playerTableBody = playerTable.find('tbody');

    let requiredRoundDisplay = $('#requiredRoundDisplay');

    $('button#new-player').on('click', () => {
        let playerName = playerNameInput.val()?.toString() ?? "";
        if (playerName === "") {
            return;
        }
        playerNameInput.val("")

        let newPlayer: Player = {id: crypto.randomUUID(), name: playerName};
        players.push(newPlayer);
        updatedPlayers()
        playerNameInput.trigger('focus');
    });

    $('button#export-players').on('click', () => {
        console.log(players);
    });

    function renderPlayers() {
        playerTableBody.html('')
        for (let i = 0; i < players.length; i++) {
            let player = players[i];
            let newRowHtml = `
            <tr>
                <td>${player.name}</td>
                <th scope="row">
                    <button type="button" class="btn-delete-player btn btn-danger" data-related="${i}">
                        D
                    </button>
                </th>
            </tr>
            `;
            playerTableBody.append(newRowHtml);
        }

        $('button.btn-delete-player').on('click', (e) => {
            let playerId = Number.parseInt($(e.target).attr('data-related') ?? "X");
            players.splice(playerId, 1);
            updatedPlayers();
        })
    }

    function updateRequiredRoundDisplay() {
        requiredRoundDisplay.html(`Rondas necesarias: ${Tools.getRequiredRounds(players.length)}`);
    }

    function updatedPlayers() {
        renderPlayers();
        updateRequiredRoundDisplay();
    }

    updatedPlayers();
}
