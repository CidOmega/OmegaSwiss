import {Player, PlayerMatchmakingInfo, PlayerWithStatistics} from "./Player.ts";
import {Round} from "./Round.ts";
import {PlayerHistory} from "./PlayerHistory.ts";
import {Tools} from "../Tools.ts";
import {Match} from "./Match.ts";
import {MatchResultEnum} from "./MatchResultEnum.ts";
import {MatchResult} from "./MatchResult.ts";
import {PlayerStatistics} from "./PlayerStatistics.ts";

export class Tournament {
    closed: boolean = false;
    roundCount: number = 1;
    roundTotal: number;
    allPlayerHistories: PlayerHistory[] = [];
    retreats: Player[] = [];
    // rounds: Round[] = [];

    bye: PlayerWithStatistics = {id: Tools.byeId, name: 'Bye', statistics: new PlayerStatistics(0, 0, 0)};

    constructor(players: Player[]) {
        for (let player of players) {
            this.allPlayerHistories.push(new PlayerHistory(player));
        }
        this.roundTotal = Tools.getRequiredRounds(players.length);
    }

    static copy(other: Tournament): Tournament {
        let response = new Tournament([]);

        response.roundCount = other.roundCount;
        response.roundTotal = other.roundTotal;
        response.allPlayerHistories = other.allPlayerHistories.map(ph => PlayerHistory.copy(ph));
        response.retreats = other.retreats;

        return response;
    }

    getActivePlayers(): PlayerHistory[] {
        let activePlayers: PlayerHistory[] = [];
        for (let playerHistory of this.allPlayerHistories) {
            if (!this.retreats.find(r => r.id === playerHistory.player.id)) {
                activePlayers.push(playerHistory);
            }
        }
        return activePlayers;
    }

    getByeWithRivals(): PlayerMatchmakingInfo {
        let availableRivals = this.getActivePlayers()
            .filter(ph => !ph.getRivals().find(r => r.id === Tools.byeId))
            .map(ph => ph.player);
        return {player: this.bye, availableRivals: availableRivals};
    }

    getNextRound(): Round {
        let playersWithAvailableRivals = this.getNextRoundPlayersWithRivals();

        if (playersWithAvailableRivals.length % 2 === 1) {
            playersWithAvailableRivals.push(this.getByeWithRivals());
        }

        let matches: Match[] = []
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

        cannotFindRival = cannotFindRival.sort((a, b) => Tools.comparePlayers(a, b));
        for (let i = 0; i < cannotFindRival.length; i += 2) {
            let noRivalA = cannotFindRival[i];
            let noRivalB = cannotFindRival[i + 1];

            matches.push(getNewMatch(noRivalA, noRivalB));
        }

        return new Round(matches);

        function getNewMatch(a: PlayerWithStatistics, b: PlayerWithStatistics): Match {
            let players = [a, b].sort(Tools.comparePlayers);

            return {
                results: [
                    {player: players[0], result: MatchResultEnum.None},
                    {player: players[1], result: MatchResultEnum.None},
                ]
            }
        }

        function getRestOfRivals(availableRivals: Player[], playersToNotCount: Player[]): Player[] {
            return availableRivals
                .filter(p => !playersToNotCount.find(ptnc => p.id === ptnc.id));
        }
    }

    getNextRoundPlayersWithRivals(): PlayerMatchmakingInfo[] {
        let activePlayers = this.getActivePlayers().map((ph) => ph.player);
        let playersTree = this.getNextRoundPlayersTree();
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

    getNextRoundPlayersTree() {
        let playersTree: { [key: string]: PlayerHistory[] } = {};

        for (let playerHistory of this.getActivePlayers()) {
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