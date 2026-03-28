import {Player} from "./Models/Player.ts";
import {PlayerStatistics} from "./Models/PlayerStatistics.ts";

export const Tools = {
    byeId: 'X',
    getRequiredRounds(playersLength: number) {
        return playersLength == 0 ? 0 : Math.ceil(Math.log2(playersLength));
    },
    comparePlayers(a: Player, b: Player, compareName: boolean = true): number {
        // Bye always last.
        if (a.id === Tools.byeId) return +1;
        if (b.id === Tools.byeId) return -1;

        // Order by key first (reversed for ORCER DESC)
        let compare = PlayerStatistics.getKey(b.statistics).localeCompare(PlayerStatistics.getKey(a.statistics));
        // Name then (correctly sorted).
        if (compareName && compare === 0) compare = a.name.localeCompare(b.name);

        return compare;
    },
    containsBye(players: Player[]): boolean {
        return players.filter(p => p.id === this.byeId).length !== 0;
    },
    shuffle<T>(array: T[]) {
        let currentIndex = array.length;

        // While there remain elements to shuffle...
        while (currentIndex != 0) {

            // Pick a remaining element...
            let randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            // And swap it with the current element.
            [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        }
    },
    deleteFromArray<T>(array: T[], element: T) {
        let index = array.indexOf(element);
        array.splice(index, 1);
    }
}