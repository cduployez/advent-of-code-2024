import {Input} from '../input';
import {Position} from '../position';

enum CellEnum {
    EMPTY = '.',
    WALL = '#',
    START = 'S',
    END = 'E',
    REINDEER = 'R'
}

enum DirectionEnum {
    EAST = '>',
    WEST = '<',
    NORTH = '^',
    SOUTH = 'v'
}

const DIRECTIONS = [DirectionEnum.EAST, DirectionEnum.SOUTH, DirectionEnum.WEST, DirectionEnum.NORTH];

class Cache {
    static takenPathScores: number[][] = [];
}

class Path {
    position: Position;
    direction: DirectionEnum;


    constructor(position: Position, direction: DirectionEnum) {
        this.position = position.copy();
        this.direction = direction;
    }
}

class Reindeer {
    position: Position;
    direction: DirectionEnum;
    score: number;
    takenPathsArray: Path[][];

    constructor(position: Position, direction: DirectionEnum = DirectionEnum.EAST, takenPathsArray: Path[][], score: number = 0) {
        this.position = position;
        this.direction = direction;
        this.takenPathsArray = takenPathsArray;
        takenPathsArray.push([]);
        this.score = score;
    }

    get lastTakenPaths(): Path[] {
        return this.takenPathsArray[this.takenPathsArray.length - 1];
    }

    displayPath(maze: Maze) {
        const grid: string[][] = maze.grid.map(row => row.map(cell => cell));
        grid[maze.startPosition.y][maze.startPosition.x] = CellEnum.START;
        grid[maze.endPosition.y][maze.endPosition.x] = CellEnum.END;
        grid[this.position.y][this.position.x] = CellEnum.REINDEER;
        for (const takenPaths of this.takenPathsArray) {
            for (const takenPath of takenPaths) {
                grid[takenPath.position.y][takenPath.position.x] = takenPath.direction;
            }
        }
        console.log('');
        grid.forEach(row => console.log(row.join('')));
    }

    findOptions(grid: CellEnum[][]): DirectionEnum[] {
        const options: DirectionEnum[] = [];
        if (this.canMoveEast(grid)) {
            options.push(DirectionEnum.EAST);
        }
        if (this.canMoveWest(grid)) {
            options.push(DirectionEnum.WEST);
        }
        if (this.canMoveNorth(grid)) {
            options.push(DirectionEnum.NORTH);
        }
        if (this.canMoveSouth(grid)) {
            options.push(DirectionEnum.SOUTH);
        }
        return options;
    }

    moveForward(grid: CellEnum[][]): void {
        if (this.canMoveForward(grid)) {
            switch (this.direction) {
                case DirectionEnum.EAST:
                    this.moveEast();
                    break;
                case DirectionEnum.WEST:
                    this.moveWest();
                    break;
                case DirectionEnum.NORTH:
                    this.moveNorth();
                    break;
                case DirectionEnum.SOUTH:
                    this.moveSouth();
                    break;
            }
        }
    }

    findPath(x: number, y: number): Path | undefined {
        for (let takenPaths of this.takenPathsArray) {
            for (let takenPath of takenPaths) {
                if (takenPath.position.x === x && takenPath.position.y === y) {
                    return takenPath;
                }
            }
        }
    }

    canMoveEast(grid: CellEnum[][]): boolean {
        return this.position.x + 1 < grid[this.position.x].length &&
            grid[this.position.y][this.position.x + 1] !== CellEnum.WALL &&
            this.findPath(this.position.x + 1, this.position.y) === undefined;
    }

    canMoveWest(grid: CellEnum[][]): boolean {
        return this.position.x - 1 >= 0 &&
            grid[this.position.y][this.position.x - 1] !== CellEnum.WALL &&
            this.findPath(this.position.x - 1, this.position.y) === undefined;
    }

    canMoveNorth(grid: CellEnum[][]): boolean {
        return this.position.y - 1 >= 0 &&
            grid[this.position.y - 1][this.position.x] !== CellEnum.WALL &&
            this.findPath(this.position.x, this.position.y - 1) === undefined;
    }

    canMoveSouth(grid: CellEnum[][]): boolean {
        return this.position.y + 1 < grid.length &&
            grid[this.position.y + 1][this.position.x] !== CellEnum.WALL &&
            this.findPath(this.position.x, this.position.y + 1) === undefined;
    }

    moveEast(): void {
        this.direction = DirectionEnum.EAST;
        this.lastTakenPaths.push(new Path(this.position, this.direction));
        this.position.x++;
        this.score++;
    }

    moveWest(): void {
        this.direction = DirectionEnum.WEST;
        this.lastTakenPaths.push(new Path(this.position, this.direction));
        this.position.x--;
        this.score++;
    }

    moveNorth(): void {
        this.direction = DirectionEnum.NORTH;
        this.lastTakenPaths.push(new Path(this.position, this.direction));
        this.position.y--;
        this.score++;
    }

    moveSouth(): void {
        this.direction = DirectionEnum.SOUTH;
        this.lastTakenPaths.push(new Path(this.position, this.direction));
        this.position.y++;
        this.score++;
    }

    rotateRight(nbTimes: number = 1): void {
        for (let i = 0; i < nbTimes; i++) {
            this.direction = this.rightDirection();
            this.score += 1000;
        }
    }

    rotateLeft(nbTimes: number = 1): void {
        for (let i = 0; i < nbTimes; i++) {
            this.direction = this.leftDirection();
            this.score += 1000;
        }
    }

    leftDirection(currentDirection: DirectionEnum = this.direction): DirectionEnum {
        return DIRECTIONS[(DIRECTIONS.indexOf(currentDirection) + (DIRECTIONS.length - 1)) % DIRECTIONS.length];
    }

    rightDirection(currentDirection: DirectionEnum = this.direction): DirectionEnum {
        return DIRECTIONS[(DIRECTIONS.indexOf(currentDirection) + 1) % DIRECTIONS.length];
    }

    /**
     * Use shortest path between rotateRight() and rotateLeft() to change direction
     */
    rotateTo(direction: DirectionEnum): void {
        if (this.direction === direction) {
            return;
        }
        let rightCount = 0;
        let rightDirection = this.direction;
        while (rightDirection !== direction) {
            rightDirection = this.rightDirection(rightDirection);
            rightCount++;
        }
        let leftCount = 0;
        let leftDirection = this.direction;
        while (leftDirection !== direction) {
            leftDirection = this.leftDirection(leftDirection);
            leftCount++;
        }
        if (rightCount < leftCount) {
            this.rotateRight(rightCount);
        } else {
            this.rotateLeft(leftCount);
        }
    }

    copy() {
        return new Reindeer(this.position.copy(), this.direction, [...this.takenPathsArray], this.score);
    }

    private canMoveForward(grid: CellEnum[][]) {
        switch (this.direction) {
            case DirectionEnum.EAST:
                return this.canMoveEast(grid);
            case DirectionEnum.WEST:
                return this.canMoveWest(grid);
            case DirectionEnum.NORTH:
                return this.canMoveNorth(grid);
            case DirectionEnum.SOUTH:
                return this.canMoveSouth(grid);
            default:
                return false;
        }
    }

    private oppositeDirection(direction: DirectionEnum) {
        switch (direction) {
            case DirectionEnum.EAST:
                return DirectionEnum.WEST;
            case DirectionEnum.WEST:
                return DirectionEnum.EAST;
            case DirectionEnum.NORTH:
                return DirectionEnum.SOUTH;
            case DirectionEnum.SOUTH:
                return DirectionEnum.NORTH;
            default:
                return direction;
        }
    }
}

class Maze {
    readonly grid: CellEnum[][];
    readonly startPosition: Position;
    readonly endPosition: Position;
    reindeers: Reindeer[] = [];

    constructor(grid: CellEnum[][], startPosition: Position, endPosition: Position, direction: DirectionEnum) {
        this.grid = grid;
        this.startPosition = startPosition;
        this.endPosition = endPosition;
        this.reindeers.push(new Reindeer(startPosition.copy(), direction, [], 0));
    }

    displayMaze(): void {
        const lines: string[][] = this.grid.map(l => l.map(c => c));
        lines[this.startPosition.y][this.startPosition.x] = CellEnum.START;
        lines[this.endPosition.y][this.endPosition.x] = CellEnum.END;
        console.log('');
        lines.forEach(l => console.log(l.join('')));
    }

    findPaths(): number[] {
        let nbLoops: number = 0;
        const scores: number[] = [];
        while (this.reindeers.length > 0) {
            const reindeer = this.reindeers.pop()!;
            const directionOptions = reindeer.findOptions(this.grid);
            if (directionOptions.length === 0) {
                // console.log(`Dead end at position (${reindeer.position.x}, ${reindeer.position.y}) with direction ${reindeer.direction}`);
            } else {
                for (const directionOption of directionOptions) {
                    const newReindeer = reindeer.copy();
                    newReindeer.rotateTo(directionOption);
                    newReindeer.moveForward(this.grid);
                    if (this.reachedEndPosition(reindeer)) {
                        scores.push(reindeer.score);
                        console.log(`Reached end position with score ${reindeer.score}`);
                        // reindeer.displayPath(this);
                    } else if (Cache.takenPathScores[newReindeer.position.y][newReindeer.position.x] !== null && newReindeer.score >= Cache.takenPathScores[newReindeer.position.y][newReindeer.position.x]) {
                        console.log(`Giving up path at position (${newReindeer.position.x}, ${newReindeer.position.y}) with direction ${newReindeer.direction} and score ${newReindeer.score}, which is higher than current score ${Cache.takenPathScores[newReindeer.position.y][newReindeer.position.x]}`);
                    } else if (scores.length === 0 || newReindeer.score < Math.min(...scores)) {
                        if (nbLoops % 10000 === 0) {
                            console.log(`Reindeer is at position (${newReindeer.position.x}, ${newReindeer.position.y}) with direction ${newReindeer.direction} and score ${newReindeer.score}`);
                            // newReindeer.displayPath(this);
                        }
                        Cache.takenPathScores[newReindeer.position.y][newReindeer.position.x] = newReindeer.score;
                        this.reindeers.push(newReindeer);
                    } else {
                        console.log(`Search stopped with score ${newReindeer.score} at position (${newReindeer.position.x}, ${newReindeer.position.y}) with direction ${newReindeer.direction}`);
                    }
                }
            }
            nbLoops++;
        }
        return scores;
    }

    private reachedEndPosition(reindeer: Reindeer) {
        return reindeer.position.x === this.endPosition.x && reindeer.position.y === this.endPosition.y;
    }
}

class MazeInput extends Input<Maze> {
    parse(): Maze {
        const lines = this.toText().split('\n').filter(line => line.length > 0);
        let startPosition: Position | undefined;
        let endPosition: Position | undefined;
        const grid: CellEnum[][] = [];
        lines.forEach((line, y) => {
            const row: CellEnum[] = [];
            line.split('').forEach((char, x) => {
                if (char === CellEnum.START) {
                    startPosition = new Position(x, y);
                    row.push(CellEnum.EMPTY);
                } else if (char === CellEnum.END) {
                    endPosition = new Position(x, y);
                    row.push(CellEnum.EMPTY);
                } else {
                    row.push(char as CellEnum);
                }
            });
            grid.push(row);
        });
        Cache.takenPathScores = grid.map(row => row.map(() => Infinity));
        return new Maze(grid, startPosition!, endPosition!, DirectionEnum.EAST);
    }
}

class Day16 {
    static part1(inputFilePath: string): number {
        const maze = new MazeInput(inputFilePath).parse();
        maze.displayMaze();
        const scores = maze.findPaths();
        return Math.min(...scores);
    }

    static part2(inputFilePath: string): number {
        return 0;
    }
}

const startTime = performance.now();
// console.log('Part 1 - Example: ', Day16.part1('example-input.txt')); // 7036
// console.log('Part 1 - Example2: ', Day16.part1('example-input2.txt')); // 11048
console.log('Part 1 - Puzzle: ', Day16.part1('puzzle-input.txt')); //
// console.log('Part 2 - Example: ', Day16.part2('example-input.txt')); //
// console.log('Part 2 - Puzzle: ', Day16.part2('puzzle-input.txt')); //
const endTime = performance.now();
console.log(`Call to method took ${endTime - startTime} milliseconds`);

