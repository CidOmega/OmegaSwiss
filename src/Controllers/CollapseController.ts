import {Collapse} from "bootstrap";

export const CollapseController = {
    togglePlayers(toggle: boolean | undefined = undefined) {
        toggleElement('collapsePlayers', toggle);
    },
    toggleRound(toggle: boolean | undefined = undefined) {
        toggleElement('collapseRound', toggle);
    },
    toggleRanking(toggle: boolean | undefined = undefined) {
        toggleElement('collapseRanking', toggle);
    },
    showPlayers() {
        this.togglePlayers(true);
        this.toggleRound(false);
        this.toggleRanking(false);
    },
    showRound() {
        this.togglePlayers(false);
        this.toggleRound(true);
        this.toggleRanking(false);
    },
    showRanking() {
        this.togglePlayers(false);
        this.toggleRound(false);
        this.toggleRanking(true);
    },
}

function toggleElement(elementId: string, toggle: boolean | undefined = undefined) {
    let element = document.getElementById(elementId)!;
    let collapse = Collapse.getOrCreateInstance(element, {toggle: false});
    if (toggle === undefined) {
        collapse.toggle();
    } else if (toggle) {
        collapse.show();
    } else {
        collapse.hide();
    }
}