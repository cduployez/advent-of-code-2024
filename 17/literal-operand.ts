import {Operand} from './operand';

export class LiteralOperand extends Operand {
    constructor(operandValue: number) {
        super(operandValue);
    }

    get value(): number {
        return this.operandValue;
    }
}
