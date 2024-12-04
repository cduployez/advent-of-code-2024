import {Input} from '../input';

export class CrossWordInput extends Input<string[][]> {
    constructor(inputFilePath: string) {
        super(inputFilePath);
    }

    override parse(): string[][] {
        const text = this.toText();
        return text.split('\n').filter(t => t.length > 0).map(l => l.split(''));
    }

}
