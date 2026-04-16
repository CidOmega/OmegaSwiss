import {Tournament} from "../Models/Tournament.ts";

let tournamentCache: Tournament | null = null;
const keyTournament = 'tournament';

export abstract class TournamentStorage {
    static getTournament(): Tournament {
        if (!tournamentCache) {
            let tournamentText = window.localStorage.getItem(keyTournament);
            if (!tournamentText) {
                let t = new Tournament([]);
                t.closed = true;
                return t;
            }
            let baseTournament: Tournament = JSON.parse(tournamentText);
            tournamentCache = Tournament.copy(baseTournament)
        }
        return tournamentCache;
    }

    static saveTournament(tournament: Tournament | null = null) {
        tournamentCache = tournament ?? tournamentCache;
        window.localStorage.setItem(keyTournament, JSON.stringify(tournamentCache));
    }

    static deleteAll() {
        window.localStorage.removeItem(keyTournament);
    }
}