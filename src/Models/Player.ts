import {PlayerStatistics} from "./PlayerStatistics.ts";

export type Player = {
    id: string;
    name: string;
    statistics?: PlayerStatistics;
}