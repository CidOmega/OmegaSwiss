import {TournamentStorage} from "../Storage/TournamentStorage.ts";
import {Tournament} from "../Models/Tournament.ts";
import {PlayerStorage} from "../Storage/PlayerStorage.ts";
import {setupRound} from "./RoundController.ts";

let initializeUi = true;

export function startTournament() {
    let players = PlayerStorage.GetPlayers();
    let tournament = new Tournament(players);
    let round = tournament.getNextRound();
    
    TournamentStorage.saveTournament(tournament);
    TournamentStorage.saveRound(round);

    setupTournament();
}

export function continueTournament() {
    setupTournament();
}

function setupTournament() {
    if (!initializeUi) {
        initializeUi = false;
        doRound();
        return;
    }

    let roundCountDisplay = $('#roundCountDisplay');

    let rerollRound = $('#rerollRound');
    let endRound = $('#endRound');
    let incompleteRoundModal = $('#incompleteRoundModal');

    function newRound() {
        let tournament = TournamentStorage.getTournament();
        let newRound = tournament.getNextRound();
        TournamentStorage.saveRound(newRound);
        doRound();
    }

    function doRound() {
        let tournament = TournamentStorage.getTournament();
        roundCountDisplay.html(`Ronda ${tournament.roundCount}/${tournament.roundTotal}`);

        setupRound();
    }

    rerollRound.on('click', newRound);

    endRound.on('click', () => {
        let activeRound = TournamentStorage.getRound();
        if (!activeRound.isCompleted()) {
            incompleteRoundModal.modal('show')
            return;
        }

        let tournament = TournamentStorage.getTournament();
        tournament.digestRound(activeRound);
        tournament.roundCount = tournament.roundCount + 1;
        TournamentStorage.saveTournament();

        newRound();
    });

    doRound();
}
