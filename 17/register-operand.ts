import {Operand} from './operand';
import {RegisterEnum} from './register-enum';

export class RegisterOperand extends Operand {
    private registerEnum: RegisterEnum;
    private registers: Record<RegisterEnum, number>;

    constructor(operandValue: number, registerEnum: RegisterEnum, registers: Record<RegisterEnum, number>) {
        super(operandValue);
        this.registerEnum = registerEnum;
        this.registers = registers;
    }

    get value(): number {
        return this.registers[this.registerEnum];
    }
}
