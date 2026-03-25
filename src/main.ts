import {setupPlayersController} from "./Controllers/PlayersController.ts";
import {setupRound} from "./Controllers/RoundController.ts";
import {Tools} from "./Tools.ts";
import {PlayerStorage} from "./Storage/PlayerStorage.ts";
import {Tournament} from "./Models/Tournament.ts";

export function setupApp() {
    let playerSection = $('#playerSection');
    let headingOne = $('#headingOne');
    let roundSection = $('#roundSection');

    let startTournament = $('#startTournament');
    let roundCountDisplay = $('#roundCountDisplay');

    startTournament.on('click', () => {
        let players = PlayerStorage.GetPlayers();
        let tournament = new Tournament(players);
        let round = tournament.getNextRound();

        startTournament.hide();
        roundCountDisplay.show();
        roundCountDisplay.html(`Ronda 1/${Tools.getRequiredRounds(players.length)}`);

        // "Start" is in the collapse section, it will be opened.
        headingOne.trigger('click');
        roundSection.show();
        setupRound(round);
    });

    playerSection.show();
    roundSection.hide();

    setupPlayersController();
}

setupApp();
