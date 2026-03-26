export const Tools = {
    getRequiredRounds(playersLength: number) {
        return playersLength == 0 ? 0 : Math.ceil(Math.log2(playersLength));
    },
    shuffle<T>(array: T[]) {
        let currentIndex = array.length;

        // While there remain elements to shuffle...
        while (currentIndex != 0) {

            // Pick a remaining element...
            let randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            // And swap it with the current element.
            [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        }
    },
    deleteFromArray<T>(array: T[], element: T) {
        let index = array.indexOf(element);
        array.splice(index, 1);
    }
}