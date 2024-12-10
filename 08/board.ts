import {Antenna} from './antenna';
import {Antinode} from './antinode';
import {Coordinate} from './coordinate';
import {EMPTY_CHAR} from './empty-char';
import {ANTINODE_CHAR} from './antinode-char';

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

    generateAntinodes(inline: boolean = false): void {
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
