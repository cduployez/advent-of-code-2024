import {Operand} from './operand';
import {RegisterEnum} from './register-enum';
import {Result} from './result';

export abstract class Opcode {
    opcodeValue: number;
    operand: Operand;

    constructor(opcodeValue: number, operandValue: number, registers: Record<RegisterEnum, number>) {
        this.opcodeValue = opcodeValue;
        this.operand = this.toOperand(operandValue, registers);
    }

    abstract run(registers: Record<RegisterEnum, number>): Result;

    abstract toOperand(operandValue: number, registers: Record<RegisterEnum, number>): Operand;
}
