import {Operand} from './operand';
import {RegisterEnum} from './register-enum';

export class RegisterOperand extends Operand {
    private registerEnum: RegisterEnum;
    private registers: Record<RegisterEnum, bigint>;

    constructor(operandValue: bigint, registerEnum: RegisterEnum, registers: Record<RegisterEnum, bigint>) {
        super(operandValue);
        this.registerEnum = registerEnum;
        this.registers = registers;
    }

    get value(): bigint {
        return this.registers[this.registerEnum];
    }
}
