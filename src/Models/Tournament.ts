import {Player} from "./Player.ts";
import {Round} from "./Round.ts";
import {PlayerHistory} from "./PlayerHistory.ts";

export class Tournament {
    allPlayerHistories: PlayerHistory[] = [];
    retreats: Player[] = [];
    rounds: Round[] = [];

    bye: Player = {id: 'X', name: 'Bye'};

    constructor(players: Player[]) {
        for (let player of players) {
            this.allPlayerHistories.push(new PlayerHistory(player));
        }
    }

    getActivePlayers(): Player[] {
        let activePlayers: Player[] = [];
        for (let playerHistory of this.allPlayerHistories) {
            if (this.retreats.indexOf(playerHistory.player) === -1) {
                activePlayers.push(playerHistory.player);
            }
        }
        return activePlayers;
    }
}