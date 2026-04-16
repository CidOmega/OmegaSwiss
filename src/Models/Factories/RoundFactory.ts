import {PlayerHistory} from "../PlayerHistory.ts";
import {Tools} from "../../Tools.ts";
import {Player, PlayerMatchmakingInfo, PlayerWithStatistics, PlayerWithStatisticsPair} from "../Player.ts";
import {Round} from "../Round.ts";
import {PlayerStatistics} from "../PlayerStatistics.ts";

export abstract class RoundFactory {
    static generateRound(activePlayers: PlayerHistory[]): Round {
        let playersWithAvailableRivals = this.getNextRoundPlayersWithRivals(activePlayers);

        if (playersWithAvailableRivals.length % 2 === 1) {
            playersWithAvailableRivals.push(this.getByeWithRivals(activePlayers));
        }

        let matches: PlayerWithStatisticsPair[] = []
        let cannotFindRival: PlayerWithStatistics[] = [];

        let playerPointer = playersWithAvailableRivals.shift();
        while (!!playerPointer) {
            let availableRivals = playersWithAvailableRivals
                .filter(t => t.availableRivals.find(r => r.id === playerPointer!.player.id));

            let iAmTheOnlyRival = availableRivals
                .filter(t => t.availableRivals.length === 1)
                .shift();

            let rival: PlayerMatchmakingInfo | undefined = undefined;
            if (iAmTheOnlyRival) {
                rival = iAmTheOnlyRival;
            } else {
                let rivalPointer = availableRivals.shift();
                while (rivalPointer) {
                    let playersToRelate = [playerPointer.player, rivalPointer.player];
                    let someoneLosesAllRivals = availableRivals
                        .filter(t => getRestOfRivals(t.availableRivals, playersToRelate).length === 0)
                        .length !== 0;
                    if (!someoneLosesAllRivals) {
                        rival = rivalPointer;
                        break;
                    }

                    rivalPointer = availableRivals.shift();
                }
            }

            if (!rival) {
                cannotFindRival.push(playerPointer.player);
            } else {
                matches.push(getNewMatch(playerPointer.player, rival.player))

                Tools.deleteFromArray(playersWithAvailableRivals, rival);

                // playerPointer and rival is not available for the rest of the pairing
                for (let playerWithRivals of playersWithAvailableRivals) {
                    playerWithRivals.availableRivals = getRestOfRivals(playerWithRivals.availableRivals, [playerPointer.player, rival.player]);
                }
            }

            playerPointer = playersWithAvailableRivals.shift();
        }

        cannotFindRival = cannotFindRival.sort((a, b) => Tools.comparePlayers(a, b));
        for (let i = 0; i < cannotFindRival.length; i += 2) {
            let noRivalA = cannotFindRival[i];
            let noRivalB = cannotFindRival[i + 1];

            matches.push(getNewMatch(noRivalA, noRivalB));
        }

        let round = new Round(matches);
        round.concedeBye();
        return round;

        function getNewMatch(a: PlayerWithStatistics, b: PlayerWithStatistics): PlayerWithStatisticsPair {
            let players = [a, b].sort(Tools.comparePlayers);

            return {playerA: players[0], playerB: players[1]}
        }

        function getRestOfRivals(availableRivals: Player[], playersToNotCount: Player[]): Player[] {
            return availableRivals
                .filter(p => !playersToNotCount.find(ptnc => p.id === ptnc.id));
        }
    }

    private static getByeWithRivals(activePlayers: PlayerHistory[]): PlayerMatchmakingInfo {
        let availableRivals = activePlayers
            .filter(ph => !ph.getRivals().find(r => r.id === Tools.byeId))
            .map(ph => ph.player);
        return {player: {...Tools.bye, statistics: new PlayerStatistics(0, 0, 0)}, availableRivals: availableRivals};
    }

    private static getNextRoundPlayersWithRivals(activePlayerHistories: PlayerHistory[]): PlayerMatchmakingInfo[] {
        let activePlayers = activePlayerHistories.map(ph => ph.player);
        let playersTree = this.getNextRoundPlayersTree(activePlayerHistories);
        let treeKeys = Object.keys(playersTree).sort().reverse();
        let players: PlayerMatchmakingInfo[] = [];
        for (let key of treeKeys) {
            let playerHistories = playersTree[key];
            Tools.shuffle(playerHistories);

            for (let playerHistory of playerHistories) {
                let doneRivals = playerHistory.getRivals();
                let availableRivals = activePlayers
                    // Filter already done
                    .filter(value => !doneRivals.find(dr => dr.id === value.id))
                    // Filter myself
                    .filter(value => playerHistory.player.id !== value.id);
                players.push({
                    player: {...playerHistory.player, statistics: playerHistory.getStatistics()},
                    availableRivals: availableRivals,
                });
            }
        }
        return players;
    }

    private static getNextRoundPlayersTree(activePlayers: PlayerHistory[]) {
        let playersTree: { [key: string]: PlayerHistory[] } = {};

        for (let playerHistory of activePlayers) {
            let playerStatistics = playerHistory.getStatistics();
            let key = playerStatistics.getKey();

            let treeKeys = Object.keys(playersTree);
            if (treeKeys.indexOf(key) === -1) {
                playersTree[key] = [];
            }

            playersTree[key].push(playerHistory);
        }

        return playersTree;
    }
}