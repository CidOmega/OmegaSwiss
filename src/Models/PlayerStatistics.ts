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

    // getTrueMatchWinPercentaje() {  ...  }
    // getMatchWinPercentaje() {  return Math.Max(0.33, this.getTrueMatchWinPercentaje())  }
}