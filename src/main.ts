import {setupPlayersController} from "./Controllers/PlayersController.ts";
import {setupRound} from "./Controllers/RoundController.ts";
import {Tools} from "./Tools.ts";
import {PlayerStorage} from "./Storage/PlayerStorage.ts";
import {Tournament} from "./Models/Tournament.ts";
import {Round} from "./Models/Round.ts";

export function setupApp() {
    let playerSection = $('#playerSection');
    let roundSection = $('#roundSection');

    let headingOne = $('#headingOne');
    let startTournament = $('#startTournament');

    startTournament.on('click', () => {
        startTournament.hide();

        // "Start" is in the collapse section, it will be opened.
        headingOne.trigger('click');
        roundSection.show();

        setupTournament();
    });

    playerSection.show();

    setupPlayersController();
}

setupApp();

function setupTournament() {
    let players = PlayerStorage.GetPlayers();
    let tournament = new Tournament(players);
    let roundCount = 1;
    let activeRound: Round;

    let roundCountDisplay = $('#roundCountDisplay');

    let rerollRound = $('#rerollRound');
    let endRound = $('#endRound');
    let incompleteRoundModal = $('#incompleteRoundModal');

    rerollRound.on('click', newRound);

    function newRound() {
        activeRound = tournament.getNextRound();
        roundCountDisplay.html(`Ronda ${roundCount}/${Tools.getRequiredRounds(players.length)}`);

        setupRound(activeRound);
    }

    endRound.on('click', () => {
        if (!activeRound.isCompleted()) {
            incompleteRoundModal.modal('show')
            return;
        }

        tournament.digestRound(activeRound);

        roundCount++;

        newRound();
    });

    newRound();
}
