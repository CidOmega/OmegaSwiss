export class PlayerStatistics {
    wins: number;
    loses: number;
    draws: number;

    constructor(wins: number, loses: number, draws: number) {
        this.wins = wins;
        this.loses = loses;
        this.draws = draws;
    }

    static getKda(self: PlayerStatistics): string {
        return `${self.wins}-${self.loses}-${self.draws}`;
    }

    static getKey(self: PlayerStatistics): string {
        let winsString = self.wins.toString().padStart(3, '0');
        let drawsString = self.draws.toString().padStart(3, '0');
        let losesString = self.loses.toString().padStart(3, '0');
        return `${winsString}-${drawsString}-${losesString}`
    }

    // getTrueMatchWinPercentaje() {  ...  }
    // getMatchWinPercentaje() {  return Math.Max(0.33, this.getTrueMatchWinPercentaje())  }
}