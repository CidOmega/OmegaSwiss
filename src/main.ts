import {setupPlayersController} from "./Controllers/PlayersController.ts";
import {setupRound} from "./Controllers/RoundController.ts";
import {Tools} from "./Tools.ts";
import {PlayerStorage} from "./Storage/PlayerStorage.ts";
import {Tournament} from "./Models/Tournament.ts";
import {Round} from "./Models/Round.ts";
import {MatchResultEnum} from "./Models/MatchResultEnum.ts";
import {MatchResult} from "./Models/MatchResult.ts";

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

    rerollRound.on('click', newRound);

    function newRound() {
        activeRound = tournament.getNextRound();
        roundCountDisplay.html(`Ronda ${roundCount}/${Tools.getRequiredRounds(players.length)}`);

        setupRound(activeRound);
    }

    endRound.on('click', () => {
        let results = activeRound.matches.flatMap(m => m.results);
        for (let result of results) {
            if (result.result === MatchResultEnum.None) {
                $('#exampleModal').modal('show')
                return;
            }
        }

        for (let match of activeRound.matches) {
            for (let result of match.results) {
                let playerHistory = tournament.allPlayerHistories
                    .filter(ph => ph.player.id === result.player.id)[0];
                if (!playerHistory) {
                    continue; // Bye
                }

                let rivals = match.results
                    .filter(mr => mr.player.id !== result.player.id)
                    .map<MatchResult>(mr => ({player: mr.player, result: result.result}));
                playerHistory.matchResults.push(...rivals);
            }
        }

        tournament.retreats.push(...activeRound.retreats);
        
        roundCount++;

        newRound();
    });

    newRound();
}
