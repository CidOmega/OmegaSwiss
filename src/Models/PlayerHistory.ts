import {Player} from "./Player.ts";
import {MatchResult} from "./MatchResult.ts";
import {MatchResultEnum} from "./MatchResultEnum.ts";
import {PlayerStatistics} from "./PlayerStatistics.ts";

export class PlayerHistory {
    player: Player;
    matchResults: MatchResult[] = [];

    constructor(player: Player) {
        this.player = player;
    }

    addResult(result: MatchResultEnum, playerVs: Player): void {
        this.matchResults.push({player: playerVs, result: result});
    }

    getStatistics(): PlayerStatistics {
        let wins: number = 0;
        let loses: number = 0;
        let draws: number = 0;

        for (let matchResult of this.matchResults) {
            switch (matchResult.result) {
                case MatchResultEnum.Win:
                    wins++;
                    break;
                case MatchResultEnum.Lose:
                    loses++;
                    break;
                case MatchResultEnum.Draw:
                    draws++;
                    break;

            }
        }

        return new PlayerStatistics(wins, loses, draws);
    }

    getRivals(): Player[] {
        let rivals: Player[] = [];

        for (let matchResult of this.matchResults) {
            rivals.push(matchResult.player);
        }

        return rivals;
    }
}