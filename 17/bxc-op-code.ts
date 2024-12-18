import {Opcode} from './opcode';
import {RegisterEnum} from './register-enum';
import {Operand} from './operand';
import {OperandFactory} from './operand-factory';
import {Result} from './result';

import {OperationUtils} from './operation-utils';

/**
 * The bxc instruction (opcode 4) calculates the bitwise XOR of register B and register C,
 * then stores the result in register B. (For legacy reasons, this instruction reads an operand but ignores it.)
 */
export class BxcOpCode extends Opcode {
    constructor(opcodeValue: bigint, operandValue: bigint, registers: Record<RegisterEnum, bigint>) {
        super(opcodeValue, operandValue, registers);
    }

    override toOperand(operandValue: bigint, registers: Record<RegisterEnum, bigint>): Operand {
        return OperandFactory.toLiteralOperand(operandValue);
    }

    override run(registers: Record<RegisterEnum, bigint>): Result {
        registers[RegisterEnum.B] = OperationUtils.xor(registers[RegisterEnum.B], registers[RegisterEnum.C]);
        return new Result(null, null);
    }
}
