import fs from 'fs';

export abstract class Input<T> {
    constructor(private inputFilePath: string) {

    }

    toText(): string {
        return fs.readFileSync(this.inputFilePath, 'utf-8');
    }

    abstract parse(): T;
}


