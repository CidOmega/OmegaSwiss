export class PlayerStatistics {
    wins: number;
    loses: number;
    draws: number;

    constructor(wins: number, loses: number, draws: number) {
        this.wins = wins;
        this.loses = loses;
        this.draws = draws;
    }

    // getTrueMatchWinPercentaje() {  ...  }
    // getMatchWinPercentaje() {  return Math.Max(0.33, this.getTrueMatchWinPercentaje())  }
}