import {Match} from "../../src/Models/Match";
import {Player} from "../../src/Models/Player";
import {MatchResultEnum} from "../../src/Models/MatchResultEnum";


describe('Player: edited out of Match is edited in Match', () => {
    test('Player: edited out of Match is edited in Match', () => {
        let player: Player = {
            id: crypto.randomUUID(),
            name: "Qwerty",
        }
        let match: Match = {
            results: [
                {player: player, result: MatchResultEnum.None},
                {player: player, result: MatchResultEnum.None},
            ],
        }

        const newName = 'Dvorak';
        player.name = newName;

        expect(player.name).toStrictEqual(newName);
        expect(match.results[0].player.name).toStrictEqual(newName);
        expect(match.results[1].player.name).toStrictEqual(newName);
        expect(match.results[1].player.name).toStrictEqual('newName'); // Fail to test pipeline
    })
})