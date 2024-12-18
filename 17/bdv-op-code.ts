import {Opcode} from './opcode';
import {RegisterEnum} from './register-enum';
import {Operand} from './operand';
import {OperandFactory} from './operand-factory';
import {Result} from './result';

import {OperationUtils} from './operation-utils';

/**
 * The bdv instruction (opcode 6) works exactly like the adv instruction except that the result is stored in the B register.
 * (The numerator is still read from the A register.)
 */
export class BdvOpCode extends Opcode {
    constructor(opcodeValue: bigint, operandValue: bigint, registers: Record<RegisterEnum, bigint>) {
        super(opcodeValue, operandValue, registers);
    }

    override toOperand(operandValue: bigint, registers: Record<RegisterEnum, bigint>): Operand {
        return OperandFactory.toComboOperand(operandValue, registers);
    }

    override run(registers: Record<RegisterEnum, bigint>): Result {
        registers[RegisterEnum.B] = OperationUtils.dv(this.operand.value, registers[RegisterEnum.A]);
        return new Result(null, null);
    }
}
