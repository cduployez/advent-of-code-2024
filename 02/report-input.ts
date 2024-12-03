import {Input} from '../input';

export class ReportInput extends Input<number[][]> {

    constructor(inputFilePath: string) {
        super(inputFilePath);
    }

    parse(): number[][] {
        const text = this.toText();
        const lines = text.split('\n').filter(l => l.length > 0);
        return lines.map(l => l.split(/[ ]+/).map(n => parseInt(n)));
    }
}
