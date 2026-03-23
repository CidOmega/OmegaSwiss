export function setupTournament() {
    let drawIsDraw = false;

    let startTournament = $('#startTournament');
    let roundCountDisplay = $('#roundCountDisplay');
    roundCountDisplay.html('Ronda 1/9');

    let swapDrawContainer = $('#swapDrawContainer');
    let setDrawButton = swapDrawContainer.find('.btn-draw')
    let setDoubleKoButton = swapDrawContainer.find('.btn-double-ko')

    startTournament.show();
    roundCountDisplay.hide();
    startTournament.on('click', () => {
        startTournament.hide();
        roundCountDisplay.show();
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
    }

    renderSwapDraw();
}
