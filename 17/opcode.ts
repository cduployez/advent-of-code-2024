import {Operand} from './operand';
import {RegisterEnum} from './register-enum';
import {Result} from './result';

export abstract class Opcode {
    opcodeValue: bigint;
    operand: Operand;

    constructor(opcodeValue: bigint, operandValue: bigint, registers: Record<RegisterEnum, bigint>) {
        this.opcodeValue = opcodeValue;
        this.operand = this.toOperand(operandValue, registers);
    }

    abstract run(registers: Record<RegisterEnum, bigint>): Result;

    abstract toOperand(operandValue: bigint, registers: Record<RegisterEnum, bigint>): Operand;
}
