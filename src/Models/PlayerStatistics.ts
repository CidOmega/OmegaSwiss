export class PlayerStatistics {
    wins: number;
    loses: number;
    draws: number;

    constructor(wins: number, loses: number, draws: number) {
        this.wins = wins;
        this.loses = loses;
        this.draws = draws;
    }

    getKda(): string {
        return `${this.wins}-${this.loses}-${this.draws}`;
    }

    getKey(): string {
        let winsString = this.wins.toString().padStart(3, '0');
        let drawsString = this.draws.toString().padStart(3, '0');
        let losesString = this.loses.toString().padStart(3, '0');
        return `${winsString}-${drawsString}-${losesString}`
    }

    getTrueMatchWinPercentaje(): number {
        let rounds = this.wins + this.loses + this.draws;
        if (rounds <= 0) {
            return 0;
        }

        let matchPoints = this.wins * 3 + this.draws;
        let maxMatchPoints = rounds * 3;

        return matchPoints / maxMatchPoints;
    }

    getMatchWinPercentaje() {
        return Math.max(0.33, this.getTrueMatchWinPercentaje());
    }
}