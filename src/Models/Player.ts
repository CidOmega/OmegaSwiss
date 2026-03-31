import {PlayerStatistics} from "./PlayerStatistics.ts";

export interface Player {
    id: string;
    name: string;
}

export interface PlayerWithStatistics extends Player {
    statistics: PlayerStatistics;
}

export type PlayerWithStatisticsPair = {
    playerA: PlayerWithStatistics,
    playerB: PlayerWithStatistics,
}

export type PlayerMatchmakingInfo = {
    player: PlayerWithStatistics,
    availableRivals: Player[],
}