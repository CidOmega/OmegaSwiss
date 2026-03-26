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

    getByeWithRivals(): { player: Player, availableRivals: Player[] } {
        let availableRivals = this.getActivePlayers()
            .filter(ph => ph.getRivals().indexOf(this.bye) === -1)
            .map(ph => ph.player);
        return {player: this.bye, availableRivals: availableRivals};
    }

    getNextRound(): Round {
        let players = this.getNextRoundPlayersWithRivals();

        if (players.length % 2 === 1) {
            players.push(this.getByeWithRivals());
        }

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

            // TODO estos dos jugadores han dejado de estar disponibles,
            //  asi que "availableRivals" de los jugadores restantes hay que actualizarlo
            //  para que si a alguien le quedan 2 el 2º lo pesque.
            //  ¿Que pasa si alguien tiene 2 disponibles y se emparejan entre ellos?
            
            Tools.deleteFromArray(players, rival);
            playerPointer = players.shift();
        }

        return new Round(matches);
    }

    getNextRoundPlayersWithRivals(): { player: Player, availableRivals: Player[] }[] {
        let activePlayers = this.getActivePlayers().map((ph) => ph.player);
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

        for (let playerHistory of this.getActivePlayers()) {
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