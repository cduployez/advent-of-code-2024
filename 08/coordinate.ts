export class Coordinate {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    isEqualTo(coordinate: Coordinate): boolean {
        return this.x === coordinate.x && this.y === coordinate.y;
    }

    add(coordinate: Coordinate): Coordinate {
        return new Coordinate(this.x + coordinate.x, this.y + coordinate.y);
    }

    remove(coordinate: Coordinate): Coordinate {
        return new Coordinate(this.x - coordinate.x, this.y - coordinate.y);
    }

    isOutOfBounds(width: number, height: number): boolean {
        return this.x < 0 || this.y < 0 || this.x >= width || this.y >= height;
    }
}
