import {Tournament} from "../Models/Tournament.ts";


export abstract class TournamentStorage {
    static urlKey = 'tId';
    private static keyTournamentStart = 'tournament';

    private static tournamentId = new URLSearchParams(window.location.search).get(TournamentStorage.urlKey)
        ?? Date.now();
    private static storageKey = `${TournamentStorage.keyTournamentStart}-${TournamentStorage.tournamentId}`;

    private static tournamentCache: Tournament | null = null;

    static getTournament(): Tournament {
        if (!TournamentStorage.tournamentCache) {
            let tournamentText = window.localStorage.getItem(TournamentStorage.storageKey);
            if (!tournamentText) {
                let t = new Tournament([]);
                t.closed = true;
                return t;
            }
            let baseTournament: Tournament = JSON.parse(tournamentText);
            TournamentStorage.tournamentCache = Tournament.copy(baseTournament)
        }
        return TournamentStorage.tournamentCache;
    }

    static saveTournament(tournament: Tournament | null = null) {
        TournamentStorage.tournamentCache = tournament ?? TournamentStorage.tournamentCache;
        window.localStorage.setItem(TournamentStorage.storageKey, JSON.stringify(TournamentStorage.tournamentCache));
    }

    static getAllTournamentKeys() {
        return Object.keys(window.localStorage)
            .filter(key => key.startsWith(TournamentStorage.keyTournamentStart))
            .sort()
            .reverse();
    }

    static deleteAll() {
        TournamentStorage.getAllTournamentKeys().forEach(key => window.localStorage.removeItem(key));
    }
}