import {Player} from "./Player.ts";
import {Round} from "./Round.ts";

export class Tournament {
    allPlayers: Player[];
    retreats: Player[] = [];
    rounds: Round[] = [];

    constructor(players: Player[]) {
        this.allPlayers = players;
    }

    getActivePlayers(): Player[] {
        let activePlayers: Player[] = [];
        for (let player of this.allPlayers) {
            if (this.retreats.indexOf(player) === -1) {
                activePlayers.push(player);
            }
        }
        return activePlayers;
    }
}