import {Opcode} from './opcode';
import {RegisterEnum} from './register-enum';
import {Result} from './result';

import {OpCodeFactory} from './op-code-factory';

export class Instruction {
    opcode: Opcode;

    constructor(opcode: bigint, operand: bigint, registers: Record<RegisterEnum, bigint>) {
        this.opcode = OpCodeFactory.create(opcode, operand, registers);
    }

    run(registers: Record<RegisterEnum, bigint>): Result {
        return this.opcode.run(registers);
    }
}
