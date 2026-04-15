import {PlayerWithStatistics} from "../Models/Player.ts";
import {Round} from "../Models/Round.ts";
import {MatchResultEnum} from "../Models/MatchResultEnum.ts";
import {TournamentStorage} from "../Storage/TournamentStorage.ts";
import {PlayerStatistics} from "../Models/PlayerStatistics.ts";
import {Tools} from "../Tools.ts";

let initialize = true;

export function setupRound() {
    let roundSection = $('#roundSection');
    let setDrawButton = $('#swapDrawDraw');
    let setDoubleKoButton = $('#swapDrawDoubleKo');

    let mainTable = $('#mainTable');
    let mainTableBody = mainTable.find('tbody');

    let retreatSection = $('#retreatSection');
    let roundRetreatTableBody = $('#roundRetreatTable').find('tbody');

    if (initialize) {
        setDrawButton.on('click', function () {
            roundSection.attr('data-draw-is-draw', 'true');
        });
        setDoubleKoButton.on('click', function () {
            roundSection.attr('data-draw-is-draw', 'false');
        });
        initialize = false;
    }

    function render() {
        let round = TournamentStorage.getRound();
        renderTable(round);
        setMatchStatus(round);
        setButtonsEvents();
        renderButtons();
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
            return true;
        }));

        mainTableBody.find('.btn-double-ko').on('click', modifyRoundGenerator((button, round) => {
            let matchIndex = Number.parseInt(button.attr('data-related') ?? "X");
            let match = round.matches[matchIndex];
            if (!!match) {
                for (let result of match.results) {
                    result.result = MatchResultEnum.Lose;
                }
            }
            return true;
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
            return true;
        }));

        mainTableBody.find('.btn-retreat').on('click', modifyRoundGenerator((button, round) => {
            let playerId = button.attr('data-related') ?? "X";
            let matchIndex = Number.parseInt(button.attr('data-related-match') ?? "X");
            let match = round.matches[matchIndex];
            if (!!match) {
                let playerRetreating = match.results.find(p => p.player.id === playerId);
                if (!!playerRetreating && !round.retreats.find(r => r.id === playerId) && playerId !== Tools.byeId) {
                    round.retreats.push(playerRetreating.player);
                }
            }
            return true;
        }));

        mainTableBody.find('.btn-swap').on('click', modifyRoundGenerator((button, round) => {
            let playerId = button.attr('data-related') ?? "X";
            let matchIndex = Number.parseInt(button.attr('data-related-match') ?? "X");
            let match = round.matches[matchIndex];
            if (!!match) {
                let playerIndex = match.results.findIndex(p => p.player.id === playerId);
                if (playerIndex !== -1) {
                    if (!!round.swaping) {
                        if (round.swaping.matchIndex !== matchIndex || round.swaping.playerIndex !== playerIndex) {
                            // Swap on no same button.
                            round.swap(round.swaping.matchIndex, round.swaping.playerIndex, matchIndex, playerIndex);
                        }

                        // Stop swaping in any case.
                        round.swaping = null;

                        return true;
                    } else {
                        round.swaping = {matchIndex: matchIndex, playerIndex: playerIndex};
                        button.removeClass('btn-secondary')
                        button.addClass('btn-primary active')
                    }
                }
            }
            return false;
        }));
    }

    function renderButtons() {
        $('.bye-row')
            .find('.btn-win,.btn-draw,.btn-double-ko,.btn-bye')
            .prop('disabled', true);
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
            return true;
        }));
    }

    function modifyRoundGenerator(modifyRound: (button: JQuery<HTMLElement>, round: Round) => boolean)
        : (e: JQuery.ClickEvent<HTMLElement, undefined, HTMLElement, HTMLElement>) => void {
        return (e: JQuery.ClickEvent<HTMLElement, undefined, HTMLElement, HTMLElement>) => {
            let round = TournamentStorage.getRound();
            let button = $(e.target);
            while (!button.is('button')) {
                // Some icon or inner element was clicked, search upwards.
                button = button.parent();
                if (button.length === 0) {
                    // No button found.
                    return;
                }
            }

            let doSaveAndRender = modifyRound(button, round);
            if (doSaveAndRender) {
                TournamentStorage.saveRound();
                render();
            }
        };
    }

    function getMatchRowHtml(player1: PlayerWithStatistics, player2: PlayerWithStatistics, matchIndex: number) {
        let rowClass = '';
        if (Tools.containsBye([player1, player2])) {
            rowClass += ' bye-row'
        }

        return `
    <tr class="match-row ${rowClass}">
    <th scope="row" class="text-center">${matchIndex + 1}</th>
    <td data-related="${player1.id}" class="player-cell">
        <button type="button" data-related="${player1.id}" data-related-match="${matchIndex}" class="btn-retreat btn btn-secondary">Retirada</button>
        <button type="button" data-related="${player1.id}" data-related-match="${matchIndex}" class="btn-swap btn btn-secondary"><i class="bi bi-shuffle"></i></button>
        ${player1.name} ${player1.statistics.getKda()}
        <button type="button" data-related="${player1.id}" data-related-match="${matchIndex}" class="btn-win btn btn-success float-end">Victoria</button>
    </td>
    <td>
        <button type="button" data-related="${matchIndex}" class="btn-draw btn btn-warning col-12">Empate</button>
        <button type="button" data-related="${matchIndex}" class="btn-double-ko btn btn-danger col-12 text-nowrap">Doble KO</button>
    </td>
    <td data-related="${player2.id}" class="player-cell">
        <button type="button" data-related="${player2.id}" data-related-match="${matchIndex}" class="btn-retreat btn-bye btn btn-secondary">Retirada</button>
        <button type="button" data-related="${player2.id}" data-related-match="${matchIndex}" class="btn-swap btn-bye btn btn-secondary"><i class="bi bi-shuffle"></i></button>
        ${player2.name} ${player2.statistics.getKda()}
        <button type="button" data-related="${player2.id}" data-related-match="${matchIndex}" class="btn-win btn btn-success float-end">Victoria</button>
    </td>
    </tr>
`
    }

    render();
}
