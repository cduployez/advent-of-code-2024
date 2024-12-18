import {Operand} from './operand';

export class LiteralOperand extends Operand {
    constructor(operandValue: bigint) {
        super(operandValue);
    }

    get value(): bigint {
        return this.operandValue;
    }
}
