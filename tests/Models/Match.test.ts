import {Match} from "../../src/Models/Match";
import {Player} from "../../src/Models/Player";
import {MatchResult} from "../../src/Models/MatchResult";


describe('Player: edited out of Match is edited in Match', () => {
    test('Player: edited out of Match is edited in Match', () => {
        let player: Player = {
            id: crypto.randomUUID(),
            name: "Qwerty",
        }
        let match: Match = {
            players: [
                [player, MatchResult.None],
                [player, MatchResult.None],
            ],
        }

        const newName = 'Dvorak';
        player.name = newName;

        expect(player.name).toStrictEqual(newName);
        expect(match.players[0][0].name).toStrictEqual(newName);
        expect(match.players[1][0].name).toStrictEqual(newName);
    })
})