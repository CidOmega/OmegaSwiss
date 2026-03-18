import {Player} from "./Models/Player.ts";

export function setupTournament() {
    let players: Player[] = [];

    $('button#new-player').on('click', () => {
        players.push({id: crypto.randomUUID(), name: crypto.randomUUID()})
    });

    $('button#export-player').on('click', () => {
        console.log(players);
    });
}

setupTournament();
