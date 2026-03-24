import {setupPlayersController} from "./Controllers/PlayersController.ts";
import {setupRound} from "./Controllers/RoundController.ts";
import {Round} from "./Models/Round.ts";
import {MatchResultEnum} from "./Models/MatchResultEnum.ts";

export function setupApp() {
    let startTournament = $('#startTournament');
    let roundCountDisplay = $('#roundCountDisplay');
    roundCountDisplay.html('Ronda 1/9');

    startTournament.show();
    roundCountDisplay.hide();
    startTournament.on('click', () => {
        startTournament.hide();
        roundCountDisplay.show();

        let testRound = new Round([
            {
                results: [
                    {result: MatchResultEnum.None, player: {id: '1', name: 'Andy'}},
                    {result: MatchResultEnum.None, player: {id: '2', name: 'Lucas'}},
                ],
            },
            {
                results: [
                    {result: MatchResultEnum.None, player: {id: '3', name: 'Cid'}},
                    {result: MatchResultEnum.None, player: {id: '4', name: 'Omega'}},
                ],
            },
            {
                results: [
                    {result: MatchResultEnum.None, player: {id: '5', name: 'King'}},
                    {result: MatchResultEnum.None, player: {id: 'X', name: 'Bye'}},
                ],
            },
        ]);
        setupRound(testRound);
    });

    setupPlayersController();
}

setupApp();
