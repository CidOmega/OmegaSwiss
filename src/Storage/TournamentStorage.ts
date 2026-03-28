import {Tournament} from "../Models/Tournament.ts";
import {Round} from "../Models/Round.ts";

export const TournamentStorage = {
    keyTournament: 'tournament',
    keyRound: 'round',
    getTournament(): Tournament {
        let tournamentText = window.localStorage.getItem(this.keyTournament) || '{}';
        let baseTournament: Tournament = JSON.parse(tournamentText);
        return Tournament.copy(baseTournament);
    },
    saveTournament(tournament: Tournament) {
        window.localStorage.setItem(this.keyTournament, JSON.stringify(tournament));
    },
    getRound(): Round {
        let roundText = window.localStorage.getItem(this.keyRound) || '{}';
        let baseRound: Round = JSON.parse(roundText);
        return Round.copy(baseRound);
    },
    saveRound(round: Round) {
        window.localStorage.setItem(this.keyRound, JSON.stringify(round));
    },
    deleteAll() {
        window.localStorage.removeItem(this.keyTournament);
        window.localStorage.removeItem(this.keyRound);
    },
};