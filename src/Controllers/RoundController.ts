import {Player} from "../Models/Player.ts";
import {Round} from "../Models/Round.ts";
import {MatchResultEnum} from "../Models/MatchResultEnum.ts";

let initialize = true;

export function setupRound(round: Round) {
    let drawIsDraw = false;

    let swapDrawContainer = $('#swapDrawContainer');
    let setDrawButton = swapDrawContainer.find('.btn-draw')
    let setDoubleKoButton = swapDrawContainer.find('.btn-double-ko')

    let mainTable = $('#mainTable');
    let mainTableBody = mainTable.find('tbody');
    let roundRetreatTableBody = $('#roundRetreatTable').find('tbody');

    if (initialize) {
        setDrawButton.on('click', function () {
            drawIsDraw = true;
            renderSwapDraw()
        });
        setDoubleKoButton.on('click', function () {
            drawIsDraw = false;
            renderSwapDraw();
        });
        initialize = false;
    }

    function render() {
        renderTable();
        setMatchStatus();
        setButtonsEvents();
        renderSwapDraw();
        renderRetreats();
    }

    function renderTable() {
        mainTableBody.html('');
        for (let i = 0; i < round.matches.length; i++) {
            let match = round.matches[i];
            mainTableBody.append(getMatchRowHtml(match.results[0].player, match.results[1].player, i));
        }
    }

    function setMatchStatus() {
        for (let match of round.matches) {
            for (let result of match.results) {
                let playerCell = $(`[data-related=${result.player.id}].player-cell`);
                switch (result.result) {
                    case MatchResultEnum.Win:
                        playerCell.addClass('table-success');
                        break;
                    case MatchResultEnum.Lose:
                        playerCell.addClass('table-danger');
                        break;
                    case MatchResultEnum.Draw:
                        playerCell.addClass('table-warning');
                        break;

                }
            }
        }
    }

    function setButtonsEvents() {
        mainTableBody.find('.btn-draw').on('click', function (e) {
            let matchIndex = Number.parseInt($(e.target).attr('data-related') ?? "X");
            let match = round.matches[matchIndex];
            if (!!match) {
                for (let result of match.results) {
                    result.result = MatchResultEnum.Draw;
                }
            }
            render();
        });

        mainTableBody.find('.btn-double-ko').on('click', function (e) {
            let matchIndex = Number.parseInt($(e.target).attr('data-related') ?? "X");
            let match = round.matches[matchIndex];
            if (!!match) {
                for (let result of match.results) {
                    result.result = MatchResultEnum.Lose;
                }
            }
            render();
        });

        mainTableBody.find('.btn-win').on('click', function (e) {
            let button = $(e.target);
            let playerId = button.attr('data-related') ?? "X";
            let matchIndex = Number.parseInt(button.attr('data-related-match') ?? "X");
            let match = round.matches[matchIndex];
            if (!!match) {
                for (let result of match.results) {
                    if (result.player.id === playerId) {
                        result.result = MatchResultEnum.Win;
                    } else {
                        result.result = MatchResultEnum.Lose;
                    }
                }
            }
            render();
        });

        mainTableBody.find('.btn-retreat').on('click', function (e) {
            let button = $(e.target);
            let playerId = button.attr('data-related') ?? "X";
            let matchIndex = Number.parseInt(button.attr('data-related-match') ?? "X");
            let match = round.matches[matchIndex];
            if (!!match) {
                for (let result of match.results) {
                    if (result.player.id === playerId) {
                        round.retreats.push(result.player);

                        // Enforce not repeated players
                        let set = new Set<Player>(round.retreats);
                        round.retreats = Array.from(set.values());
                    }
                }
            }
            render();
        });
    }

    function renderSwapDraw() {
        setDrawButton.toggle(!drawIsDraw);
        setDoubleKoButton.toggle(drawIsDraw);

        mainTable.find('.btn-draw').toggle(drawIsDraw);
        mainTable.find('.btn-double-ko').toggle(!drawIsDraw);
    }

    function renderRetreats() {
        roundRetreatTableBody.html('')
        for (let i = 0; i < round.retreats.length; i++) {
            let retreat = round.retreats[i];
            let row = `
            <tr>
                <td>${retreat.name}</td>
                <th scope="row">
                    <button type="button" class="btn-cancel-retreat btn btn-danger" data-related="${i}">
                        Cancelar
                    </button>
                </th>
            </tr>
            `
            roundRetreatTableBody.append(row);
        }

        $('.btn-cancel-retreat').on('click', function (e) {
            let playerIndex = Number.parseInt($(e.target).attr('data-related') ?? "X");
            round.retreats.splice(playerIndex, 1);
            render();
        })
    }

    function getMatchRowHtml(player1: Player, player2: Player, matchIndex: number) {
        return `
    <tr class="match-row">
    <th scope="row" class="text-center">${matchIndex + 1}</th>
    <td data-related="${player1.id}" class="player-cell">
        <button type="button" data-related="${player1.id}" data-related-match="${matchIndex}" class="btn-retreat btn btn-secondary">Retirada</button>
        ${player1.name} ${player1.statistics.getKda()}
        <button type="button" data-related="${player1.id}" data-related-match="${matchIndex}" class="btn-win btn btn-success float-end">Victoria</button>
    </td>
    <td>
        <button type="button" data-related="${matchIndex}" class="btn-draw btn btn-warning col-12">Empate</button>
        <button type="button" data-related="${matchIndex}" class="btn-double-ko btn btn-danger col-12 text-nowrap">Doble KO</button>
    </td>
    <td data-related="${player2.id}" class="player-cell">
        <button type="button" data-related="${player2.id}" data-related-match="${matchIndex}" class="btn-retreat btn btn-secondary">Retirada</button>
        ${player2.name} ${player2.statistics.getKda()}
        <button type="button" data-related="${player2.id}" data-related-match="${matchIndex}" class="btn-win btn btn-success float-end">Victoria</button>
    </td>
    </tr>
`
    }

    render();
}
