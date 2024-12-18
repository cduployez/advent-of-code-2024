import {Opcode} from './opcode';
import {RegisterEnum} from './register-enum';
import {Result} from './result';

import {OpCodeFactory} from './op-code-factory';

export class Instruction {
    opcode: Opcode;

    constructor(opcode: number, operand: number, registers: Record<RegisterEnum, number>) {
        this.opcode = OpCodeFactory.create(opcode, operand, registers);
    }

    run(registers: Record<RegisterEnum, number>): Result {
        return this.opcode.run(registers);
    }
}
