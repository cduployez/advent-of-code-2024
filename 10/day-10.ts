import {Input} from '../input';
import {Position} from '../position';

const IMPASSABLE_CHAR: string = '.';

export class Trailhead {
    position: Position;

    /* Number of reachable '9' */
    score: number;

    /* Number of distinct hiking trails */
    rating: number;

    constructor(position: Position, score: number = 0, rating: number = 0) {
        this.position = position;
        this.score = score;
        this.rating = rating;
    }

    static sumScore(trailheads: Trailhead[]): number {
        return trailheads.reduce((sum, trailhead) => sum + trailhead.score, 0);
    }

    static sumRating(trailheads: Trailhead[]): number {
        return trailheads.reduce((sum, trailhead) => sum + trailhead.rating, 0);
    }
}

export class TopographicMap {
    heights: (number | null)[][];

    constructor(heights: (number | null)[][]) {
        this.heights = heights;
    }

    at(x: number, y: number): number | null {
        return this.heights[y][x];
    }

    left(x: number, y: number): number | null {
        return x > 0 ? this.heights[y][x - 1] : null;
    }

    right(x: number, y: number): number | null {
        return x < this.heights[y].length - 1 ? this.heights[y][x + 1] : null;
    }

    up(x: number, y: number): number | null {
        return y > 0 ? this.heights[y - 1][x] : null;
    }

    down(x: number, y: number): number | null {
        return y < this.heights.length - 1 ? this.heights[y + 1][x] : null;
    }

    findTrailheads(): Trailhead[] {
        const zeroPositions = this.heights.map((line, y) => line.map((value, x) => value === 0 ? new Position(x, y) : null))
            .flat()
            .filter(position => position !== null);
        return zeroPositions.map(zeroPosition => this.findTrailhead(zeroPosition));
    }

    findTrailhead(position: Position): Trailhead {
        let currentValue: number = 0;
        let positions: Position[] = this.findNextTrailPosition(currentValue, position);
        currentValue++;
        while (currentValue < 9 && positions.length > 0) {
            let nextPositions: Position[] = [];
            positions.forEach(position => {
                nextPositions.push(...this.findNextTrailPosition(currentValue, position));
            });
            currentValue++;
            positions = nextPositions;
        }
        return new Trailhead(position,
            // Remove non-unique positions to count score
            positions.filter((position, index, array) => array.findIndex(p => p.x === position.x && p.y === position.y) === index).length,
            positions.length);
    }

    findNextTrailPosition(currentValue: number, currentPosition: Position): Position[] {
        const nextPositions: Position[] = [];
        const nextValue = currentValue + 1;
        if (this.left(currentPosition.x, currentPosition.y) === nextValue) {
            nextPositions.push(new Position(currentPosition.x - 1, currentPosition.y));
        }
        if (this.right(currentPosition.x, currentPosition.y) === nextValue) {
            nextPositions.push(new Position(currentPosition.x + 1, currentPosition.y));
        }
        if (this.up(currentPosition.x, currentPosition.y) === nextValue) {
            nextPositions.push(new Position(currentPosition.x, currentPosition.y - 1));
        }
        if (this.down(currentPosition.x, currentPosition.y) === nextValue) {
            nextPositions.push(new Position(currentPosition.x, currentPosition.y + 1));
        }
        return nextPositions;
    }

    displayMap(): void {
        console.log(this.heights.map(line => line.map(value => value ? value.toString() : IMPASSABLE_CHAR).join('')).join('\n'));
    }
}

export class TopographicMapInput extends Input<TopographicMap> {
    parse(): TopographicMap {
        const lines: string[] = this.toText().split('\n');
        const heights: number[][] = lines.map(line => line.split('').map(value => parseInt(value)));
        return new TopographicMap(heights);
    }
}

class Day10 {
    static part1(inputFilePath: string): number {
        const topographicMap = new TopographicMapInput(inputFilePath).parse();
        topographicMap.displayMap();
        const trailheads = topographicMap.findTrailheads();
        console.log(trailheads);
        return Trailhead.sumScore(trailheads);
    }

    static part2(inputFilePath: string): number {
        const topographicMap = new TopographicMapInput(inputFilePath).parse();
        topographicMap.displayMap();
        const trailheads = topographicMap.findTrailheads();
        console.log(trailheads);
        return Trailhead.sumRating(trailheads);
    }
}

const startTime = performance.now();
console.log('Part 1 - Example: ', Day10.part1('example-input.txt')); // 1
console.log('Part 1 - Example: ', Day10.part1('example-input2.txt')); // 2
console.log('Part 1 - Example: ', Day10.part1('example-input3.txt')); // 4
console.log('Part 1 - Example: ', Day10.part1('example-input4.txt')); // 3
console.log('Part 1 - Example: ', Day10.part1('example-input5.txt')); // 3
console.log('Part 1 - Input: ', Day10.part1('puzzle-input.txt')); // 617
console.log('Part 2 - Example: ', Day10.part2('example-part2-input.txt')); // 3
console.log('Part 2 - Example: ', Day10.part2('example-part2-input2.txt')); // 13
console.log('Part 2 - Example: ', Day10.part2('example-part2-input3.txt')); // 227
console.log('Part 2 - Example: ', Day10.part2('example-part2-input4.txt')); // 81
console.log('Part 2 - Input: ', Day10.part2('puzzle-input.txt')); // 1477
const endTime = performance.now();
console.log(`Call to method took ${endTime - startTime} milliseconds`);

