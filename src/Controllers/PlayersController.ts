import {Player} from "../Models/Player.ts";

export function setupPlayersController() {
    let players: { [id: string]: Player } = {};

    let playerNameInput = $('input#player-name-input');
    let playerTable = $('table#player-table');
    let playerTableBody = playerTable.find('tbody');

    // Grab the template and destroy it
    let playerRowTemplate = playerTableBody.html();
    playerTableBody.html('')

    let requiredRoundDisplay = $('#requiredRoundDisplay');

    $('button#new-player').on('click', () => {
        let playerName = playerNameInput.val()?.toString() ?? "";
        if (playerName === "") {
            return;
        }
        playerNameInput.val("")

        let newPlayer: Player = {id: crypto.randomUUID(), name: playerName};
        players[newPlayer.id] = newPlayer;
        updatedPlayers()
        playerNameInput.trigger('focus');
    });

    $('button#export-players').on('click', () => {
        console.log(players);
    });

    function renderPlayers() {
        playerTableBody.html('')
        for (let key in players) {
            let player = players[key];
            let newRowHtml = playerRowTemplate;
            newRowHtml = newRowHtml.replace('${playerId}', player.id);
            newRowHtml = newRowHtml.replace('${playerName}', player.name);
            playerTableBody.append(newRowHtml);
        }

        $('button.btn-delete-player').on('click', (e) => {
            let playerId = $(e.target).attr('data-related') ?? "";
            delete players[playerId];
            updatedPlayers();
        })
    }

    function updateRequiredRoundDisplay() {
        let playersLength = Object.keys(players).length;
        let rounds = playersLength == 0 ? 0 : Math.ceil(Math.log2(playersLength));
        requiredRoundDisplay.html('Rondas necesarias: ' + rounds);
    }

    function updatedPlayers() {
        renderPlayers();
        updateRequiredRoundDisplay();
    }

    updatedPlayers();
}
