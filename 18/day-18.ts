import {Input} from '../input';
import {Position} from '../position';

enum MemoryEnum {
    SAFE = '.',
    CORRUPTED = '#'
}

const DIRECTIONS = [
    [0, 1], // Bottom
    [1, 0], // Right
    [0, -1], // Top
    [-1, 0] // Left
];

type VisitedKey = `${number}:${number}`;

class Character extends Position {
    score: number;

    constructor(x: number, y: number, score: number) {
        super(x, y);
        this.score = score;
    }
}

class MemorySpace {
    bytes: number[][];
    squareLength: number;
    nbFallenBytes: number;
    startPosition: Position;
    endPosition: Position;
    private grid: MemoryEnum[][] = [];

    constructor(bytes: number[][], squareLength: number, nbFallenBytes: number) {
        this.bytes = bytes;
        this.squareLength = squareLength;
        this.nbFallenBytes = nbFallenBytes;
        this.grid = Array.from({length: this.squareLength}, () => Array(this.squareLength).fill(MemoryEnum.SAFE));
        this.startPosition = new Position(0, 0);
        this.endPosition = new Position(this.squareLength - 1, this.squareLength - 1);
    }

    reset(nbFallenBytes: number): void {
        this.grid = Array.from({length: this.squareLength}, () => Array(this.squareLength).fill(MemoryEnum.SAFE));
        this.startPosition = new Position(0, 0);
        this.endPosition = new Position(this.squareLength - 1, this.squareLength - 1);
        this.nbFallenBytes = nbFallenBytes;
        this.makeBytesFall(this.nbFallenBytes);
    }

    makeBytesFall(nbFallenBytes: number): void {
        for (let i = 0; i < nbFallenBytes && i < this.bytes.length; i++) {
            const [x, y] = this.bytes[i];
            this.grid[y][x] = MemoryEnum.CORRUPTED;
        }
    }

    toKey(x: number, y: number): VisitedKey {
        return `${x}:${y}`;
    }

    findMinPathLength(): number {
        this.makeBytesFall(this.nbFallenBytes);
        const characters = [new Character(this.startPosition.x, this.startPosition.y, 0)];
        const visited: Set<VisitedKey> = new Set<VisitedKey>();
        visited.add(this.toKey(characters[0].x, characters[0].y));

        while (characters.length > 0) {
            const character = characters.shift()!;
            if (character.x === this.endPosition.x && character.y === this.endPosition.y) {
                return character.score;
            }
            for (const [directionX, directionY] of DIRECTIONS) {
                const newPosition = new Position(character.x + directionX, character.y + directionY);
                const newKey: VisitedKey = this.toKey(newPosition.x, newPosition.y);
                if (
                    newPosition.x >= 0 && newPosition.x < this.squareLength &&
                    newPosition.y >= 0 && newPosition.y < this.squareLength &&
                    this.grid[newPosition.y][newPosition.x] === MemoryEnum.SAFE &&
                    !visited.has(newKey)
                ) {
                    characters.push(new Character(newPosition.x, newPosition.y, character.score + 1));
                    visited.add(newKey);
                }
            }
        }

        return -1;
    }
}

class MemorySpaceInput extends Input<MemorySpace> {

    constructor(inputFilePath: string, private readonly squareLength: number, private readonly nbFallenBytes: number) {
        super(inputFilePath);
    }

    parse(): MemorySpace {
        const bytes = this.toText().split('\n').map(line => line.split(',').map(Number));
        return new MemorySpace(bytes, this.squareLength, this.nbFallenBytes);
    }
}

class Day18 {
    static part1(inputFilePath: string, squareLength: number, nbFallenBytes: number): number {
        const memorySpace = new MemorySpaceInput(inputFilePath, squareLength, nbFallenBytes).parse();
        return memorySpace.findMinPathLength();
    }

    static part2(inputFilePath: string, squareLength: number, nbFallenBytes: number): string {
        const memorySpace = new MemorySpaceInput(inputFilePath, squareLength, nbFallenBytes).parse();
        let currentNbFallenBytes = nbFallenBytes + 1;
        let maxFallenBytes = memorySpace.bytes.length;
        while (currentNbFallenBytes <= maxFallenBytes) {
            memorySpace.reset(currentNbFallenBytes);
            const pathLength = memorySpace.findMinPathLength();
            if (pathLength === -1) {
                return memorySpace.bytes[currentNbFallenBytes - 1].join(',');
            }
            currentNbFallenBytes++;
        }
        return '-1';
    }
}

const startTime = performance.now();
// console.log('Part 1 - Example: ', Day18.part1('example-input.txt', 7, 12)); // 22
// console.log('Part 1 - Puzzle: ', Day18.part1('puzzle-input.txt', 71, 1024)); // 370
// console.log('Part 2 - Example: ', Day18.part2('example-input.txt', 7, 12)); // 6,1
console.log('Part 2 - Puzzle: ', Day18.part2('puzzle-input.txt', 71, 1024)); // 65,6
const endTime = performance.now();
console.log(`Call to method took ${endTime - startTime} milliseconds`);

