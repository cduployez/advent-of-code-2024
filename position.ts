export class Position {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    copy(): Position {
        return new Position(this.x, this.y);
    }
}
