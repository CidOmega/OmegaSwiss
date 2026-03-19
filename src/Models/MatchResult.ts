import {Player} from "./Player.ts";
import {MatchResultEnum} from "./MatchResultEnum.ts";

export type MatchResult = {
    player: Player,
    result: MatchResultEnum,
}