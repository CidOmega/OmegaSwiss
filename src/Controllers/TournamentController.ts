export function setupTournament() {
    let drawIsDraw = false;
    
    let swapDrawContainer = $('#swapDrawContainer');
    let setDrawButton = swapDrawContainer.find('.btn-draw')
    let setDoubleKoButton = swapDrawContainer.find('.btn-double-ko')
    
    let roundCountDisplay = $('#roundCountDisplay');
    roundCountDisplay.html('Ronda 1/9');

    setDrawButton.on('click', function(){
        drawIsDraw = true;
        renderSwapDraw()
    })
    setDoubleKoButton.on('click', function(){
        drawIsDraw = false;
        renderSwapDraw();
    })
    
    function renderSwapDraw() {
        setDrawButton.toggle(!drawIsDraw);
        setDoubleKoButton.toggle(drawIsDraw);
    }
    
    renderSwapDraw();
}
