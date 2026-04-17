import {Player} from "./Player.ts";
import {Tools} from "../Tools.ts";
import {MatchResultEnum} from "./MatchResultEnum.ts";
import {Tournament} from "./Tournament.ts";

export interface Tiebreaker {
    player: Player;
    kda: string;
    rivalNames: string[];
    matchPoints: number;
    matchWinPercentage: number;
    opponentsMatchWinPercentage: number;
    binary: number;
}

export abstract class TiebreakerTools {
    static compareTiebreaker(a: Tiebreaker, b: Tiebreaker, compareName: boolean = true): number {
        // Descending
        return b.matchPoints - a.matchPoints
            // Descending
            || b.opponentsMatchWinPercentage - a.opponentsMatchWinPercentage
            // Descending
            || b.binary - a.binary
            // Ascending
            || (compareName ? a.player.name.localeCompare(b.player.name) : 0);
    }

    static getRanking(tournament: Tournament): Tiebreaker[] {
        let allPlayerHistories = tournament.getAllPlayerHistories();
        let playerTiebreakersDictionary: { [id: string]: Tiebreaker } =
            Object.fromEntries(allPlayerHistories.map(ph => {
                let statistics = ph.getStatistics();
                return [ph.player.id, {
                    player: ph.player,
                    kda: statistics.getKda(),
                    rivalNames: ph.matchResults.map(r => `${r.player.name} - ${MatchResultEnum[r.result]}`),
                    matchPoints: statistics.getMatchPoints(),
                    matchWinPercentage: statistics.getMatchWinPercentaje(),
                    opponentsMatchWinPercentage: 0,
                    binary: 0,
                }];
            }));

        let playerTiebreakers: Tiebreaker[] = []
        for (let ph of allPlayerHistories) {
            let omwpSum = 0;
            let rivalCount = 0;
            let binary = 0;
            for (let i = 0; i < ph.matchResults.length; i++) {
                let rival = ph.matchResults[i];

                // Lose, Lose, Win, Lose, Win -> 0b10100 -> 20
                // Last matches weight more, supposedly not fair...
                binary += rival.result === MatchResultEnum.Win ? Math.pow(2, i) : 0;

                if (rival.player.id === Tools.byeId) continue;

                omwpSum += playerTiebreakersDictionary[rival.player.id].matchWinPercentage;
                rivalCount++;
            }

            let tiebreaker = playerTiebreakersDictionary[ph.player.id];
            // Math.max(1, rivalCount) to prevent division by zero on only bye rival. 
            tiebreaker.opponentsMatchWinPercentage = omwpSum / Math.max(1, rivalCount);

            // Power the binary to hide simplicity...
            let pow = Math.max(1, 7 - tournament.getRoundCount());
            tiebreaker.binary = Math.pow(binary, pow);

            playerTiebreakers.push(tiebreaker);
        }

        playerTiebreakers.sort(TiebreakerTools.compareTiebreaker);

        return playerTiebreakers;
    }
}