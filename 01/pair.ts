export class Pair {
    constructor(private leftValue: number, private rightValue: number) {
    }

    distance(): number {
        return Math.abs(this.leftValue - this.rightValue);
    }
}
