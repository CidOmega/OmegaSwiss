import {Tournament} from "../Models/Tournament.ts";
import {Round} from "../Models/Round.ts";

let tournamentCache: Tournament | null = null;
const keyTournament = 'tournament';
export const TournamentStorage = {
    getTournament(): Tournament {
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
    },
    getRound(): Round {
        return this.getTournament().activeRound;
    },
    saveTournament(tournament: Tournament | null = null) {
        tournamentCache = tournament ?? tournamentCache;
        window.localStorage.setItem(keyTournament, JSON.stringify(tournamentCache));
    },
    saveRound(round: Round | null = null) {
        let tournament = this.getTournament();
        tournament.activeRound = round ?? tournament.activeRound;
        this.saveTournament(tournament);
    },
    deleteAll() {
        window.localStorage.removeItem(keyTournament);
    },
};