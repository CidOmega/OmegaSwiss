import {Player} from "../../src/Models/Player";
import {Tournament} from "../../src/Models/Tournament";
import {PlayerHistory} from "../../src/Models/PlayerHistory";
import {Tools} from "../../src/Tools";
import {MatchResultEnum} from "../../src/Models/MatchResultEnum";
import {Round} from "../../src/Models/Round";

function newPlayer(data: string | null = null): Player {
    return {
        id: data ?? crypto.randomUUID(),
        name: data ?? crypto.randomUUID(),
    }
}


describe('Tournament.getActivePlayers', () => {
    test('When no retreats Then returns all players', () => {
        // Arrange
        let players: Player[] = [newPlayer(), newPlayer(), newPlayer()];
        let tournament: Tournament = new Tournament(players);

        // Act
        let activePlayers: PlayerHistory[] = tournament.getActivePlayers();

        // Assert
        expect(activePlayers.length).toStrictEqual(3);
    });

    test('IMPOSIBLE - When retreats arent in all players Then returns all players', () => {
        // Arrange
        let players: Player[] = [newPlayer(), newPlayer(), newPlayer()];
        let tournament: Tournament = new Tournament(players);
        let round = new Round([]);

        round.retreats.push(newPlayer());
        round.retreats.push(newPlayer());
        round.retreats.push(newPlayer());
        tournament.rounds.push(round);

        // Act
        let activePlayers: PlayerHistory[] = tournament.getActivePlayers();

        // Assert
        expect(activePlayers.length).toStrictEqual(3);
    });

    test('When retreats are all players Then returns empty', () => {
        // Arrange
        let players: Player[] = [newPlayer(), newPlayer(), newPlayer()];
        let tournament: Tournament = new Tournament(players);
        let round = new Round([]);

        round.retreats.push(players[0]);
        round.retreats.push(players[1]);
        round.retreats.push(players[2]);
        tournament.rounds.push(round);

        // Act
        let activePlayers: PlayerHistory[] = tournament.getActivePlayers();

        // Assert
        expect(activePlayers.length).toStrictEqual(0);
    });

    test('When retreats are some players Then returns the others', () => {
        // Arrange
        let players: Player[] = [newPlayer(), newPlayer(), newPlayer()];
        let tournament: Tournament = new Tournament(players);
        let round = new Round([]);

        round.retreats.push(players[0]);
        round.retreats.push(players[2]);
        tournament.rounds.push(round);

        // Act
        let activePlayers: PlayerHistory[] = tournament.getActivePlayers();

        // Assert
        expect(activePlayers.length).toStrictEqual(1);
        expect(activePlayers[0].player).toStrictEqual(players[1]);
    });
});

describe('Tournament.getRanking', () => {
    // Arrange
    let players: Player[] = [Tools.byeId, 1, 2, 3, 4, 5, 6, 7].map(n => newPlayer(n.toString()));
    // 0 is bye
    let tournament: Tournament = new Tournament(players.filter(p => p.id !== players[0].id));

    let round1 = new Round([]);
    round1.matches = [
        {
            results: [
                {player: players[1], result: MatchResultEnum.Win},
                {player: players[7], result: MatchResultEnum.Lose},
            ],
        },
        {
            results: [
                {player: players[2], result: MatchResultEnum.Win},
                {player: players[5], result: MatchResultEnum.Lose},
            ],
        },
        {
            results: [
                {player: players[3], result: MatchResultEnum.Win},
                {player: players[6], result: MatchResultEnum.Lose},
            ],
        },
        {
            results: [
                {player: players[4], result: MatchResultEnum.Win},
                {player: players[0], result: MatchResultEnum.Lose},
            ],
        },
    ];

    let round2 = new Round([]);
    round2.matches = [
        {
            results: [
                {player: players[1], result: MatchResultEnum.Win},
                {player: players[4], result: MatchResultEnum.Lose},
            ],
        },
        {
            results: [
                {player: players[2], result: MatchResultEnum.Win},
                {player: players[3], result: MatchResultEnum.Lose},
            ],
        },
        {
            results: [
                {player: players[5], result: MatchResultEnum.Win},
                {player: players[6], result: MatchResultEnum.Lose},
            ],
        },
        {
            results: [
                {player: players[7], result: MatchResultEnum.Win},
                {player: players[0], result: MatchResultEnum.Lose},
            ],
        },
    ];

    let round3 = new Round([]);
    round3.matches = [
        {
            results: [
                {player: players[1], result: MatchResultEnum.Win},
                {player: players[2], result: MatchResultEnum.Lose},
            ],
        },
        {
            results: [
                {player: players[3], result: MatchResultEnum.Win},
                {player: players[4], result: MatchResultEnum.Lose},
            ],
        },
        {
            results: [
                {player: players[5], result: MatchResultEnum.Win},
                {player: players[7], result: MatchResultEnum.Lose},
            ],
        },
        {
            results: [
                {player: players[6], result: MatchResultEnum.Win},
                {player: players[0], result: MatchResultEnum.Lose},
            ],
        },
    ];

    tournament.rounds.push(round1);
    tournament.rounds.push(round2);
    tournament.rounds.push(round3);

    test('compareTiebreaker always returns non zero', () => {
        // Act
        let ranking = tournament.getRanking();

        // Assert
        for (let i = 1; i < ranking.length; i++) {
            let compare = Tools.compareTiebreaker(ranking[i], ranking[i - 1], false);

            if (compare === 0) {
                throw new Error(`${ranking[i - 1].player.name} vs ${ranking[i].player.name} returned zero.`);
            }
        }
    });

    it.each([
        [players[1].id, '3-0-0'],
        [players[2].id, '2-1-0'],
        [players[3].id, '2-1-0'],
        [players[4].id, '1-2-0'],
        [players[5].id, '2-1-0'],
        [players[6].id, '1-2-0'],
        [players[7].id, '1-2-0'],
    ])('kda result', (playerId: string, expectedKda: string) => {
        // Act
        let ranking = tournament.getRanking();

        // Assert
        let tiebreaker = ranking.find(t => t.player.id === playerId);
        expect(tiebreaker).not.toBe(undefined);
        expect(tiebreaker!.kda).toStrictEqual(expectedKda);
    });

    it.each([
        [players[1].id, 343],
        [players[2].id, 27],
        [players[3].id, 125],
        [players[4].id, 1],
        [players[5].id, 216],
        [players[6].id, 64],
        [players[7].id, 8],
    ])('binary result', (playerId: string, expectedBinary: number) => {
        // Act
        let ranking = tournament.getRanking();

        // Assert
        let tiebreaker = ranking.find(t => t.player.id === playerId);
        expect(tiebreaker).not.toBe(undefined);
        expect(tiebreaker!.binary).toStrictEqual(expectedBinary);
    });
});