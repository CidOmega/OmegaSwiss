import {MatchResult} from "./MatchResult.ts";
import {Player} from "./Player.ts";

export type Match = {
    players: [Player, MatchResult][];
}