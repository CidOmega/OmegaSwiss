import {Player} from "./Player.ts";

export type PlayerWithAvailableRivals = {
    player: Player,
    availableRivals: Player[],
}