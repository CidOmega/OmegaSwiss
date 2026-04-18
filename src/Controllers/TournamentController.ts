import {TournamentStorage} from "../Storage/TournamentStorage.ts";
import {setupRound} from "./RoundController.ts";
import {Tiebreaker, TiebreakerTools} from "../Models/Tiebreaker.ts";
import {CollapseController} from "./CollapseController.ts";
import {Tools} from "../Tools.ts";

let initializeUi = true;

export function setupTournament() {
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

        roundCountDisplay.html(tournament.getRoundText());
        if (tournament.roundTotal < roundCount) {
            CollapseController.toggleRanking(true);
        }

        renderRanking();
        setupRound();
    }

    function renderRanking() {
        let tournament = TournamentStorage.getTournament();
        let playerTiebreakers = TiebreakerTools.getRanking(tournament);

        rankingTableBody.html('')
        for (let tiebreaker of playerTiebreakers) {
            let row = getRankingRow(tiebreaker, !!tournament.getRetreats().find(p => p.id === tiebreaker.player.id));
            rankingTableBody.append(row)
        }

        function getRankingRow(tiebreaker: Tiebreaker, retreated: boolean) {
            let classification = tiebreaker.classification;
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

            return `
                <tr>
                    <th scope="row" class="text-center">${head}</th>
                    <td title="vs\n${tiebreaker.rivalNames.join('\n')}">${tiebreaker.player.name}${dropHtml}</td>
                    <td>${tiebreaker.kda}</td>
                    <td title="${Tools.escapeHtml(JSON.stringify(tiebreaker, null, 2))}">${tiebreaker.fullValueText}</td>
                </tr>
            `;
        }
    }
}
