import {setupPlayersController} from "./Controllers/PlayersController.ts";
import {TournamentStorage} from "./Storage/TournamentStorage.ts";
import {continueTournament, startTournament} from "./Controllers/TournamentController.ts";

export function setupApp() {
    let playerSection = $('#playerSection');
    let roundSection = $('#roundSection');

    let headingOne = $('#headingOne');
    let startTournamentButton = $('#startTournament');
    let continueTournamentButton = $('#continueTournament');

    startTournamentButton.on('click', () => {
        // "Start" is in the collapse section, it will be opened.
        headingOne.trigger('click');
        roundSection.show();

        startTournament();
    });

    continueTournamentButton.on('click', () => {
        // "Continue" is in the collapse section, it will be opened.
        headingOne.trigger('click');
        roundSection.show();

        continueTournament();
    });

    playerSection.show();

    setupPlayersController();
    if(!TournamentStorage.getTournament().closed) {
        // TODO do properly
        continueTournamentButton.trigger('click');
    }
}

setupApp();
