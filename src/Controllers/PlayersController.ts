import {Player} from "../Models/Player.ts";
import {Tools} from "../Tools.ts";
import {PlayerStorage} from "../Storage/PlayerStorage.ts";

export function setupPlayersController() {
    let playerNameInput = $('input#player-name-input');
    let playerTable = $('table#player-table');
    let playerTableBody = playerTable.find('tbody');

    let requiredRoundDisplay = $('#requiredRoundDisplay');

    $('button#new-player').on('click', () => {
        newPlayer();
        playerNameInput.trigger('focus');
    });
    playerNameInput.on('keydown', (e) => {
        if (e.key === 'Enter') {
            newPlayer();
        }

        playerNameInput.trigger('focus');
    });

    function newPlayer() {
        let playerName = playerNameInput.val()?.toString() ?? "";
        if (playerName === "") {
            return;
        }
        playerNameInput.val("")

        let newPlayer: Player = {id: crypto.randomUUID(), name: playerName};
        PlayerStorage.NewPlayer(newPlayer);
        updatedPlayers();
    }

    $('button#export-players').on('click', () => {
        console.log(PlayerStorage.GetPlayers());
    });

    function renderPlayers() {
        playerTableBody.html('')
        let players = PlayerStorage.GetPlayers();
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
            let playerIndex = Number.parseInt($(e.target).attr('data-related') ?? "X");
            PlayerStorage.DeletePlayerByIndex(playerIndex);
            updatedPlayers();
        })
    }

    function updateRequiredRoundDisplay() {
        requiredRoundDisplay.html(`Rondas necesarias: ${Tools.getRequiredRounds(PlayerStorage.GetPlayers().length)}`);
    }

    function updatedPlayers() {
        renderPlayers();
        updateRequiredRoundDisplay();
    }

    updatedPlayers();
}
