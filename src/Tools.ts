import {Player, PlayerWithStatistics} from "./Models/Player.ts";

export abstract class Tools {
    static byeId = 'X';
    static bye: Player = {id: 'X', name: 'Bye'};

    static getRequiredRounds(playersLength: number) {
        return playersLength == 0 ? 0 : Math.ceil(Math.log2(playersLength));
    }

    static comparePlayers(a: PlayerWithStatistics, b: PlayerWithStatistics, compareName: boolean = true): number {
        // Bye always last.
        if (a.id === Tools.byeId) return +1;
        if (b.id === Tools.byeId) return -1;

        // Order by key first (reversed for ORCER DESC)
        let compare = b.statistics.getKey().localeCompare(a.statistics.getKey());
        // Name then (correctly sorted).
        if (compareName && compare === 0) compare = a.name.localeCompare(b.name);

        return compare;
    }

    static containsBye(players: Player[]): boolean {
        return players.filter(p => p.id === this.byeId).length !== 0;
    }

    static shuffle<T>(array: T[]) {
        let currentIndex = array.length;

        // While there remain elements to shuffle...
        while (currentIndex != 0) {

            // Pick a remaining element...
            let randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            // And swap it with the current element.
            [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        }
    }

    static deleteFromArray<T>(array: T[], element: T) {
        let index = array.indexOf(element);
        array.splice(index, 1);
    }

    static escapeHtml(unsafe: string) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    };

    static average(array: number[]) {
        // Math.max(1, rivalCount) to prevent division by zero on empty list.
        return array.reduce((a, b) => a + b, 0) / Math.max(1, array.length);
    };
}