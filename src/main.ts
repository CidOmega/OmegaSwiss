import {setupPlayersController} from "./Controllers/PlayersController.ts";
import {setupTournament} from "./Controllers/TournamentController.ts";

export function setupApp() {
    setupPlayersController()
    setupTournament()
}

setupApp();
