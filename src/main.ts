import {setupPlayersController} from "./Controllers/PlayersController.ts";
import {setupRound} from "./Controllers/RoundController.ts";
import {Round} from "./Models/Round.ts";
import {MatchResultEnum} from "./Models/MatchResultEnum.ts";
import {Player} from "./Models/Player.ts";
import {Tools} from "./Tools.ts";
import {Match} from "./Models/Match.ts";

export function setupApp() {
    let players: Player[] = []

    let startTournament = $('#startTournament');
    let roundCountDisplay = $('#roundCountDisplay');

    startTournament.show();
    roundCountDisplay.hide();
    startTournament.on('click', () => {
        if (players.length % 2 == 1) {
            players.push({id: 'X', name: 'Bye'});
        }

        startTournament.hide();
        roundCountDisplay.show();
        roundCountDisplay.html(`Ronda 1/${Tools.getRequiredRounds(players.length)}`);

        let matches: Match[] = [];
        for (let i = 0; i < players.length / 2; i++) {
            let index = i * 2;
            matches.push({
                results: [
                    {result: MatchResultEnum.None, player: players[index]},
                    {result: MatchResultEnum.None, player: players[index + 1]},
                ],
            })
        }
        setupRound(new Round(matches));
    });

    setupPlayersController(players);
}

setupApp();
