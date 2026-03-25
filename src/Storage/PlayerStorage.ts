import {Player} from "../Models/Player.ts";

export const PlayerStorage = {
    Key: 'players',
    GetPlayers(): Player[] {
        let playersText = window.localStorage.getItem(this.Key) || '[]';
        return JSON.parse(playersText);
    },
    NewPlayer(player: Player) {
        let players = this.GetPlayers();
        players.push(player);
        window.localStorage.setItem(this.Key, JSON.stringify(players));
    },
    DeletePlayerByIndex(index: number) {
        let players = this.GetPlayers();
        players.splice(index, 1);
        window.localStorage.setItem(this.Key, JSON.stringify(players));
    },
    ResetPlayers() {
        window.localStorage.removeItem(this.Key);
    },
};