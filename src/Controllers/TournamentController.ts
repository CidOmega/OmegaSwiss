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

    TournamentStorage.saveTournament(tournament);

    setupTournament();
}

export function continueTournament() {
    setupTournament();
}

function setupTournament() {
    let roundCountDisplay = $('#roundCountDisplay');

    let goBackRound = $('#goBackRound');
    let rerollRound = $('#rerollRound');
    let endRound = $('#endRound');
    let incompleteRoundModal = $('#incompleteRoundModal');
    let endTournamentButton = $('#endTournament');

    let rankingTableBody = $('#rankingTable').find('tbody');

    if (initializeUi) {
        goBackRound.on('click', () => {
            let tournament = TournamentStorage.getTournament();
            tournament.goBackRound();
            TournamentStorage.saveTournament(tournament);

            doRound();
        });

        rerollRound.on('click', newRound);

        endRound.on('click', () => {
            let tournament = TournamentStorage.getTournament();
            if (!tournament.activeRound.isCompleted()) {
                incompleteRoundModal.modal('show')
                return;
            }

            tournament.digestAndSetNewRound()
            TournamentStorage.saveTournament();

            doRound();
        });

        endTournamentButton.on('click', () => {
            let tournament = TournamentStorage.getTournament();
            if (!tournament.activeRound.isCompleted()) {
                incompleteRoundModal.modal('show')
                return;

            }
            tournament.digestAndSetNewRound()
            tournament.closed = true;
            TournamentStorage.saveTournament();

            doRound();

            CollapseController.showRanking();
        });

        initializeUi = false;
    }

    doRound();

    function newRound() {
        let tournament = TournamentStorage.getTournament();
        tournament.setNewRound();
        TournamentStorage.saveTournament(tournament);

        doRound();
    }

    function doRound() {
        let tournament = TournamentStorage.getTournament();
        let roundCount = tournament.getRoundCount();

        goBackRound.toggle(!!tournament.rounds.length)

        if (roundCount < tournament.roundTotal) {
            endRound.text('Terminar ronda');
            endTournamentButton.hide();
        } else {
            endRound.text('Ronda extra');
            endTournamentButton.show();
        }

        if (roundCount <= tournament.roundTotal) {
            roundCountDisplay.html(`Ronda ${roundCount}/${tournament.roundTotal}`);
        } else {
            roundCountDisplay.html(`Ronda extra ${roundCount - tournament.roundTotal}`);
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

            let row = getRankingRow(tiebreaker, classification, !!tournament.getRetreats().find(p => p.id === tiebreaker.player.id));
            rankingTableBody.append(row)
        }

        function getRankingRow(tiebreaker: Tiebreaker, classification: number, retreated: boolean) {
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

            let dropHtml = retreated ? ' <span class="badge text-bg-info float-end">Drop</span>' : '';

            let toShowTiebreaker =
                tiebreaker.matchPoints * 1000 * 1000 * 1000
                + Math.floor(tiebreaker.opponentsMatchWinPercentage * 1000 * 1000) * 1000
                + tiebreaker.binary;
            let titleTiebreaker = `${tiebreaker.matchPoints}\n${tiebreaker.opponentsMatchWinPercentage}\n${tiebreaker.binary}`

            return `
    <tr>
    <th scope="row" class="text-center">${head}</th>
    <td title="vs\n${tiebreaker.rivalNames.join('\n')}">${tiebreaker.player.name}${dropHtml}</td>
    <td>${tiebreaker.kda}</td>
    <td title="${titleTiebreaker}">${toShowTiebreaker.toLocaleString('en-us')}</td>
    </tr>
`;
        }
    }
}
