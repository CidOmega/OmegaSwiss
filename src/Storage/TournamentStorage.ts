import {Tournament} from "../Models/Tournament.ts";


export abstract class TournamentStorage {
    static urlKey = 'tId';
    private static keyTournamentStart = 'tournament';

    private static tournamentId = new URLSearchParams(window.location.search).get(TournamentStorage.urlKey)
        ?? Date.now().toString();
    private static storageKey = TournamentStorage.getStorageKey(TournamentStorage.tournamentId);

    private static tournamentCache: Tournament | null = null;

    static getTournament(): Tournament {
        if (!TournamentStorage.tournamentCache) {
            let tournamentText = window.localStorage.getItem(TournamentStorage.storageKey);
            if (!tournamentText) {
                let t = new Tournament([]);
                t.closed = true;
                return t;
            }
            TournamentStorage.tournamentCache = TournamentStorage.parseTournament(tournamentText);
        }
        return TournamentStorage.tournamentCache;
    }

    static saveTournament(tournament: Tournament | null = null) {
        let t = tournament ?? TournamentStorage.tournamentCache ?? new Tournament([]);
        TournamentStorage.tournamentCache = t;
        window.localStorage.setItem(TournamentStorage.getStorageKey(t.createdAt.getTime().toString()), JSON.stringify(TournamentStorage.tournamentCache));
    }

    static getAllTournaments(): { tId: string, tournament: Tournament }[] {
        let response: { tId: string, tournament: Tournament }[] = [];

        let keys = TournamentStorage.getAllTournamentKeys();
        for (let key of keys) {
            let tournamentText = window.localStorage.getItem(key);
            if (!tournamentText) {
                continue;
            }
            let tournament = TournamentStorage.parseTournament(tournamentText);
            response.push({tId: key.split('-')[1], tournament: tournament});
        }

        return response;
    }

    static deleteAll() {
        TournamentStorage.getAllTournamentKeys().forEach(key => window.localStorage.removeItem(key));
    }

    private static getStorageKey(tId: string) {
        return `${TournamentStorage.keyTournamentStart}-${tId}`;
    }

    private static parseTournament(tournamentText: string) {
        let baseTournament: Tournament = JSON.parse(tournamentText);
        return Tournament.copy(baseTournament);
    }

    private static getAllTournamentKeys() {
        return Object.keys(window.localStorage)
            .filter(key => key.startsWith(TournamentStorage.keyTournamentStart))
            .sort()
            .reverse();
    }
}