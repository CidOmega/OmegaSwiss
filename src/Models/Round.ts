import {Match} from "./Match.ts";
import {Player} from "./Player.ts";
import {MatchResultEnum} from "./MatchResultEnum.ts";
import {Tools} from "../Tools.ts";

export class Round {
    matches: Match[];
    retreats: Player[];

    constructor(matches: Match[]) {
        this.matches = matches
            .sort((a, b) => {
                // Bye always last
                if (Tools.containsBye(a.results.map(r => r.player)))
                    return +1;
                if (Tools.containsBye(b.results.map(r => r.player)))
                    return -1;

                // playerA without name 
                let compare = Tools.comparePlayers(a.results[0].player, b.results[0].player, false);
                // playerB without name
                if (compare === 0) compare = Tools.comparePlayers(a.results[1].player, b.results[1].player, false);
                // playerA with name
                if (compare === 0) compare = Tools.comparePlayers(a.results[0].player, b.results[0].player, true);
                // playerB with name
                if (compare === 0) compare = Tools.comparePlayers(a.results[1].player, b.results[1].player, true);
                return compare;
            });
        this.retreats = [];
    }

    static copy(other: Round): Round {
        let response = new Round([]);
        response.matches = other.matches;
        response.retreats = other.retreats;
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