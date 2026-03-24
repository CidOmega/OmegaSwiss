import {Match} from "./Match.ts";
import {Player} from "./Player.ts";

export type Round = {
    matches: Match[];
    retreats: Player[];
}