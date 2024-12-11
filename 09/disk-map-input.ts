import {Input} from '../input';
import {DiskMap} from './disk-map';

export class DiskMapInput extends Input<DiskMap> {
    parse(): DiskMap {
        const line = this.toText().split('\n')[0];
        return DiskMap.fromDenseFormat(line.split('').map(value => value === '.' ? null : parseInt(value)));
    }

}
