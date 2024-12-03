export class Report {
    constructor(private readonly levels: number[], private readonly minDelta: number = 1, private readonly maxDelta: number = 3) {

    }

    isSafe(): boolean {
        return this.isIncreasingOrder() || this.isDecreasingOrder();
    }

    /**
     * Each level must increase by at least one and at most threee
     */
    private isIncreasingOrder(): boolean {
        return this.levels.every((level, index) => {
            if (index === 0) {
                return true;
            }
            // Must increase by at least minDelta
            return level - this.levels[index - 1] >= this.minDelta
                // And at most maxDelta
                && level - this.levels[index - 1] <= this.maxDelta;
        });

    }

    private isDecreasingOrder(): boolean {
        return this.levels.every((level, index) => {
            if (index === 0) {
                return true;
            }
            // Must decrease by at least minDelta
            return this.levels[index - 1] - level >= this.minDelta
                // And at most maxDelta
                && this.levels[index - 1] - level <= this.maxDelta;
        });
    }
}
