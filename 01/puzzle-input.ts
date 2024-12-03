import {Input} from '../input';

export class PuzzleInput extends Input<[number[], number[]]> {
    constructor(inputFilePath: string) {
        super(inputFilePath);
    }

    override parse(): [number[], number[]] {
        const text = this.toText();
        const lines = text.split('\n').filter(l => l.length > 0);
        const leftList = lines.map(l => l.split(/[ ]+/)[0]).map(n => parseInt(n));
        const rightList = lines.map(l => l.split(/[ ]+/)[1]).map(n => parseInt(n));
        return [leftList, rightList];
    }
}
