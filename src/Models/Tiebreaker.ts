import {Player} from "./Player.ts";
import {Tools} from "../Tools.ts";
import {MatchResultEnum} from "./MatchResultEnum.ts";
import {Tournament} from "./Tournament.ts";
import {MatchResult} from "./MatchResult.ts";

export interface Tiebreaker {
    classification: number;
    player: Player;
    kda: string;
    rivalNames: string[];
    matchPoints: number;
    matchWinPercentage: number;
    opponentsMatchWinList: number[];
    opponentsMatchWinPercentage: number;
    opponentsOpponentsMatchWinPercentage: number;
    lostSquared: number;
    binary: number; // Obsolete?
    fullValue: number;
    fullValueText: string;
}

export abstract class TiebreakerTools {
    static compareTiebreaker(a: Tiebreaker, b: Tiebreaker, compareName: boolean = true): number {
        // Descending
        return b.fullValue - a.fullValue
            // Ascending
            || (compareName ? a.player.name.localeCompare(b.player.name) : 0);
    }

    static getRanking(tournament: Tournament): Tiebreaker[] {
        let allPlayerHistories = tournament.getAllPlayerHistories();
        let playerTiebreakersDictionary: { [id: string]: Tiebreaker } =
            Object.fromEntries(allPlayerHistories.map(ph => {
                let statistics = ph.getStatistics();
                return [ph.player.id, {
                    classification: -1,
                    player: ph.player,
                    kda: statistics.getKda(),
                    rivalNames: ph.matchResults.map(r => `${r.player.name} - ${MatchResultEnum[r.result]}`),
                    matchPoints: statistics.getMatchPoints(),
                    matchWinPercentage: statistics.getTrueMatchWinPercentaje(), // ¿¡El True!?
                    opponentsMatchWinList: [],
                    opponentsMatchWinPercentage: 0,
                    opponentsOpponentsMatchWinPercentage: 0,
                    lostSquared: 0,
                    binary: 0,
                    fullValue: 0,
                    fullValueText: '0',
                }];
            }));

        let playerTiebreakers: Tiebreaker[] = []
        for (let ph of allPlayerHistories) {
            let lostSquared = 0;
            let binary = 0;
            for (let i = 0; i < ph.matchResults.length; i++) {
                let rival = ph.matchResults[i];

                lostSquared += rival.result === MatchResultEnum.Lose ? Math.pow(i + 1, 2) : 0;

                // Lose, Lose, Win, Lose, Win -> 0b10100 -> 20
                // Last matches weight more, supposedly not fair...
                binary += rival.result === MatchResultEnum.Win ? Math.pow(2, i) : 0;
            }

            let tiebreaker = playerTiebreakersDictionary[ph.player.id];
            tiebreaker.opponentsMatchWinList = TiebreakerTools.getOpponentsMatchWinList(ph.matchResults, playerTiebreakersDictionary);
            tiebreaker.opponentsMatchWinPercentage = Tools.average(tiebreaker.opponentsMatchWinList);
            tiebreaker.lostSquared = lostSquared;

            // Power the binary to hide simplicity...
            let pow = Math.max(1, 7 - tournament.getRoundCount());
            tiebreaker.binary = Math.pow(binary, pow);

            playerTiebreakers.push(tiebreaker);
        }

        // Another round, because we need all the opponentsMatchWinList filled.
        for (let ph of allPlayerHistories) {
            let tiebreaker = playerTiebreakersDictionary[ph.player.id];
            let oomwList = TiebreakerTools.getOpponentsOpponentsMatchWinList(ph.matchResults, playerTiebreakersDictionary);
            tiebreaker.opponentsOpponentsMatchWinPercentage = Tools.average(oomwList);
        }

        TiebreakerTools.setFullValues(playerTiebreakers);
        playerTiebreakers.sort(TiebreakerTools.compareTiebreaker);
        TiebreakerTools.setClassifications(playerTiebreakers);

        return playerTiebreakers;
    }

    private static getOpponentsMatchWinList(
        matchResults: MatchResult[],
        playerTiebreakersDictionary: { [id: string]: Tiebreaker }) {

        let omwList: number[] = [];
        for (let i = 0; i < matchResults.length; i++) {
            let rival = matchResults[i];

            if (rival.player.id === Tools.byeId) continue;

            omwList.push(playerTiebreakersDictionary[rival.player.id].matchWinPercentage);
        }

        return omwList;
    }

    private static getOpponentsOpponentsMatchWinList(
        matchResults: MatchResult[],
        playerTiebreakersDictionary: { [id: string]: Tiebreaker }) {

        let oomwList: number[] = [];
        for (let i = 0; i < matchResults.length; i++) {
            let rival = matchResults[i];

            if (rival.player.id === Tools.byeId) continue;

            let rivalTieBreaker = playerTiebreakersDictionary[rival.player.id];

            oomwList.push(...rivalTieBreaker.opponentsMatchWinList);
        }

        return oomwList;
    }

    private static setClassifications(playerTiebreakers: Tiebreaker[]) {
        let lastClassification = 1;
        for (let i = 0; i < playerTiebreakers.length; i++) {
            let tiebreaker = playerTiebreakers[i];

            let classification = i + 1;
            if (i !== 0 && TiebreakerTools.compareTiebreaker(tiebreaker, playerTiebreakers[i - 1], false) === 0) {
                // Skip i === 0 for array out of bounds on playerTiebreakers[i - 1] call.
                // On tie, reuse lastClassification.
                classification = lastClassification;
            } else {
                // If no tie, update lastClassification.
                lastClassification = classification;
            }

            tiebreaker.classification = classification;
        }
    }

    private static setFullValues(playerTiebreakers: Tiebreaker[]) {
        playerTiebreakers.forEach(t => TiebreakerTools.setFullValue(t));
    }

    private static setFullValue(playerTiebreaker: Tiebreaker) {
        playerTiebreaker.fullValue =
            playerTiebreaker.matchPoints * 1000 * 1000 * 1000
            + Math.floor(playerTiebreaker.opponentsMatchWinPercentage * 1000) * 1000 * 1000
            + Math.floor(playerTiebreaker.opponentsOpponentsMatchWinPercentage * 1000) * 1000
            + playerTiebreaker.lostSquared;
        playerTiebreaker.fullValueText = playerTiebreaker.fullValue.toLocaleString('en-us');
    }
}