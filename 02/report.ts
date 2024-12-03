export class Report {
    constructor(private readonly levels: number[],
                private readonly nbRemovable: number,
                private readonly minDelta: number = 1,
                private readonly maxDelta: number = 3) {

    }

    isSafe(levels: number[] = this.levels, nbRemoved: number = 0): boolean {
        if (this.isIncreasingOrder(levels) || this.isDecreasingOrder(levels)) {
            return true;
        }
        if (this.nbRemovable > nbRemoved) {
            const levelCopies = this.toLevelCopies();
            return levelCopies.some(levels => this.isSafe(levels, nbRemoved + 1));
        }
    }

    toLevelCopies(): number[][] {
        return this.levels.map((level, index) => {
            const copy = [...this.levels];
            copy.splice(index, 1);
            return copy;
        });
    }

    /**
     * Each level must increase by at least one and at most threee
     */
    private isIncreasingOrder(levels: number[]): boolean {
        return levels.every((level, index) => {
            if (index === 0) {
                return true;
            }
            // Must increase by at least minDelta
            return level - levels[index - 1] >= this.minDelta
                // And at most maxDelta
                && level - levels[index - 1] <= this.maxDelta;
        });
    }

    private isDecreasingOrder(levels: number[]): boolean {
        return levels.every((level, index) => {
            if (index === 0) {
                return true;
            }
            // Must decrease by at least minDelta
            return levels[index - 1] - level >= this.minDelta
                // And at most maxDelta
                && levels[index - 1] - level <= this.maxDelta;
        });
    }
}
