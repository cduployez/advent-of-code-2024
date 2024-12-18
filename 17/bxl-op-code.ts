import {Opcode} from './opcode';
import {RegisterEnum} from './register-enum';
import {Operand} from './operand';
import {OperandFactory} from './operand-factory';
import {Result} from './result';

import {OperationUtils} from './operation-utils';

/**
 * The bxl instruction (opcode 1) calculates the bitwise XOR of register B and the instruction's literal operand, then stores the result in register B.
 */
export class BxlOpCode extends Opcode {
    constructor(opcodeValue: bigint, operandValue: bigint, registers: Record<RegisterEnum, bigint>) {
        super(opcodeValue, operandValue, registers);
    }

    override toOperand(operandValue: bigint, registers: Record<RegisterEnum, bigint>): Operand {
        return OperandFactory.toLiteralOperand(operandValue);
    }

    override run(registers: Record<RegisterEnum, bigint>): Result {
        registers[RegisterEnum.B] = OperationUtils.xor(registers[RegisterEnum.B], this.operand.value);
        return new Result(null, null);
    }
}
