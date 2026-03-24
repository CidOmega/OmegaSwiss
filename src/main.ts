import {setupPlayersController} from "./Controllers/PlayersController.ts";
import {setupRound} from "./Controllers/RoundController.ts";

export function setupApp() {
    setupPlayersController()
    setupRound()
}

setupApp();
