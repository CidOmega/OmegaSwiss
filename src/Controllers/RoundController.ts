import {PlayerWithStatistics} from "../Models/Player.ts";
import {Round} from "../Models/Round.ts";
import {MatchResultEnum} from "../Models/MatchResultEnum.ts";
import {TournamentStorage} from "../Storage/TournamentStorage.ts";
import {PlayerStatistics} from "../Models/PlayerStatistics.ts";

let initialize = true;
let drawIsDraw = false;

export function setupRound() {
    let setDrawButton = $('#swapDrawDraw');
    let setDoubleKoButton = $('#swapDrawDoubleKo');

    let mainTable = $('#mainTable');
    let mainTableBody = mainTable.find('tbody');

    let retreatSection = $('#retreatSection');
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
        let round = TournamentStorage.getRound();
        renderTable(round);
        setMatchStatus(round);
        setButtonsEvents();
        renderSwapDraw();
        renderRetreats(round);
    }

    function renderTable(round: Round) {
        // Efficiency...
        let playersWithStatistics: PlayerWithStatistics[] = TournamentStorage
            .getTournament()
            .getActivePlayers()
            .map(ph => ({...ph.player, statistics: ph.getStatistics()}));
        mainTableBody.html('');
        for (let i = 0; i < round.matches.length; i++) {
            let match = round.matches[i];
            let playerA = playersWithStatistics.find(p => p.id === match.results[0].player.id)
                ?? {...match.results[0].player, statistics: new PlayerStatistics(0, 0, 0)};
            let playerB = playersWithStatistics.find(p => p.id === match.results[1].player.id)
                ?? {...match.results[1].player, statistics: new PlayerStatistics(0, 0, 0)};
            mainTableBody.append(getMatchRowHtml(playerA, playerB, i));
        }
    }

    function setMatchStatus(round: Round) {
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
        mainTableBody.find('.btn-draw').on('click', modifyRoundGenerator((button, round) => {
            let matchIndex = Number.parseInt(button.attr('data-related') ?? "X");
            let match = round.matches[matchIndex];
            if (!!match) {
                for (let result of match.results) {
                    result.result = MatchResultEnum.Draw;
                }
            }
        }));

        mainTableBody.find('.btn-double-ko').on('click', modifyRoundGenerator((button, round) => {
            let matchIndex = Number.parseInt(button.attr('data-related') ?? "X");
            let match = round.matches[matchIndex];
            if (!!match) {
                for (let result of match.results) {
                    result.result = MatchResultEnum.Lose;
                }
            }
        }));

        mainTableBody.find('.btn-win').on('click', modifyRoundGenerator((button, round) => {
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
        }));

        mainTableBody.find('.btn-retreat').on('click', modifyRoundGenerator((button, round) => {
            let playerId = button.attr('data-related') ?? "X";
            let matchIndex = Number.parseInt(button.attr('data-related-match') ?? "X");
            let match = round.matches[matchIndex];
            if (!!match) {
                let playerRetreating = match.results.find(p => p.player.id === playerId);
                if (!!playerRetreating && !round.retreats.find(r => r.id === playerId)) {
                    round.retreats.push(playerRetreating.player);
                }
            }
        }));
    }

    function renderSwapDraw() {
        setDrawButton.toggle(!drawIsDraw);
        setDoubleKoButton.toggle(drawIsDraw);

        mainTable.find('.btn-draw').toggle(drawIsDraw);
        mainTable.find('.btn-double-ko').toggle(!drawIsDraw);
    }

    function renderRetreats(round: Round) {
        if (round.retreats.length === 0) {
            retreatSection.hide();
            return;
        }

        retreatSection.show();
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


        $('.btn-cancel-retreat').on('click', modifyRoundGenerator((button, round) => {
            let playerIndex = Number.parseInt(button.attr('data-related') ?? "X");
            round.retreats.splice(playerIndex, 1);
        }));
    }

    function modifyRoundGenerator(modifyRound: (button: JQuery<HTMLElement>, round: Round) => void)
        : (e: JQuery.ClickEvent<HTMLElement, undefined, HTMLElement, HTMLElement>) => void {
        return (e: JQuery.ClickEvent<HTMLElement, undefined, HTMLElement, HTMLElement>) => {
            let round = TournamentStorage.getRound();
            let button = $(e.target);
            modifyRound(button, round);
            TournamentStorage.saveRound();
            render();
        };
    }

    function getMatchRowHtml(player1: PlayerWithStatistics, player2: PlayerWithStatistics, matchIndex: number) {
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
