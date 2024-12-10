import {Input} from '../input';
import {Board} from './board';
import {Antenna} from './antenna';
import {Coordinate} from './coordinate';

import {EMPTY_CHAR} from './empty-char';

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
