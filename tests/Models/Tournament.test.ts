import {Player} from "../../src/Models/Player";
import {Tournament} from "../../src/Models/Tournament";
import {PlayerHistory} from "../../src/Models/PlayerHistory";
import {Tools} from "../../src/Tools";
import {MatchResultEnum} from "../../src/Models/MatchResultEnum";

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
        tournament.retreats.push(newPlayer());
        tournament.retreats.push(newPlayer());
        tournament.retreats.push(newPlayer());

        // Act
        let activePlayers: PlayerHistory[] = tournament.getActivePlayers();

        // Assert
        expect(activePlayers.length).toStrictEqual(3);
    });

    test('When retreats are all players Then returns empty', () => {
        // Arrange
        let players: Player[] = [newPlayer(), newPlayer(), newPlayer()];
        let tournament: Tournament = new Tournament(players);
        tournament.retreats.push(players[0]);
        tournament.retreats.push(players[1]);
        tournament.retreats.push(players[2]);

        // Act
        let activePlayers: PlayerHistory[] = tournament.getActivePlayers();

        // Assert
        expect(activePlayers.length).toStrictEqual(0);
    });

    test('When retreats are some players Then returns the others', () => {
        // Arrange
        let players: Player[] = [newPlayer(), newPlayer(), newPlayer()];
        let tournament: Tournament = new Tournament(players);
        tournament.retreats.push(players[0]);
        tournament.retreats.push(players[2]);

        // Act
        let activePlayers: PlayerHistory[] = tournament.getActivePlayers();

        // Assert
        expect(activePlayers.length).toStrictEqual(1);
        expect(activePlayers[0].player).toStrictEqual(players[1]);
    });
});

describe('Tournament.getRanking', () => {
    test('compareTiebreaker always returns non zero', () => {
        // Arrange
        let players: Player[] = [0, 1, 2, 3, 4, 5, 6, 7].map(n => newPlayer(n.toString()));
        let tournament: Tournament = new Tournament(players);

        // En el orden del ranking porque lo estoy copiando.
        tournament.allPlayerHistories[1].matchResults = [
            {player: players[7], result: MatchResultEnum.Win},
            {player: players[4], result: MatchResultEnum.Win},
            {player: players[2], result: MatchResultEnum.Win},
        ];
        tournament.allPlayerHistories[2].matchResults = [
            {player: players[5], result: MatchResultEnum.Win},
            {player: players[3], result: MatchResultEnum.Win},
            {player: players[1], result: MatchResultEnum.Lose},
        ];
        tournament.allPlayerHistories[3].matchResults = [
            {player: players[6], result: MatchResultEnum.Win},
            {player: players[2], result: MatchResultEnum.Lose},
            {player: players[4], result: MatchResultEnum.Win},
        ];
        tournament.allPlayerHistories[5].matchResults = [
            {player: players[2], result: MatchResultEnum.Lose},
            {player: players[6], result: MatchResultEnum.Win},
            {player: players[7], result: MatchResultEnum.Win},
        ];
        tournament.allPlayerHistories[4].matchResults = [
            {player: players[0], result: MatchResultEnum.Win},
            {player: players[1], result: MatchResultEnum.Lose},
            {player: players[3], result: MatchResultEnum.Lose},
        ];
        tournament.allPlayerHistories[7].matchResults = [
            {player: players[1], result: MatchResultEnum.Lose},
            {player: players[0], result: MatchResultEnum.Win},
            {player: players[5], result: MatchResultEnum.Lose},
        ];
        tournament.allPlayerHistories[6].matchResults = [
            {player: players[3], result: MatchResultEnum.Lose},
            {player: players[5], result: MatchResultEnum.Lose},
            {player: players[0], result: MatchResultEnum.Win},
        ];

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
});