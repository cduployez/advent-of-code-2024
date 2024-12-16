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

abstract class MapItem {
    constructor(public readonly type: MapItemEnum, public readonly width: number) {
    }

    toDisplayChar(): string {
        return new Array(this.width).fill(this.type).join('');
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

    canMoveUp(map: Map): boolean {
        return false;
    }

    moveUp(map: Map): boolean {
        return false;
    }

    canMoveDown(map: Map): boolean {
        return false;
    }

    moveDown(map: Map): boolean {
        return false;
    }

    canMoveLeft(map: Map): boolean {
        return false;
    }

    moveLeft(map: Map): boolean {
        return false;
    }

    canMoveRight(map: Map): boolean {
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
    constructor(type: MapItemEnum, width: number, public startPosition: Position) {
        super(type, width);
    }

    get endX(): number {
        return this.startPosition.x + this.width - 1;
    }

    override canMoveUp(map: Map): boolean {
        if (this.startPosition.y > 0) {
            const items = map.findMapItemsBetween(this.startPosition.x, this.endX, this.startPosition.y - 1).filter(i => i !== this)
                // Filter non unique
                .filter((item, index, self) => self.indexOf(item) === index);
            return items.every(item => item.canMoveUp(map));
        }
        return false;
    }

    override moveUp(map: Map): boolean {
        if (this.canMoveUp(map)) {
            const items = map.findMapItemsBetween(this.startPosition.x, this.endX, this.startPosition.y - 1).filter(i => i !== this)
                // Filter non unique
                .filter((item, index, self) => self.indexOf(item) === index);
            items.forEach(item => item.moveUp(map));
            this.startPosition.y--;
            return true;
        }
        return false;
    }

    override canMoveDown(map: Map): boolean {
        if (this.startPosition.y < map.grid.length - 1) {
            const items = map.findMapItemsBetween(this.startPosition.x, this.endX, this.startPosition.y + 1).filter(i => i !== this)
                // Filter non unique
                .filter((item, index, self) => self.indexOf(item) === index);
            return items.every(item => item.canMoveDown(map));
        }
        return false;
    }

    override moveDown(map: Map): boolean {
        if (this.canMoveDown(map)) {
            const items = map.findMapItemsBetween(this.startPosition.x, this.endX, this.startPosition.y + 1).filter(i => i !== this)
                // Filter non unique
                .filter((item, index, self) => self.indexOf(item) === index);
            items.forEach(item => item.moveDown(map));
            this.startPosition.y++;
            return true;
        }
        return false;
    }

    override canMoveLeft(map: Map): boolean {
        if (this.startPosition.x > 0) {
            const items = map.findMapItemsBetween(this.startPosition.x - 1, this.endX - 1, this.startPosition.y).filter(i => i !== this).filter(i => i !== this)
                // Filter non unique
                .filter((item, index, self) => self.indexOf(item) === index);
            return items.every(item => item.canMoveLeft(map));
        }
        return false;
    }

    override moveLeft(map: Map): boolean {
        if (this.canMoveLeft(map)) {
            const items = map.findMapItemsBetween(this.startPosition.x - 1, this.endX - 1, this.startPosition.y).filter(i => i !== this).filter(i => i !== this)
                // Filter non unique
                .filter((item, index, self) => self.indexOf(item) === index);
            items.forEach(item => item.moveLeft(map));
            this.startPosition.x--;
            return true;
        }
        return false;
    }

    override canMoveRight(map: Map): boolean {
        if (this.startPosition.x < map.grid[0].length - this.width) {
            const items = map.findMapItemsBetween(this.startPosition.x + 1, this.endX + 1, this.startPosition.y).filter(i => i !== this)
                // Filter non unique
                .filter((item, index, self) => self.indexOf(item) === index);
            return items.every(item => item.canMoveRight(map));
        }
        return false;
    }

    override moveRight(map: Map): boolean {
        if (this.canMoveRight(map)) {
            const items = map.findMapItemsBetween(this.startPosition.x + 1, this.endX + 1, this.startPosition.y).filter(i => i !== this)
                // Filter non unique
                .filter((item, index, self) => self.indexOf(item) === index);
            items.forEach(item => item.moveRight(map));
            this.startPosition.x++;
            return true;
        }
        return false;
    }

    override gpsCoordinates(): number {
        return this.startPosition.y * 100 + this.startPosition.x;
    }

    /**
     * distances are measured from the edge of the map to the closest edge of the box in question
     * @param map
     */
    closestEdgeDistanceScore(map: Map) {
        const leftDistance = this.startPosition.x;
        const rightDistance = map.grid[0].length - this.endX - 1;
        const topDistance = this.startPosition.y;
        const bottomDistance = map.grid.length - this.startPosition.y;
        const horizontalDistance = Math.min(leftDistance, rightDistance);
        const verticalDistance = Math.min(topDistance, bottomDistance);
        console.log(`100 * ${verticalDistance} + ${horizontalDistance} = ${100 * verticalDistance + horizontalDistance}`);
        return 100 * verticalDistance + horizontalDistance;
    }
}

class MapObject extends MovableItem {
    constructor(position: Position, width: number) {
        super(MapItemEnum.OBJECT, width, position);
    }

    toDisplayChar(): string {
        if (this.width === 2) {
            return '[]';
        }
        return super.toDisplayChar();
    }
}

class Robot extends MovableItem {
    constructor(position: Position, width: number) {
        super(MapItemEnum.ROBOT, width, position);
    }
}

class Wall extends MapItem {
    static readonly instance: Wall = new Wall();

    constructor() {
        super(MapItemEnum.WALL, 1);
    }
}

class Map {
    grid: MapItemEnum[][];
    robot: Robot;
    objects: MapObject[];
    objectWidth: number;

    constructor(grid: MapItemEnum[][], robot: Robot, objects: MapObject[], objectWidth: number) {
        this.grid = grid;
        this.robot = robot;
        this.objects = objects;
        this.objectWidth = objectWidth;
    }

    objectsGpsCoordinates(): number {
        return this.objects.map(obj => obj.gpsCoordinates()).reduce((acc, val) => acc + val, 0);
    }

    closestEdgeDistanceObjectScore(): number {
        return this.objects.map(obj => obj.closestEdgeDistanceScore(this)).reduce((acc, val) => acc + val, 0);
    }

    findRobotAt(x: number, y: number): Robot[] {
        let robot: Robot | null = null;
        if (this.robot.startPosition.x >= x && this.robot.startPosition.x < x && this.robot.startPosition.y === y) {
            robot = this.robot;
        }
        return robot ? [robot] : [];
    }

    xIsContainedIn(mapObject: MapObject, x: number): boolean {
        return x >= mapObject.startPosition.x && x <= mapObject.startPosition.x + mapObject.width;
    }

    findObjectAt(x: number, y: number): MapObject | null {
        let currentX = x;
        let foundObject: MapObject | null = null;
        while (!foundObject && x - currentX < this.objectWidth) {
            foundObject = this.objects.find(obj => obj.startPosition.x === currentX && obj.startPosition.y === y) || null;
            currentX--;
        }
        if (foundObject && this.xIsContainedIn(foundObject, x)) {
            return foundObject;
        }
        return null;
    }

    findObjectsBetween(startX: number, endX: number, y: number): MapObject[] {
        const foundObjects: MapObject[] = [];
        for (let column = startX; column <= endX; column++) {
            const object: MapObject | null = this.findObjectAt(column, y);
            if (object) {
                foundObjects.push(object);
            }
        }
        return foundObjects;
    }

    findWallAt(x: number, y: number): Wall | null {
        return this.grid[y][x] === MapItemEnum.WALL ? Wall.instance : null;
    }

    findWallBetween(startX: number, endX: number, y: number): Wall[] {
        const walls: Wall[] = [];
        for (let column = startX; column <= endX; column++) {
            const wall: Wall | null = this.findWallAt(column, y);
            if (wall) {
                walls.push(wall);
            }
        }
        return walls;
    }

    findMapItemsBetween(startX: number, endX: number, y: number): MapItem[] {
        return [...this.findObjectsBetween(startX, endX, y), ...this.findWallBetween(startX, endX, y)];
    }

    displayGridAndRobot(): void {
        const lines: string[][] = this.grid.map(row => row.map(item => item));
        lines[this.robot.startPosition.y][this.robot.startPosition.x] = MapItemEnum.ROBOT;
        this.objects.forEach(obj => {
            // Replace the 2 chars at position y,x
            const text = obj.toDisplayChar();
            for (let i = 0; i < text.length; i++) {
                lines[obj.startPosition.y][obj.startPosition.x + i] = text[i];
            }
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
        const movesLength = this.moves.length;
        this.moves.forEach((move, moveIndex) => {
            console.log(`Move ${move} (${moveIndex}/${movesLength}):`);
            this.map.robot.move(move, this.map);
            // this.displayGrid();
        });
    }

    objectsGpsCoordinates() {
        return this.map.objectsGpsCoordinates();
    }

    closestEdgeDistanceObjectScore() {
        return this.map.closestEdgeDistanceObjectScore();
    }
}

class GameInput extends Input<Game> {

    constructor(inputFilePath: string, private readonly objectWidth: number) {
        super(inputFilePath);
    }

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
        let robot: Robot = new Robot(new Position(0, 0), 1);
        const objects: MapObject[] = [];
        gridLines.forEach((line, y) => {
            const row: MapItemEnum[] = [];
            line.split('').forEach((char, x) => {
                    if (char === MapItemEnum.ROBOT) {
                        robot.startPosition = new Position(x * this.objectWidth, y);
                        row.push(...new Array(this.objectWidth).fill(MapItemEnum.EMPTY));
                    } else if (char === MapItemEnum.OBJECT) {
                        objects.push(new MapObject(new Position(x * this.objectWidth, y), this.objectWidth));
                        row.push(...new Array(this.objectWidth).fill(MapItemEnum.EMPTY));
                    } else {
                        row.push(...new Array(this.objectWidth).fill(char as MapItemEnum));
                    }
                }
            )
            ;
            grid.push(row);
        });
        const map = new Map(grid, robot, objects, this.objectWidth);
        // Moves
        const moves: MoveEnum[] = moveLines.join('').split('') as MoveEnum[];
        // Game
        return new Game(map, moves);
    }
}

class Day15 {
    static part1(inputFilePath: string): number {
        const game: Game = new GameInput(inputFilePath, 1).parse();
        game.displayGridAndMoves();
        game.performMoves();
        return game.objectsGpsCoordinates();
    }

    static part2(inputFilePath: string): number {
        const game: Game = new GameInput(inputFilePath, 2).parse();
        game.displayGridAndMoves();
        game.performMoves();
        console.log(game.closestEdgeDistanceObjectScore()); // Error in the instructions, the actual score we want...
        return game.objectsGpsCoordinates(); // is the GPS coordinates, just like in part 1
    }
}

const startTime = performance.now();
// console.log('Part 1 - Simple: ', Day15.part1('simple-input.txt')); // 2028
// console.log('Part 1 - Example: ', Day15.part1('example-input.txt')); // 10092
// console.log('Part 1 - Input: ', Day15.part1('puzzle-input.txt')); // 1412971
// console.log('Part 2 - Example: ', Day15.part2('simple-input2.txt')); // 616
// console.log('Part 2 - Example: ', Day15.part2('example-input.txt')); // 9021
console.log('Part 2 - Input: ', Day15.part2('puzzle-input.txt')); // 1429299
const endTime = performance.now();
console.log(`Call to method took ${endTime - startTime} milliseconds`);

