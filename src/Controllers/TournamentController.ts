import {TournamentStorage} from "../Storage/TournamentStorage.ts";
import {Tournament} from "../Models/Tournament.ts";
import {PlayerStorage} from "../Storage/PlayerStorage.ts";
import {setupRound} from "./RoundController.ts";
import {PlayerMatchmakingInfo, PlayerWithStatistics} from "../Models/Player.ts";
import {Tools} from "../Tools.ts";

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
        let playerTiebreakersDictionary: { [id: string]: [number] } = Object.fromEntries(playersInfo.map(ps => {
            return [ps.player.id, [ps.player.statistics.getMatchWinPercentaje()]];
        }));

        let playerTiebreakers: [PlayerWithStatistics, number, number][] = []
        for (let pi of playersInfo) {
            let mwp = 0;
            let rivalCount = 0;
            for (let rival of pi.availableRivals) {
                if(rival.id === Tools.byeId) continue;
                
                mwp += playerTiebreakersDictionary[rival.id][0];
                rivalCount++;
            }
            // Math.max(1, rivalCount) to prevent division by zero on bye rival. 
            playerTiebreakers.push([pi.player, playerTiebreakersDictionary[pi.player.id][0], mwp / Math.max(1, rivalCount)]);
        }

        playerTiebreakers.sort((a, b) => {
            return b[1] - a[1] || b[2] - a[2];
        });

        for(let pt of playerTiebreakers) {
            console.log(`${pt[0].name} - ${pt[1]} - ${pt[2]}`);
        }
    }
}
