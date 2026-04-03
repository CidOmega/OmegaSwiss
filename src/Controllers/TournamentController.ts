import {TournamentStorage} from "../Storage/TournamentStorage.ts";
import {Tournament} from "../Models/Tournament.ts";
import {PlayerStorage} from "../Storage/PlayerStorage.ts";
import {setupRound} from "./RoundController.ts";
import {Tiebreaker} from "../Models/Tiebreaker.ts";

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
        roundCountDisplay.html(`Ronda ${tournament.roundCount}/${tournament.roundTotal}`);
        renderRanking();

        setupRound();
    }

    function renderRanking() {
        let tournament = TournamentStorage.getTournament();
        let playerTiebreakers = tournament.getRanking();

        rankingTableBody.html('')
        for (let i = 0; i < playerTiebreakers.length; i++) {
            let tiebreaker = playerTiebreakers[i];
            let row = getRankingRow(tiebreaker, i + 1);
            rankingTableBody.append(row)
        }

        function getRankingRow(tiebreaker: Tiebreaker, classification: number) {
            return `
    <tr class="match-row">
    <th scope="row" class="text-center">${classification}</th>
    <td>${tiebreaker.player.name} ${tiebreaker.kda}</td>
    <td>${tiebreaker.matchPoints}</td>
    <td>${Math.trunc(tiebreaker.opponentsMatchWinPercentage * 100000).toLocaleString('en-us')}</td>
    </tr>
`;
        }
    }
}
