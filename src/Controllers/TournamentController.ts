import {TournamentStorage} from "../Storage/TournamentStorage.ts";
import {Tournament} from "../Models/Tournament.ts";
import {PlayerStorage} from "../Storage/PlayerStorage.ts";
import {setupRound} from "./RoundController.ts";
import {PlayerMatchmakingInfo} from "../Models/Player.ts";
import {Tools} from "../Tools.ts";
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
            renderRanking();
        });

        initializeUi = false;
    }

    doRound();

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

    function renderRanking() {
        let tournament = TournamentStorage.getTournament();

        let playersInfo: PlayerMatchmakingInfo[] = tournament.allPlayerHistories
            .map(ph => ({
                player: {...ph.player, statistics: ph.getStatistics()},
                availableRivals: ph.getRivals(),
            }));
        let playerTiebreakersDictionary: { [id: string]: Tiebreaker } = Object.fromEntries(playersInfo.map(ps => {
            return [ps.player.id, {
                player: ps.player,
                kda: ps.player.statistics.getKda(),
                matchPoints: ps.player.statistics.getMatchPoints(),
                matchWinPercentage: ps.player.statistics.getMatchWinPercentaje(),
                opponentsMatchWinPercentage: 0,
            }];
        }));

        let playerTiebreakers: Tiebreaker[] = []
        for (let pi of playersInfo) {
            let omwpSum = 0;
            let rivalCount = 0;
            for (let rival of pi.availableRivals) {
                if (rival.id === Tools.byeId) continue;

                omwpSum += playerTiebreakersDictionary[rival.id].matchWinPercentage;
                rivalCount++;
            }

            let tiebreaker = playerTiebreakersDictionary[pi.player.id];
            // Math.max(1, rivalCount) to prevent division by zero on only bye rival. 
            tiebreaker.opponentsMatchWinPercentage = omwpSum / Math.max(1, rivalCount);
            playerTiebreakers.push(tiebreaker);
        }

        playerTiebreakers.sort(Tools.compareTiebreaker);

        for (let pt of playerTiebreakers) {
            console.log(`${pt.player.name} - ${pt.kda} - ${pt.matchPoints} - ${pt.opponentsMatchWinPercentage}`);
        }
    }
}
