import {Player} from "./Player.ts";
import {Round} from "./Round.ts";
import {PlayerHistory} from "./PlayerHistory.ts";
import {Tools} from "../Tools.ts";
import {Match} from "./Match.ts";
import {MatchResultEnum} from "./MatchResultEnum.ts";

export class Tournament {
    allPlayerHistories: PlayerHistory[] = [];
    retreats: Player[] = [];
    // rounds: Round[] = [];

    bye: Player = {id: 'X', name: 'Bye'};

    constructor(players: Player[]) {
        for (let player of players) {
            this.allPlayerHistories.push(new PlayerHistory(player));
        }
    }

    getActivePlayers(): PlayerHistory[] {
        let activePlayers: PlayerHistory[] = [];
        for (let playerHistory of this.allPlayerHistories) {
            if (this.retreats.indexOf(playerHistory.player) === -1) {
                activePlayers.push(playerHistory);
            }
        }
        return activePlayers;
    }

    getNextRoundPlayers(): PlayerHistory[] {
        let nextRoundPlayers = this.getActivePlayers();

        if (nextRoundPlayers.length % 2 === 1) {
            nextRoundPlayers.push(new PlayerHistory(this.bye));
        }

        return nextRoundPlayers;
    }

    getNextRound(): Round {
        let players = this.getNextRoundPlayersWithRivals();

        let matches: Match[] = []

        let playerPointer = players.shift();
        while (!!playerPointer) {
            let availableRivals = players
                .filter(t => t.availableRivals.indexOf(playerPointer!.player) !== -1);
            let iAmTheOnlyRival = availableRivals
                .filter(t => t.availableRivals.length === 1)
                .shift();
            let rival = iAmTheOnlyRival ?? availableRivals.shift()!;

            matches.push({
                results: [
                    {player: playerPointer.player, result: MatchResultEnum.None},
                    {player: rival.player, result: MatchResultEnum.None},
                ]
            });

            Tools.deleteFromArray(players, rival);
            playerPointer = players.shift();
        }

        return new Round(matches);
    }

    getNextRoundPlayersWithRivals(): { player: Player, availableRivals: Player[] }[] {
        let activePlayers = this.getNextRoundPlayers().map((ph) => ph.player);
        let playersTree = this.getNextRoundPlayersTree();
        let treeKeys = Object.keys(playersTree).sort().reverse();
        let players: { player: Player, availableRivals: Player[] }[] = [];
        for (let key of treeKeys) {
            let playerHistories = playersTree[key];
            Tools.shuffle(playerHistories);

            for (let playerHistory of playerHistories) {
                let doneRivals = playerHistory.getRivals();
                let availableRivals = activePlayers
                    // Filter already done
                    .filter(value => doneRivals.indexOf(value) === -1)
                    // Filter myself
                    .filter(value => playerHistory.player !== value);
                players.push({player: playerHistory.player, availableRivals: availableRivals});
            }
        }
        return players;
    }

    getNextRoundPlayersTree() {
        let playersTree: { [key: string]: PlayerHistory[] } = {};

        for (let playerHistory of this.getNextRoundPlayers()) {
            let playerStatistics = playerHistory.getStatistics();
            let key = playerStatistics.getKey();

            let treeKeys = Object.keys(playersTree);
            if (treeKeys.indexOf(key) === -1) {
                playersTree[key] = [];
            }

            playerHistory.player.statistics = playerStatistics;
            playersTree[key].push(playerHistory);
        }

        return playersTree;
    }
}