import {Player} from "../Models/Player.ts";

export function setupTournament() {
    let drawIsDraw = false;

    let startTournament = $('#startTournament');
    let roundCountDisplay = $('#roundCountDisplay');
    roundCountDisplay.html('Ronda 1/9');

    let swapDrawContainer = $('#swapDrawContainer');
    let setDrawButton = swapDrawContainer.find('.btn-draw')
    let setDoubleKoButton = swapDrawContainer.find('.btn-double-ko')

    let mainTable = $('#mainTable');
    let mainTableBody = mainTable.find('tbody');

    startTournament.show();
    roundCountDisplay.hide();
    startTournament.on('click', () => {
        startTournament.hide();
        roundCountDisplay.show();

        mainTableBody.html('');
        mainTableBody.append(getMatchRowHtml({id: '1', name: 'Andy'}, {id: '2', name: 'Lucas'}, 'guid1', 1));
        mainTableBody.append(getMatchRowHtml({id: '3', name: 'Cid'}, {id: 'X', name: 'Bye'}, 'guid2', 2));

        renderSwapDraw()
    });

    setDrawButton.on('click', function () {
        drawIsDraw = true;
        renderSwapDraw()
    });
    setDoubleKoButton.on('click', function () {
        drawIsDraw = false;
        renderSwapDraw();
    });

    function renderSwapDraw() {
        setDrawButton.toggle(!drawIsDraw);
        setDoubleKoButton.toggle(drawIsDraw);

        mainTable.find('.btn-draw').toggle(drawIsDraw);
        mainTable.find('.btn-double-ko').toggle(!drawIsDraw);
    }

    function getMatchRowHtml(player1: Player, player2: Player, matchId: string, tableNumber: number) {
        return `
    <tr class="match-row">
    <th scope="row" class="text-center">${tableNumber}</th>
    <td data-related="${player1.id}" class="player-cell">
        <button type="button" data-related="${player1.id}" class="btn-retreat btn btn-secondary">Retirada</button>
        ${player1.name}
        <button type="button" data-related="${player1.id}" class="btn-win btn btn-success float-end">Victoria</button>
    </td>
    <td>
        <button type="button" data-related="${matchId}" class="btn-draw btn btn-warning col-12">Empate</button>
        <button type="button" data-related="${matchId}" class="btn-double-ko btn btn-danger col-12 text-nowrap">Doble KO</button>
    </td>
    <td data-related="${player2.id}" class="player-cell">
        <button type="button" data-related="${player2.id}" class="btn-retreat btn btn-secondary">Retirada</button>
        ${player2.name}
        <button type="button" data-related="${player2.id}" class="btn-win btn btn-success float-end">Victoria</button>
    </td>
    </tr>
`
    }

    renderSwapDraw();
}
