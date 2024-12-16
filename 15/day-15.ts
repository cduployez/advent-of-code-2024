import {Input} from '../input';
import {Position} from '../position';

enum MoveEnum {
    LEFT = '<',
    RIGHT = '>',
    UP = '^',
    DOWN = 'v'
}

enum MapItemEnum {
    WALL = '#',
    OBJECT = 'O',
    EMPTY = '.',
    ROBOT = '@'
}

class MapItem {
    constructor(public readonly type: MapItemEnum) {
    }

    move(moveEnum: MoveEnum, map: Map): boolean {
        switch (moveEnum) {
            case MoveEnum.UP:
                return this.moveUp(map);
            case MoveEnum.DOWN:
                return this.moveDown(map);
            case MoveEnum.LEFT:
                return this.moveLeft(map);
            case MoveEnum.RIGHT:
                return this.moveRight(map);
        }
        return false;
    }

    moveUp(map: Map): boolean {
        return false;
    }

    moveDown(map: Map): boolean {
        return false;
    }

    moveLeft(map: Map): boolean {
        return false;
    }

    moveRight(map: Map): boolean {
        return false;
    }

    gpsCoordinates(): number {
        return 0;
    }
}

class MovableItem extends MapItem {
    constructor(public readonly type: MapItemEnum, public readonly position: Position) {
        super(type);
    }

    override moveUp(map: Map): boolean {
        if (this.position.y > 0) {
            const item = map.findMapItemAt(this.position.x, this.position.y - 1);
            if (item === null || item.moveUp(map)) {
                this.position.y--;
                return true;
            }
        }
        return false;
    }

    override moveDown(map: Map): boolean {
        if (this.position.y < map.grid.length - 1) {
            const item = map.findMapItemAt(this.position.x, this.position.y + 1);
            if (item === null || item.moveDown(map)) {
                this.position.y++;
                return true;
            }
        }
        return false;
    }

    override moveLeft(map: Map): boolean {
        if (this.position.x > 0) {
            const item = map.findMapItemAt(this.position.x - 1, this.position.y);
            if (item === null || item.moveLeft(map)) {
                this.position.x--;
                return true;
            }
        }
        return false;
    }

    override moveRight(map: Map): boolean {
        if (this.position.x < map.grid[0].length - 1) {
            const item = map.findMapItemAt(this.position.x + 1, this.position.y);
            if (item === null || item.moveRight(map)) {
                this.position.x++;
                return true;
            }
        }
        return false;
    }

    override gpsCoordinates(): number {
        return this.position.y * 100 + this.position.x;
    }
}

class MapObject extends MovableItem {
    constructor(position: Position) {
        super(MapItemEnum.OBJECT, position);
    }
}

class Robot extends MovableItem {
    constructor(public position: Position = new Position(0, 0)) {
        super(MapItemEnum.ROBOT, position);
    }
}

class Wall extends MapItem {

    static readonly instance = new Wall();

    private constructor() {
        super(MapItemEnum.WALL);
    }
}

class Map {
    grid: MapItemEnum[][];
    robot: Robot;
    objects: MapObject[];


    constructor(grid: MapItemEnum[][], robot: Robot, objects: MapObject[]) {
        this.grid = grid;
        this.robot = robot;
        this.objects = objects;
    }

    objectsGpsCoordinates(): number {
        return this.objects.map(obj => obj.gpsCoordinates()).reduce((acc, val) => acc + val, 0);
    }

    findRobotAt(x: number, y: number): Robot | null {
        return this.robot.position.x === x && this.robot.position.y === y ? this.robot : null;
    }

    findObjectAt(x: number, y: number): MapObject | null {
        return this.objects.find(obj => obj.position.x === x && obj.position.y === y) || null;
    }

    findWallAt(x: number, y: number): Wall | null {
        return this.grid[y][x] === MapItemEnum.WALL ? Wall.instance : null;
    }

    findMapItemAt(x: number, y: number): MapItem | null {
        return this.findRobotAt(x, y) || this.findObjectAt(x, y) || this.findWallAt(x, y) || null;
    }

    displayGridAndRobot(): void {
        const lines: string[][] = this.grid.map(row => row.map(item => item));
        lines[this.robot.position.y][this.robot.position.x] = MapItemEnum.ROBOT;
        this.objects.forEach(obj => {
            lines[obj.position.y][obj.position.x] = MapItemEnum.OBJECT;
        });
        lines.forEach(line => console.log(line.join('')));
    }
}

class Game {
    map: Map;
    moves: MoveEnum[];

    constructor(map: Map, moves: MoveEnum[]) {
        this.map = map;
        this.moves = moves;
    }

    displayGridAndMoves(): void {
        this.displayGrid();
        console.log('');
        console.log(this.moves.join(''));
    }

    displayGrid(): void {
        this.map.displayGridAndRobot();
    }

    performMoves() {
        this.moves.forEach(move => {
            console.log(`Move ${move}:`);
            this.map.robot.move(move, this.map);
            this.displayGrid();
        });
    }

    objectsGpsCoordinates() {
        return this.map.objectsGpsCoordinates();
    }
}

class GameInput extends Input<Game> {
    parse(): Game {
        const lines: string[] = this.toText().split('\n');
        const gridLines: string[] = [];
        while (lines[0].length > 0) {
            const char = lines.shift();
            if (char) {
                gridLines.push(char);
            }
        }
        const moveLines = lines.filter(l => l.length > 0);
        // Map
        const grid: MapItemEnum[][] = [];
        let robot: Robot = new Robot();
        const objects: MapObject[] = [];
        gridLines.forEach((line, y) => {
            const row: MapItemEnum[] = [];
            line.split('').forEach((char, x) => {
                    if (char === MapItemEnum.ROBOT) {
                        robot.position = new Position(x, y);
                        row.push(MapItemEnum.EMPTY);
                    } else if (char === MapItemEnum.OBJECT) {
                        objects.push(new MapObject(new Position(x, y)));
                        row.push(MapItemEnum.EMPTY);
                    } else {
                        row.push(char as MapItemEnum);
                    }
                }
            )
            ;
            grid.push(row);
        });
        const map = new Map(grid, robot, objects);
        // Moves
        const moves: MoveEnum[] = moveLines.join('').split('') as MoveEnum[];
        // Game
        return new Game(map, moves);
    }
}

class Day15 {
    static part1(inputFilePath: string): number {
        const game: Game = new GameInput(inputFilePath).parse();
        game.displayGridAndMoves();
        game.performMoves();
        return game.objectsGpsCoordinates();
    }

    static part2(inputFilePath: string): number {
        return 0;
    }
}

const startTime = performance.now();
// console.log('Part 1 - Example: ', Day15.part1('simple-input.txt')); // 2028
// console.log('Part 1 - Example: ', Day15.part1('example-input.txt')); // 10092
console.log('Part 1 - Input: ', Day15.part1('puzzle-input.txt')); //
// console.log('Part 2 - Input: ', Day15.part2('example-input.txt')); //
// console.log('Part 2 - Input: ', Day15.part2('puzzle-input.txt')); //
const endTime = performance.now();
console.log(`Call to method took ${endTime - startTime} milliseconds`);

