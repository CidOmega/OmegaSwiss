import {Player} from "./Player.ts";

export interface Tiebreaker {
    player: Player;
    kda: string;
    matchPoints: number;
    matchWinPercentage: number;
    opponentsMatchWinPercentage: number;
}