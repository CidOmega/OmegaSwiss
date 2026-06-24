import {Player} from "../../src/Models/Player";
import {Tournament} from "../../src/Models/Tournament";
import {Round} from "../../src/Models/Round";
import {TiebreakerTools} from "../../src/Models/Tiebreaker";

describe('TiebreakerTools.getRanking with "bit" tournament', () => {
    // Arrange
    let players: Player[] = [
        {"id": "c1f4553f-53fb-497e-be27-feacebbd09bf", "name": "1"},
        {"id": "723e1588-9629-420e-83af-2e452d1c894d", "name": "2"},
        {"id": "73c8e335-1d7a-4700-8e1d-73b87356331a", "name": "3"},
        {"id": "bd4dafa1-6d8f-40a7-8e82-76bf50f961ed", "name": "4"},
        {"id": "21c3a65d-36f6-40c4-b173-b48336604b75", "name": "5"},
        {"id": "1c64a0e6-aa8a-4ccf-b328-5d22c62f8860", "name": "6"},
        {"id": "d6a744ef-3346-4d5f-806c-3b1a7062ab39", "name": "7"},
        {"id": "50a86036-44fa-4587-affa-66b3c99bf220", "name": "8"},
        {"id": "1c1e8d75-d387-4ff7-bda8-9f9c0d5bebbc", "name": "9"},
        {"id": "ac440c47-3e56-4ead-a16a-2c5ef6c0b046", "name": "10"},
        {"id": "93693c24-3f07-45ad-b9b3-74fad51dd3b0", "name": "11"},
        {"id": "ff28e926-12b3-4358-b9bc-b83462115211", "name": "12"},
        {"id": "13d8b38d-64e3-4923-a554-bc4a25e0bf52", "name": "13"},
        {"id": "037ae954-ad96-41f3-93ae-81c05fc986da", "name": "14"},
        {"id": "c5da2603-0cde-4cca-90c4-f5484733773d", "name": "15"},
        {"id": "ec0f09e3-b088-4e58-92bd-32c04b4f14d9", "name": "16"},
        {"id": "0baa7d00-ba7a-4ba0-ac0a-b621cac6a212", "name": "17"},
        {"id": "49ed05b2-18d2-4468-9f77-af7a983d9820", "name": "18"},
        {"id": "f7a6434a-1129-4f69-9329-b8f4f56e480c", "name": "19"},
    ];
    let tournament = new Tournament(players);
    let round = new Round([]);
    round.matches = [
        {
            "results": [
                {"player": {"id": "ec0f09e3-b088-4e58-92bd-32c04b4f14d9", "name": "16"}, "result": 1},
                {"player": {"id": "49ed05b2-18d2-4468-9f77-af7a983d9820", "name": "18"}, "result": 2}
            ]
        },
        {
            "results": [
                {"player": {"id": "13d8b38d-64e3-4923-a554-bc4a25e0bf52", "name": "13"}, "result": 1},
                {"player": {"id": "93693c24-3f07-45ad-b9b3-74fad51dd3b0", "name": "11"}, "result": 2}
            ]
        },
        {
            "results": [
                {"player": {"id": "ac440c47-3e56-4ead-a16a-2c5ef6c0b046", "name": "10"}, "result": 2},
                {"player": {"id": "1c64a0e6-aa8a-4ccf-b328-5d22c62f8860", "name": "6"}, "result": 1}
            ]
        },
        {
            "results": [
                {"player": {"id": "f7a6434a-1129-4f69-9329-b8f4f56e480c", "name": "19"}, "result": 2},
                {"player": {"id": "c1f4553f-53fb-497e-be27-feacebbd09bf", "name": "1"}, "result": 1}
            ]
        },
        {
            "results": [
                {"player": {"id": "21c3a65d-36f6-40c4-b173-b48336604b75", "name": "5"}, "result": 2},
                {"player": {"id": "723e1588-9629-420e-83af-2e452d1c894d", "name": "2"}, "result": 1}
            ]
        },
        {
            "results": [
                {"player": {"id": "c5da2603-0cde-4cca-90c4-f5484733773d", "name": "15"}, "result": 2},
                {"player": {"id": "bd4dafa1-6d8f-40a7-8e82-76bf50f961ed", "name": "4"}, "result": 1}
            ]
        },
        {
            "results": [
                {"player": {"id": "037ae954-ad96-41f3-93ae-81c05fc986da", "name": "14"}, "result": 2},
                {"player": {"id": "73c8e335-1d7a-4700-8e1d-73b87356331a", "name": "3"}, "result": 1}
            ]
        },
        {
            "results": [
                {"player": {"id": "d6a744ef-3346-4d5f-806c-3b1a7062ab39", "name": "7"}, "result": 1},
                {"player": {"id": "50a86036-44fa-4587-affa-66b3c99bf220", "name": "8"}, "result": 2}
            ]
        },
        {
            "results": [
                {"player": {"id": "0baa7d00-ba7a-4ba0-ac0a-b621cac6a212", "name": "17"}, "result": 2},
                {"player": {"id": "ff28e926-12b3-4358-b9bc-b83462115211", "name": "12"}, "result": 2}
            ]
        },
        {
            "results": [
                {"player": {"id": "1c1e8d75-d387-4ff7-bda8-9f9c0d5bebbc", "name": "9"}, "result": 1},
                {"player": {"id": "X", "name": "Bye"}, "result": 2}
            ]
        }
    ];
    tournament.rounds.push(round);

    round = new Round([]);
    round.matches = [
        {
            "results": [
                {"player": {"id": "ec0f09e3-b088-4e58-92bd-32c04b4f14d9", "name": "16"}, "result": 2},
                {"player": {"id": "1c1e8d75-d387-4ff7-bda8-9f9c0d5bebbc", "name": "9"}, "result": 2}]
        },
        {
            "results": [
                {"player": {"id": "73c8e335-1d7a-4700-8e1d-73b87356331a", "name": "3"}, "result": 1},
                {"player": {"id": "d6a744ef-3346-4d5f-806c-3b1a7062ab39", "name": "7"}, "result": 2}]
        },
        {
            "results": [
                {"player": {"id": "13d8b38d-64e3-4923-a554-bc4a25e0bf52", "name": "13"}, "result": 2},
                {"player": {"id": "1c64a0e6-aa8a-4ccf-b328-5d22c62f8860", "name": "6"}, "result": 1}]
        },
        {
            "results": [
                {"player": {"id": "723e1588-9629-420e-83af-2e452d1c894d", "name": "2"}, "result": 2},
                {"player": {"id": "c1f4553f-53fb-497e-be27-feacebbd09bf", "name": "1"}, "result": 1}]
        },
        {
            "results": [
                {"player": {"id": "bd4dafa1-6d8f-40a7-8e82-76bf50f961ed", "name": "4"}, "result": 1},
                {"player": {"id": "93693c24-3f07-45ad-b9b3-74fad51dd3b0", "name": "11"}, "result": 2}]
        },
        {
            "results": [
                {"player": {"id": "21c3a65d-36f6-40c4-b173-b48336604b75", "name": "5"}, "result": 1},
                {"player": {"id": "037ae954-ad96-41f3-93ae-81c05fc986da", "name": "14"}, "result": 2}]
        },
        {
            "results": [
                {"player": {"id": "50a86036-44fa-4587-affa-66b3c99bf220", "name": "8"}, "result": 1},
                {"player": {"id": "ff28e926-12b3-4358-b9bc-b83462115211", "name": "12"}, "result": 2}]
        },
        {
            "results": [
                {"player": {"id": "49ed05b2-18d2-4468-9f77-af7a983d9820", "name": "18"}, "result": 1},
                {"player": {"id": "f7a6434a-1129-4f69-9329-b8f4f56e480c", "name": "19"}, "result": 2}]
        },
        {
            "results": [
                {"player": {"id": "ac440c47-3e56-4ead-a16a-2c5ef6c0b046", "name": "10"}, "result": 1},
                {"player": {"id": "c5da2603-0cde-4cca-90c4-f5484733773d", "name": "15"}, "result": 2}]
        },
        {
            "results": [
                {"player": {"id": "0baa7d00-ba7a-4ba0-ac0a-b621cac6a212", "name": "17"}, "result": 1},
                {"player": {"id": "X", "name": "Bye"}, "result": 2}]
        }];
    tournament.rounds.push(round);

    round = new Round([]);
    round.matches = [
        {
            "results": [
                {"player": {"id": "1c64a0e6-aa8a-4ccf-b328-5d22c62f8860", "name": "6"}, "result": 2},
                {"player": {"id": "73c8e335-1d7a-4700-8e1d-73b87356331a", "name": "3"}, "result": 1}
            ]
        },
        {
            "results": [
                {"player": {"id": "bd4dafa1-6d8f-40a7-8e82-76bf50f961ed", "name": "4"}, "result": 2},
                {"player": {"id": "c1f4553f-53fb-497e-be27-feacebbd09bf", "name": "1"}, "result": 1}
            ]
        },
        {
            "results": [
                {"player": {"id": "ec0f09e3-b088-4e58-92bd-32c04b4f14d9", "name": "16"}, "result": 2},
                {"player": {"id": "723e1588-9629-420e-83af-2e452d1c894d", "name": "2"}, "result": 1}
            ]
        },
        {
            "results": [
                {"player": {"id": "d6a744ef-3346-4d5f-806c-3b1a7062ab39", "name": "7"}, "result": 2},
                {"player": {"id": "21c3a65d-36f6-40c4-b173-b48336604b75", "name": "5"}, "result": 1}
            ]
        },
        {
            "results": [
                {"player": {"id": "49ed05b2-18d2-4468-9f77-af7a983d9820", "name": "18"}, "result": 2},
                {"player": {"id": "1c1e8d75-d387-4ff7-bda8-9f9c0d5bebbc", "name": "9"}, "result": 1}
            ]
        },
        {
            "results": [
                {"player": {"id": "13d8b38d-64e3-4923-a554-bc4a25e0bf52", "name": "13"}, "result": 2},
                {"player": {"id": "0baa7d00-ba7a-4ba0-ac0a-b621cac6a212", "name": "17"}, "result": 2}
            ]
        },
        {
            "results": [
                {"player": {"id": "ac440c47-3e56-4ead-a16a-2c5ef6c0b046", "name": "10"}, "result": 2},
                {"player": {"id": "50a86036-44fa-4587-affa-66b3c99bf220", "name": "8"}, "result": 1}
            ]
        },
        {
            "results": [
                {"player": {"id": "037ae954-ad96-41f3-93ae-81c05fc986da", "name": "14"}, "result": 1},
                {"player": {"id": "c5da2603-0cde-4cca-90c4-f5484733773d", "name": "15"}, "result": 2}
            ]
        },
        {
            "results": [
                {"player": {"id": "f7a6434a-1129-4f69-9329-b8f4f56e480c", "name": "19"}, "result": 2},
                {"player": {"id": "93693c24-3f07-45ad-b9b3-74fad51dd3b0", "name": "11"}, "result": 1}
            ]
        },
        {
            "results": [
                {"player": {"id": "ff28e926-12b3-4358-b9bc-b83462115211", "name": "12"}, "result": 1},
                {"player": {"id": "X", "name": "Bye"}, "result": 2}
            ]
        }
    ];
    tournament.rounds.push(round);

    round = new Round([]);
    round.matches = [
        {
            "results": [
                {"player": {"id": "c1f4553f-53fb-497e-be27-feacebbd09bf", "name": "1"}, "result": 1},
                {"player": {"id": "73c8e335-1d7a-4700-8e1d-73b87356331a", "name": "3"}, "result": 2}
            ]
        },
        {
            "results": [
                {"player": {"id": "1c1e8d75-d387-4ff7-bda8-9f9c0d5bebbc", "name": "9"}, "result": 2},
                {"player": {"id": "bd4dafa1-6d8f-40a7-8e82-76bf50f961ed", "name": "4"}, "result": 1}
            ]
        },
        {
            "results": [
                {"player": {"id": "723e1588-9629-420e-83af-2e452d1c894d", "name": "2"}, "result": 1},
                {"player": {"id": "50a86036-44fa-4587-affa-66b3c99bf220", "name": "8"}, "result": 2}
            ]
        },
        {
            "results": [
                {"player": {"id": "21c3a65d-36f6-40c4-b173-b48336604b75", "name": "5"}, "result": 1},
                {"player": {"id": "1c64a0e6-aa8a-4ccf-b328-5d22c62f8860", "name": "6"}, "result": 2}
            ]
        },
        {
            "results": [
                {"player": {"id": "037ae954-ad96-41f3-93ae-81c05fc986da", "name": "14"}, "result": 2},
                {"player": {"id": "d6a744ef-3346-4d5f-806c-3b1a7062ab39", "name": "7"}, "result": 1}
            ]
        },
        {
            "results": [
                {"player": {"id": "93693c24-3f07-45ad-b9b3-74fad51dd3b0", "name": "11"}, "result": 1},
                {"player": {"id": "ec0f09e3-b088-4e58-92bd-32c04b4f14d9", "name": "16"}, "result": 2}
            ]
        },
        {
            "results": [
                {"player": {"id": "49ed05b2-18d2-4468-9f77-af7a983d9820", "name": "18"}, "result": 2},
                {"player": {"id": "ff28e926-12b3-4358-b9bc-b83462115211", "name": "12"}, "result": 1}
            ]
        },
        {
            "results": [
                {"player": {"id": "ac440c47-3e56-4ead-a16a-2c5ef6c0b046", "name": "10"}, "result": 1},
                {"player": {"id": "0baa7d00-ba7a-4ba0-ac0a-b621cac6a212", "name": "17"}, "result": 2}
            ]
        },
        {
            "results": [
                {"player": {"id": "13d8b38d-64e3-4923-a554-bc4a25e0bf52", "name": "13"}, "result": 1},
                {"player": {"id": "f7a6434a-1129-4f69-9329-b8f4f56e480c", "name": "19"}, "result": 2}
            ]
        },
        {
            "results": [
                {"player": {"id": "c5da2603-0cde-4cca-90c4-f5484733773d", "name": "15"}, "result": 1},
                {"player": {"id": "X", "name": "Bye"}, "result": 2}
            ]
        }
    ];
    tournament.rounds.push(round);


    it.each([
        [players[0].id, '12,562,578,000'],
        [players[1].id, '9,625,531,004'],
        [players[2].id, '9,562,578,016'],
        [players[3].id, '9,562,464,009'],
        [players[4].id, '9,500,593,001'],
        [players[5].id, '6,625,437,025'],
        [players[6].id, '6,562,546,013'],
        [players[7].id, '6,562,483,017'],
        [players[8].id, '6,416,458,020'],
        [players[9].id, '6,375,553,010'],
        [players[10].id, '6,375,484,005'],
        [players[11].id, '6,333,454,005'],
        [players[12].id, '6,312,516,013'],
        [players[13].id, '3,562,533,021'],
        [players[14].id, '3,500,500,014'],
        [players[15].id, '3,500,433,029'],
        [players[16].id, '3,500,340,026'],
        [players[17].id, '3,312,464,026'],
        [players[18].id, '562,390,030'],
    ])('kda result', (playerId: string, expectedKda: string) => {
        // Act
        let ranking = TiebreakerTools.getRanking(tournament);

        // Assert
        let tiebreaker = ranking.find(t => t.player.id === playerId);
        expect(tiebreaker).toBeDefined();
        expect(tiebreaker!.fullValueText).toStrictEqual(expectedKda);
    });
});