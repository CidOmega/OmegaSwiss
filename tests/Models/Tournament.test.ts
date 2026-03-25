import {Player} from "../../src/Models/Player";
import {Tournament} from "../../src/Models/Tournament";

function newPlayer(): Player {
    return {
        id: crypto.randomUUID(),
        name: crypto.randomUUID(),
    }
}


describe('Tournament.getActivePlayers', () => {
    test('When no retreats Then returns all players', () => {
        // Arrange
        let players: Player[] = [newPlayer(), newPlayer(), newPlayer()];
        let tournament: Tournament = new Tournament(players);

        // Act
        let activePlayers: Player[] = tournament.getActivePlayers();

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
        let activePlayers: Player[] = tournament.getActivePlayers();

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
        let activePlayers: Player[] = tournament.getActivePlayers();

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
        let activePlayers: Player[] = tournament.getActivePlayers();

        // Assert
        expect(activePlayers.length).toStrictEqual(1);
        expect(activePlayers[0]).toStrictEqual(players[1]);
    });
})