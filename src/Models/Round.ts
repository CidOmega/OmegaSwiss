import {Match} from "./Match.ts";
import {Player} from "./Player.ts";
import {MatchResultEnum} from "./MatchResultEnum.ts";

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

    isCompleted(): boolean {
        let results = this.matches.flatMap(m => m.results);
        for (let result of results) {
            if (result.result === MatchResultEnum.None) {
                return false;
            }
        }
        
        return true;
    }
}