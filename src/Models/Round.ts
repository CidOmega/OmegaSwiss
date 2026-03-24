import {Match} from "./Match.ts";
import {Player} from "./Player.ts";

export class Round {
    matches: Match[];
    retreats: Player[];

    constructor(matches: Match[]) {
        this.matches = matches;
        this.retreats = [];
    }

    getAllPlayers(): Player[] {
        let response: Player[] = [];
        for (let match of this.matches) {
            for (let result of match.results) {
                response.push(result.player);
            }
        }
        return response;
    }
}