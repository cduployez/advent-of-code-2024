import {Antenna} from './antenna';

import {Coordinate} from './coordinate';

export class Antinode {
    antennas: [Antenna, Antenna];
    position: Coordinate;

    constructor(antennas: [Antenna, Antenna], position: Coordinate, readonly inline: boolean = false) {
        this.antennas = antennas;
        this.position = position;
    }
}
