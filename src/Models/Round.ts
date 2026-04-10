import {Match} from "./Match.ts";
import {Player, PlayerWithStatisticsPair} from "./Player.ts";
import {MatchResultEnum} from "./MatchResultEnum.ts";
import {Tools} from "../Tools.ts";

export class Round {
    matches: Match[];
    retreats: Player[];

    constructor(matches: PlayerWithStatisticsPair[]) {
        this.matches = matches
            .sort((a, b) => {
                // Bye always last
                if (Tools.containsBye([a.playerA, a.playerB]))
                    return +1;
                if (Tools.containsBye([b.playerA, b.playerB]))
                    return -1;

                // playerA without name 
                let compare = Tools.comparePlayers(a.playerA, b.playerA, false);
                // playerB without name
                if (compare === 0) compare = Tools.comparePlayers(a.playerB, b.playerB, false);
                // playerA with name
                if (compare === 0) compare = Tools.comparePlayers(a.playerA, b.playerA, true);
                // playerB with name
                if (compare === 0) compare = Tools.comparePlayers(a.playerB, b.playerB, true);
                return compare;
            })
            .map(o => ({
                results: [
                    {player: o.playerA, result: MatchResultEnum.None},
                    {player: o.playerB, result: MatchResultEnum.None},
                ]
            }));
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

    concedeBye() {
        let lastMatch = this.matches[this.matches.length - 1];
        if (lastMatch.results[0].player.id === Tools.byeId) {
            lastMatch.results[0].result = MatchResultEnum.Lose;
            lastMatch.results[1].result = MatchResultEnum.Win;
        } else if (lastMatch.results[1].player.id === Tools.byeId) {
            lastMatch.results[0].result = MatchResultEnum.Win;
            lastMatch.results[1].result = MatchResultEnum.Lose;
        }
    }
}