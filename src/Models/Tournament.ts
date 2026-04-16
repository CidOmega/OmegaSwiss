import {Player} from "./Player.ts";
import {Round} from "./Round.ts";
import {PlayerHistory} from "./PlayerHistory.ts";
import {Tools} from "../Tools.ts";
import {MatchResult} from "./MatchResult.ts";
import {Tiebreaker} from "./Tiebreaker.ts";
import {MatchResultEnum} from "./MatchResultEnum.ts";
import {RoundFactory} from "./Factories/RoundFactory.ts";

export class Tournament {
    createdAt: Date = new Date();
    closed: boolean = false;
    roundTotal: number;
    players: Player[];
    rounds: Round[] = [];
    activeRound: Round;

    constructor(players: Player[]) {
        this.players = [...players];
        this.roundTotal = Tools.getRequiredRounds(players.length);
        this.activeRound = RoundFactory.generateRound(this.getActivePlayers());
    }

    static copy(other: Tournament): Tournament {
        let response = new Tournament(other.players);
        // Stored as text...
        response.createdAt = new Date(other.createdAt ?? 0);
        response.closed = other.closed;
        response.rounds = other.rounds.map(r => Round.copy(r));
        response.activeRound = Round.copy(other.activeRound);

        return response;
    }

    getRoundCount(): number {
        return this.rounds.length + 1;
    }

    getRetreats(): Player[] {
        return this.rounds.flatMap(r => r.retreats);
    }

    getActivePlayers(): PlayerHistory[] {
        let retreats = this.getRetreats();
        return this.getAllPlayerHistories()
            .filter(ph => !retreats.find(r => r.id === ph.player.id));
    }

    setNewRound() {
        this.activeRound = RoundFactory.generateRound(this.getActivePlayers());
    }

    digestAndSetNewRound() {
        this.rounds.push(this.activeRound);
        this.setNewRound();
    }

    goBackRound() {
        if (this.rounds.length === 0) {
            return;
        }

        this.activeRound = this.rounds.pop()!;
    }

    getAllPlayerHistories(): PlayerHistory[] {
        let allPlayerHistories: PlayerHistory[] = this.players.map(p => new PlayerHistory(p));

        for (let match of this.rounds.flatMap(r => r.matches)) {
            for (let result of match.results) {
                let playerHistory = allPlayerHistories
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

        return allPlayerHistories;
    }

    getRanking(): Tiebreaker[] {
        let allPlayerHistories = this.getAllPlayerHistories();
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
            let pow = Math.max(1, 7 - this.getRoundCount());
            tiebreaker.binary = Math.pow(binary, pow);

            playerTiebreakers.push(tiebreaker);
        }

        playerTiebreakers.sort(Tools.compareTiebreaker);

        return playerTiebreakers;
    }
}