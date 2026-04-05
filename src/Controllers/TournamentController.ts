import {TournamentStorage} from "../Storage/TournamentStorage.ts";
import {Tournament} from "../Models/Tournament.ts";
import {PlayerStorage} from "../Storage/PlayerStorage.ts";
import {setupRound} from "./RoundController.ts";
import {Tiebreaker} from "../Models/Tiebreaker.ts";
import {Tools} from "../Tools.ts";
import {CollapseController} from "./CollapseController.ts";

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
    let roundCountDisplay = $('#roundCountDisplay');

    let rerollRound = $('#rerollRound');
    let endRound = $('#endRound');
    let incompleteRoundModal = $('#incompleteRoundModal');
    let endTournamentButton = $('#endTournament');

    let rankingTableBody = $('#rankingTable').find('tbody');

    if (initializeUi) {
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

        endTournamentButton.on('click', () => {
            let activeRound = TournamentStorage.getRound();
            if (!activeRound.isCompleted()) {
                incompleteRoundModal.modal('show')
                return;
            }

            let tournament = TournamentStorage.getTournament();
            tournament.digestRound(activeRound);
            tournament.roundCount = tournament.roundCount + 1;
            tournament.closed = true;
            TournamentStorage.saveTournament();

            newRound();

            CollapseController.showRanking();
        });

        initializeUi = false;
    }

    doRound();

    function newRound() {
        let tournament = TournamentStorage.getTournament();
        let newRound = tournament.getNextRound();
        TournamentStorage.saveRound(newRound);
        doRound();
        renderRanking();
    }

    function doRound() {
        let tournament = TournamentStorage.getTournament();

        if (tournament.roundCount < tournament.roundTotal) {
            endRound.text('Terminar ronda');
            endTournamentButton.hide();
        } else {
            endRound.text('Ronda extra');
            endTournamentButton.show();
        }

        if (tournament.roundCount <= tournament.roundTotal) {
            roundCountDisplay.html(`Ronda ${tournament.roundCount}/${tournament.roundTotal}`);
        } else {
            roundCountDisplay.html(`Ronda extra ${tournament.roundCount - tournament.roundTotal}`);
            CollapseController.toggleRanking(true);
        }

        renderRanking();
        setupRound();
    }

    function renderRanking() {
        let tournament = TournamentStorage.getTournament();
        let playerTiebreakers = tournament.getRanking();

        rankingTableBody.html('')
        let lastClassification = 1;
        for (let i = 0; i < playerTiebreakers.length; i++) {
            let tiebreaker = playerTiebreakers[i];
            let classification = i + 1;
            if (i !== 0 && Tools.compareTiebreaker(tiebreaker, playerTiebreakers[i - 1], false) === 0) {
                // On tie, reuse lastClassification.
                classification = lastClassification;
            } else {
                // If no tie, update lastClassification.
                lastClassification = classification;
            }

            let row = getRankingRow(tiebreaker, classification);
            rankingTableBody.append(row)
        }

        function getRankingRow(tiebreaker: Tiebreaker, classification: number) {
            let head = classification.toString();

            switch (classification) {
                case 1:
                    head = '<i class="bi bi-1-circle-fill" style="color: #D4AF37">';
                    break;
                case 2:
                    head = '<i class="bi bi-2-circle-fill" style="color: #C0C0C0">';
                    break;
                case 3:
                    head = '<i class="bi bi-3-circle-fill" style="color: #CD7F32">';
                    break;
            }

            let toShowTiebreaker =
                tiebreaker.matchPoints * 1000 * 1000 * 1000
                + Math.floor(tiebreaker.opponentsMatchWinPercentage * 1000 * 1000) * 1000
                + tiebreaker.binary;
            let titleTiebreaker = `${tiebreaker.matchPoints}\n${tiebreaker.opponentsMatchWinPercentage}\n${tiebreaker.binary}`

            return `
    <tr>
    <th scope="row" class="text-center">${head}</th>
    <td title="vs\n${tiebreaker.rivalNames.join('\n')}">${tiebreaker.player.name}</td>
    <td>${tiebreaker.kda}</td>
    <td title="${titleTiebreaker}">${toShowTiebreaker.toLocaleString('en-us')}</td>
    </tr>
`;
        }
    }
}
