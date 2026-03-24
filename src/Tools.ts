export const Tools = {
    getRequiredRounds(playersLength: number) {
        return playersLength == 0 ? 0 : Math.ceil(Math.log2(playersLength));
    }
}