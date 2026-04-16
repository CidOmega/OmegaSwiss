import {Collapse} from "bootstrap";

export abstract class CollapseController {
    // Index
    static togglePlayers(toggle: boolean | undefined = undefined) {
        CollapseController.toggleElement('collapsePlayers', toggle);
    }

    static toggleTournaments(toggle: boolean | undefined = undefined) {
        CollapseController.toggleElement('collapseTournaments', toggle);
    }

    static showPlayers() {
        CollapseController.togglePlayers(true);
        CollapseController.toggleTournaments(false);
    }

    static showTournaments() {
        CollapseController.togglePlayers(false);
        CollapseController.toggleTournaments(true);
    }

    // Run Tournament
    static toggleRound(toggle: boolean | undefined = undefined) {
        CollapseController.toggleElement('collapseRound', toggle);
    }

    static toggleRanking(toggle: boolean | undefined = undefined) {
        CollapseController.toggleElement('collapseRanking', toggle);
    }

    static showRound() {
        CollapseController.togglePlayers(false);
        CollapseController.toggleRound(true);
        CollapseController.toggleRanking(false);
    }

    static showRanking() {
        CollapseController.togglePlayers(false);
        CollapseController.toggleRound(false);
        CollapseController.toggleRanking(true);
    }

    // Master
    static toggleElement(elementId: string, toggle: boolean | undefined = undefined) {
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
}

