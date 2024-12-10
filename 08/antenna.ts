import {Coordinate} from './coordinate';

export class Antenna {
    name: string;
    position: Coordinate;

    constructor(name: string, position: Coordinate) {
        this.name = name;
        this.position = position;
    }
}
