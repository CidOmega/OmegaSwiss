import {setupPlayersController} from "./Controllers/PlayersController.ts";
import {setupRound} from "./Controllers/RoundController.ts";
import {Round} from "./Models/Round.ts";
import {MatchResultEnum} from "./Models/MatchResultEnum.ts";

export function setupApp() {
    setupPlayersController();

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
}

setupApp();
