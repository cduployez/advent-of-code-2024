import {Input} from '../input';

export class Antenna {
    name: string;
    position: Coordinate;

    constructor(name: string, position: Coordinate) {
        this.name = name;
        this.position = position;
    }
}

export class Antinode {
    antennas: [Antenna, Antenna];
    position: Coordinate;

    constructor(antennas: [Antenna, Antenna], position: Coordinate, readonly inline: boolean = false) {
        this.antennas = antennas;
        this.position = position;
    }
}

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

export class Board {
    width: number;
    height: number;
    antennaMap: Record<string, Antenna[]> = {};
    antennas: Antenna[] = [];
    antinodes: Antinode[] = [];

    constructor(width: number, height: number, antennas: Antenna[]) {
        this.width = width;
        this.height = height;
        antennas.forEach(antenna => {
            if (!this.antennaMap[antenna.name]) {
                this.antennaMap[antenna.name] = [];
            }
            this.antennaMap[antenna.name].push(antenna);
        });
        this.antennas = antennas;
    }

    generateAntinodes(inline: boolean): void {
        this.antinodes = this.toAntinodes(inline);
    }

    toAntinodes(inline: boolean): Antinode[] {
        const antinodes: Antinode[] = [];
        Object.keys(this.antennaMap).forEach(key => {
            const antennas = this.antennaMap[key];
            if (antennas.length > 1) {
                for (let i = 0; i < antennas.length; i++) {
                    for (let j = i + 1; j < antennas.length; j++) {
                        antinodes.push(...this.toAntinodeForAntennas(antennas[i], antennas[j], inline));
                    }
                }
            }
        });
        return antinodes
            // Remove non unique antinodes
            .filter((antinode, index, array) => array.findIndex(a => a.position.isEqualTo(antinode.position)) === index);
    }

    toAntinodeForAntennas(antenna1: Antenna, antenna2: Antenna, inline: boolean): Antinode[] {
        const vectorCoordinate: Coordinate = this.getVectorCoordinates(antenna1.position, antenna2.position);
        const antinodes: Antinode[] = [];

        // First case
        let antinode = new Antinode([antenna1, antenna2], antenna1.position.add(vectorCoordinate));
        antinodes.push(antinode);
        while (inline && !antinode.position.isOutOfBounds(this.width, this.height)) {
            antinode = new Antinode([antenna1, antenna2], antinode.position.add(vectorCoordinate), true);
            antinodes.push(antinode);
        }

        // Second case
        antinode = new Antinode([antenna1, antenna2], antenna1.position.remove(vectorCoordinate));
        antinodes.push(antinode);
        while (inline && !antinode.position.isOutOfBounds(this.width, this.height)) {
            antinode = new Antinode([antenna1, antenna2], antinode.position.remove(vectorCoordinate), true);
            antinodes.push(antinode);
        }

        // Third case
        antinode = new Antinode([antenna1, antenna2], antenna2.position.add(vectorCoordinate));
        antinodes.push(antinode);
        while (inline && !antinode.position.isOutOfBounds(this.width, this.height)) {
            antinode = new Antinode([antenna1, antenna2], antinode.position.add(vectorCoordinate), true);
            antinodes.push(antinode);
        }

        // Fourth case
        antinode = new Antinode([antenna1, antenna2], antenna2.position.remove(vectorCoordinate));
        antinodes.push(antinode);
        while (inline && !antinode.position.isOutOfBounds(this.width, this.height)) {
            antinode = new Antinode([antenna1, antenna2], antinode.position.remove(vectorCoordinate), true);
            antinodes.push(antinode);
        }
        return antinodes
            // Remove antinodes at antenna 1 or antenna 2 locations
            .filter(antinode => inline || (!antenna1.position.isEqualTo(antinode.position) && !antenna2.position.isEqualTo(antinode.position)))
            // Remove antinodes out of bounds
            .filter(antinode => !antinode.position.isOutOfBounds(this.width, this.height));
    }

    displayBoard(): void {
        console.log('');
        for (let y = 0; y < this.height; y++) {
            console.log(this.toBoardRow(y));
        }
        console.log('');
    }

    getAntennaAt(x: number, y: number): Antenna | undefined {
        return this.antennas.find(antenna => antenna.position.x === x && antenna.position.y === y);
    }

    getAntinodeAt(x: number, y: number): Antinode | undefined {
        return this.antinodes.find(antinode => antinode.position.x === x && antinode.position.y === y);
    }

    toBoardRow(y: number): string {
        return new Array<string>(this.width).fill(EMPTY_CHAR).map((char, index) => {
            const antenna = this.getAntennaAt(index, y);
            return antenna ? antenna.name : char;
        }).map((char, index) => {
            const antinode = this.getAntinodeAt(index, y);
            return antinode ? ANTINODE_CHAR : char;
        }).join('');
    }

    private getVectorCoordinates(position: Coordinate, position2: Coordinate): Coordinate {
        const x = position2.x - position.x;
        const y = position2.y - position.y;
        return new Coordinate(x, y);
    }
}

export const EMPTY_CHAR: string = '.';
export const ANTINODE_CHAR: string = '#';

export class BoardInput extends Input<Board> {
    parse(): Board {
        const lines = this.toText().split('\n').filter(line => line.length > 0);
        const width = lines[0].length;
        const height = lines.length;
        const antennas: Antenna[] = [];
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const char = lines[y][x];
                if (char !== EMPTY_CHAR) {
                    antennas.push(new Antenna(char, new Coordinate(x, y)));
                }
            }
        }
        return new Board(width, height, antennas);
    }

}

class Day8 {
    static part1(inputFilePath: string): number {
        const board = new BoardInput(inputFilePath).parse();
        board.displayBoard();
        board.generateAntinodes();
        // console.log(board.antinodes.map(a => `Antinode at (${a.position.x}, ${a.position.y}) for Antennas ${a.antennas[0].name} and ${a.antennas[1].name}`));
        board.displayBoard();
        return board.antinodes.length;
    }

    static part2(inputFilePath: string): number {
        const board = new BoardInput(inputFilePath).parse();
        board.displayBoard();
        board.generateAntinodes(true);
        // console.log(board.antinodes.map(a => `Antinode at (${a.position.x}, ${a.position.y}) for Antennas ${a.antennas[0].name} and ${a.antennas[1].name}`));
        board.displayBoard();
        return board.antinodes.length;
    }
}

const startTime = performance.now();
console.log('Part 1 - Tutorial: ', Day8.part1('part1-tutorial-input.txt')); // 2
console.log('Part 1 - Example: ', Day8.part1('example-input.txt')); // 14
console.log('Part 1 - Input: ', Day8.part1('puzzle-input.txt')); // 303
console.log('Part 2 - Tutorial: ', Day8.part2('part2-tutorial-input.txt')); // 9
console.log('Part 2 - Example: ', Day8.part2('example-input.txt')); // 34
console.log('Part 2 - Input: ', Day8.part2('puzzle-input.txt')); // 1045
const endTime = performance.now();
console.log(`Call to method took ${endTime - startTime} milliseconds`);

