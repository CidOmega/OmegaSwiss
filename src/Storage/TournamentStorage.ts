import {Tournament} from "../Models/Tournament.ts";
import {Round} from "../Models/Round.ts";

let tournamentCache: Tournament | null = null;
let roundCache: Round | null = null;
const keyTournament = 'tournament';
const keyRound = 'round';
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
        if (!roundCache) {
            let roundText = window.localStorage.getItem(keyRound);
            if (!roundText) {
                return new Round([]);
            }
            let baseRound: Round = JSON.parse(roundText);
            roundCache = Round.copy(baseRound)
        }
        return roundCache;
    },
    saveTournament(tournament: Tournament | null = null) {
        tournamentCache = tournament ?? tournamentCache;
        window.localStorage.setItem(keyTournament, JSON.stringify(tournamentCache));
    },
    saveRound(round: Round | null = null) {
        roundCache = round ?? roundCache;
        window.localStorage.setItem(keyRound, JSON.stringify(roundCache));
    },
    deleteAll() {
        window.localStorage.removeItem(keyTournament);
        window.localStorage.removeItem(keyRound);
    },
};