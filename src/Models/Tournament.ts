import {Player} from "./Player.ts";
import {Round} from "./Round.ts";
import {PlayerHistory} from "./PlayerHistory.ts";
import {Tools} from "../Tools.ts";
import {MatchResult} from "./MatchResult.ts";
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

    getRoundText(): string {
        return this.getRoundCount() <= this.roundTotal
            ? `Ronda ${this.getRoundCount()}/${this.roundTotal}`
            : `Ronda Extra ${this.getRoundCount() - this.roundTotal}`;
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
}