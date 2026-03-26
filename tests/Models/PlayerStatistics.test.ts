import {PlayerStatistics} from "../../src/Models/PlayerStatistics";

describe('PlayerStatistics.getKey', () => {
    const dataSet: [number, number, number, string][] = [
        [0, 0, 0, '000-000-000'],
        [7, 0, 0, '007-000-000'],
        [700, 0, 0, '700-000-000'],
        [0, 5, 0, '000-000-005'],
        [0, 500, 0, '000-000-500'],
        [0, 0, 3, '000-003-000'],
        [0, 0, 300, '000-300-000'],
        [1, 2, 3, '001-003-002'],
    ];

    it.each(dataSet)('Correct key', (wins: number, loses: number, draws: number, expectedKey: string) => {
        // Arrange
        let playerStatistics = new PlayerStatistics(wins, loses, draws);

        // Act
        let key = playerStatistics.getKey();

        // Assert
        expect(key).toStrictEqual(expectedKey);
    });
})