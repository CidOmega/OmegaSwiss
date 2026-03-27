import {Player} from "./Player.ts";
import {Round} from "./Round.ts";
import {PlayerHistory} from "./PlayerHistory.ts";
import {Tools} from "../Tools.ts";
import {Match} from "./Match.ts";
import {MatchResultEnum} from "./MatchResultEnum.ts";
import {MatchResult} from "./MatchResult.ts";
import {PlayerWithAvailableRivals} from "./PlayerWithAvailableRivals.ts";
import {PlayerStatistics} from "./PlayerStatistics.ts";

export class Tournament {
    allPlayerHistories: PlayerHistory[] = [];
    retreats: Player[] = [];
    // rounds: Round[] = [];

    bye: Player = {id: 'X', name: 'Bye', statistics: new PlayerStatistics(0, 0, 0)};

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
        let playersWithAvailableRivals = this.getNextRoundPlayersWithRivals();

        if (playersWithAvailableRivals.length % 2 === 1) {
            playersWithAvailableRivals.push(this.getByeWithRivals());
        }

        let matches: Match[] = []
        let cannotFindRival: PlayerWithAvailableRivals[] = [];

        let playerPointer = playersWithAvailableRivals.shift();
        while (!!playerPointer) {
            let availableRivals = playersWithAvailableRivals
                .filter(t => t.availableRivals.indexOf(playerPointer!.player) !== -1);

            let iAmTheOnlyRival = availableRivals
                .filter(t => t.availableRivals.length === 1)
                .shift();

            let rival: PlayerWithAvailableRivals | undefined = undefined;
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
                cannotFindRival.push(playerPointer);
            } else {
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

                Tools.deleteFromArray(playersWithAvailableRivals, rival);

                // playerPointer and rival is not available for the rest of the pairing
                for (let playerWithRivals of playersWithAvailableRivals) {
                    playerWithRivals.availableRivals = getRestOfRivals(playerWithRivals.availableRivals, [playerPointer.player, rival.player]);
                }
            }

            playerPointer = playersWithAvailableRivals.shift();
        }

        cannotFindRival = cannotFindRival
            .sort((a, b) => comparePlayers(a.player, b.player))
            .reverse();
        for (let i = 0; i < cannotFindRival.length; i += 2) {
            let noRivalA = cannotFindRival[i];
            let noRivalB = cannotFindRival[i + 1];

            matches.push({
                results: [
                    {player: noRivalA.player, result: MatchResultEnum.None},
                    {player: noRivalB.player, result: MatchResultEnum.None},
                ]
            })
        }

        matches = matches
            .sort((a, b) => {
                let compare = comparePlayers(a.results[0].player, b.results[0].player);
                if (compare === 0) compare = comparePlayers(a.results[1].player, b.results[1].player);
                return compare;
            })
            .reverse();

        return new Round(matches);

        function getRestOfRivals(availableRivals: Player[], playersToNotCount: Player[]): Player[] {
            return availableRivals
                .filter(p => playersToNotCount.indexOf(p) !== -1);
        }

        function comparePlayers(a: Player, b: Player): number {
            if (a.id === 'X') return -1;
            if (b.id === 'X') return +1;

            return a.statistics!.getKey().localeCompare(b.statistics!.getKey());
        }
    }

    getNextRoundPlayersWithRivals(): PlayerWithAvailableRivals[] {
        let activePlayers = this.getActivePlayers().map((ph) => ph.player);
        let playersTree = this.getNextRoundPlayersTree();
        let treeKeys = Object.keys(playersTree).sort().reverse();
        let players: PlayerWithAvailableRivals[] = [];
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

    digestRound(round: Round) {
        for (let match of round.matches) {
            for (let result of match.results) {
                let playerHistory = this.allPlayerHistories
                    .filter(ph => ph.player.id === result.player.id)[0];
                if (!playerHistory) {
                    continue; // Bye
                }

                let rivals = match.results
                    .filter(mr => mr.player.id !== result.player.id)
                    .map<MatchResult>(mr => ({player: mr.player, result: result.result}));
                playerHistory.matchResults.push(...rivals);
            }
        }

        this.retreats.push(...round.retreats);
    }
}