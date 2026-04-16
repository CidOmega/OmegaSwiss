import {setupPlayersController} from "./Controllers/PlayersController.ts";
import {TournamentStorage} from "./Storage/TournamentStorage.ts";
import {CollapseController} from "./Controllers/CollapseController.ts";
import {PlayerStorage} from "./Storage/PlayerStorage.ts";
import {Tournament} from "./Models/Tournament.ts";

export function setupIndex() {
    setupPlayersController();

    let clearTournamentsButton = $('#clearTournaments')
    clearTournamentsButton.on('click', () => {
        TournamentStorage.deleteAll();
        renderTournaments();
    });

    let startTournamentButton = $('#startTournament');
    startTournamentButton.on('click', () => {
        let players = PlayerStorage.GetPlayers();
        let tournament = new Tournament(players);
        TournamentStorage.saveTournament(tournament);

        window.location.href = `./tournament.html?tId=${tournament.createdAt.getTime()}`;
    });

    renderTournaments();
    setInterval(renderTournaments, 2500);

    CollapseController.showPlayers();

    function renderTournaments() {
        let tournamentsTableBody = $('#tournamentsTable').find('tbody');
        tournamentsTableBody.html('');

        let tournaments = TournamentStorage.getAllTournaments();
        for (let t of tournaments) {
            let d = t.tournament.createdAt;
            let ddString = d.getDate().toString().padStart(2, '0');
            let monthString = (d.getMonth() + 1).toString().padStart(2, '0');
            let hhString = d.getHours().toString().padStart(2, '0');
            let mmString = d.getMinutes().toString().padStart(2, '0');
            let ssString = d.getSeconds().toString().padStart(2, '0');
            let dateString = `${ddString}/${monthString}/${d.getFullYear()} ${hhString}:${mmString}:${ssString}h`;
            let roundString = t.tournament.closed
                ? 'Terminado'
                : t.tournament.getRoundText();

            let html = `
            <tr>
                <td>${dateString} - Jugadores: ${t.tournament.players.length} - ${roundString}</td>
                <th scope="row">
                    <a type="button" class="btn btn-primary" href="./tournament.html?tId=${t.tId}">
                        Continuar
                    </a>
                </th>
                <th scope="row">
                    <button type="button" class="btn-delete-tournament btn btn-danger" data-related="${t.tId}">
                        <i class="bi bi-trash"></i>
                    </button>
                </th>
            </tr>
            `
            tournamentsTableBody.append(html);
        }

        tournamentsTableBody.find('.btn-delete-tournament').on('click', (e) => {
            let tId = $(e.currentTarget).attr('data-related')?.toString() ?? '';
            TournamentStorage.deleteByTournamentId(tId);
            renderTournaments();
        })
    }
}

setupIndex();