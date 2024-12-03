import {Input} from '../input';

export class InstructionInput extends Input<string> {
    constructor(inputFilePath: string) {
        super(inputFilePath);
    }

    parse(): string {
        return this.toText();
    }

}
