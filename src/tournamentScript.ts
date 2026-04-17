import {setupTournament} from "./Controllers/TournamentController.ts";
import {CollapseController} from "./Controllers/CollapseController.ts";

export function setupApp() {
    CollapseController.showRound();

    setupTournament();
}

setupApp();
