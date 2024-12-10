import {Input} from '../input';
import {Equation} from './equation';

export class EquationsInput extends Input<Equation[]> {
    constructor(filePath: string) {
        super(filePath);
    }

    parse(): Equation[] {
        // Format: <testValue>: <remainingNumber 1> <remainingNumber 2> ... <remainingNumber n>
        return this.toText().split('\n').filter(line => line.length > 0).map(line => {
            const [testValue, ...remainingNumbers] = line.split(/[: ]+/);
            return new Equation(parseInt(testValue.trim()), remainingNumbers.map(n => {
                return parseInt(n.trim());
            }));
        });
    }
}
