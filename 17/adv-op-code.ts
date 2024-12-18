import {Opcode} from './opcode';
import {RegisterEnum} from './register-enum';
import {Operand} from './operand';
import {OperandFactory} from './operand-factory';
import {Result} from './result';

import {OperationUtils} from './operation-utils';

/**
 * The adv instruction (opcode 0) performs division. The numerator is the value in the A register.
 * The denominator is found by raising 2 to the power of the instruction's combo operand.
 * (So, an operand of 2 would divide A by 4 (2^2); an operand of 5 would divide A by 2^B.)
 * The result of the division operation is truncated to an integer and then written to the A register.
 */
export class AdvOpCode extends Opcode {
    constructor(opcodeValue: bigint, operandValue: bigint, registers: Record<RegisterEnum, bigint>) {
        super(opcodeValue, operandValue, registers);
    }

    override toOperand(operandValue: bigint, registers: Record<RegisterEnum, bigint>): Operand {
        return OperandFactory.toComboOperand(operandValue, registers);
    }

    override run(registers: Record<RegisterEnum, bigint>): Result {
        registers[RegisterEnum.A] = OperationUtils.dv(this.operand.value, registers[RegisterEnum.A]);
        return new Result(null, null);
    }
}
