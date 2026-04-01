import {setupPlayersController} from "./Controllers/PlayersController.ts";
import {TournamentStorage} from "./Storage/TournamentStorage.ts";
import {continueTournament, startTournament} from "./Controllers/TournamentController.ts";

export function setupApp() {
    let playerSection = $('#playerSection');
    let roundSection = $('#roundSection');
    let rankingSection = $('#rankingSection');

    let headingOne = $('#headingOne');
    let startTournamentButton = $('#startTournament');
    let continueTournamentButton = $('#continueTournament');

    startTournamentButton.on('click', () => {
        // "Start" is in the collapse section, it will be opened.
        headingOne.trigger('click');
        roundSection.show();
        rankingSection.show();

        startTournament();
    });

    continueTournamentButton.on('click', () => {
        // "Continue" is in the collapse section, it will be opened.
        headingOne.trigger('click');
        roundSection.show();
        rankingSection.show();

        continueTournament();
    });

    playerSection.show();

    setupPlayersController();
    let tournament = TournamentStorage.getTournament();
    if (!tournament.closed && tournament.getActivePlayers().length !== 0) {
        continueTournamentButton.show();

        // TODO do properly
        continueTournamentButton.trigger('click');
    }
}

setupApp();
