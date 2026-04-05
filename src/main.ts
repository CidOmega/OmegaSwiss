import {setupPlayersController} from "./Controllers/PlayersController.ts";
import {TournamentStorage} from "./Storage/TournamentStorage.ts";
import {continueTournament, startTournament} from "./Controllers/TournamentController.ts";
import {CollapseController} from "./Controllers/CollapseController.ts";

export function setupApp() {
    let playerSection = $('#playerSection');
    let roundSection = $('#roundSection');
    let rankingSection = $('#rankingSection');

    let startTournamentButton = $('#startTournament');
    let continueTournamentButton = $('#continueTournament');

    startTournamentButton.on('click', () => {
        roundSection.show();
        rankingSection.show();
        CollapseController.showRound();

        startTournament();
    });

    continueTournamentButton.on('click', () => {
        localContinueTournament();
    });

    playerSection.show();

    setupPlayersController();
    let tournament = TournamentStorage.getTournament();
    let thereArePlayers = tournament.getActivePlayers().length !== 0;
    if (thereArePlayers) {
        continueTournamentButton.show();
    }

    if (!tournament.closed && thereArePlayers) {
        localContinueTournament();
    } else {
        CollapseController.showPlayers();
    }

    function localContinueTournament() {
        roundSection.show();
        rankingSection.show();
        CollapseController.showRound();

        continueTournament();
    }
}

setupApp();
