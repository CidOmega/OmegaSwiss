import {setupPlayersController} from "./Controllers/PlayersController.ts";
import {setupRound} from "./Controllers/RoundController.ts";
import {PlayerStorage} from "./Storage/PlayerStorage.ts";
import {Tournament} from "./Models/Tournament.ts";
import {Round} from "./Models/Round.ts";
import {TournamentStorage} from "./Storage/TournamentStorage.ts";

export function setupApp() {
    let playerSection = $('#playerSection');
    let roundSection = $('#roundSection');

    let headingOne = $('#headingOne');
    let startTournamentButton = $('#startTournament');
    let continueTournamentButton = $('#continueTournament');

    startTournamentButton.on('click', () => {
        // "Start" is in the collapse section, it will be opened.
        headingOne.trigger('click');
        roundSection.show();

        startTournament();
    });

    continueTournamentButton.on('click', () => {
        // "Continue" is in the collapse section, it will be opened.
        headingOne.trigger('click');
        roundSection.show();

        continueTournament();
    });

    playerSection.show();

    setupPlayersController();
    if(!TournamentStorage.getTournament().closed) {
        // TODO do properly
        continueTournamentButton.trigger('click');
    }
}

setupApp();

function startTournament() {
    let players = PlayerStorage.GetPlayers();
    let tournament = new Tournament(players);
    setupTournament(tournament, tournament.getNextRound());
}

function continueTournament() {
    let tournament = TournamentStorage.getTournament();
    setupTournament(tournament, TournamentStorage.getRound());
}

function setupTournament(tournament: Tournament, round: Round) {
    TournamentStorage.saveTournament(tournament);
    let activeRound = round;
    TournamentStorage.saveRound(activeRound);

    let roundCountDisplay = $('#roundCountDisplay');

    let rerollRound = $('#rerollRound');
    let endRound = $('#endRound');
    let incompleteRoundModal = $('#incompleteRoundModal');

    rerollRound.on('click', newRound);

    function newRound() {
        activeRound = tournament.getNextRound();
        TournamentStorage.saveRound(activeRound);
        doRound();
    }

    function doRound() {
        roundCountDisplay.html(`Ronda ${tournament.roundCount}/${tournament.roundTotal}`);

        setupRound(activeRound);
    }

    endRound.on('click', () => {
        if (!activeRound.isCompleted()) {
            incompleteRoundModal.modal('show')
            return;
        }

        tournament.digestRound(activeRound);
        tournament.roundCount = tournament.roundCount + 1;
        TournamentStorage.saveTournament(tournament);

        newRound();
    });

    doRound();
}
