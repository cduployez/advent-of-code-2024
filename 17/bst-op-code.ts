import {Opcode} from './opcode';
import {RegisterEnum} from './register-enum';
import {Operand} from './operand';
import {OperandFactory} from './operand-factory';
import {Result} from './result';

/**
 * The bst instruction (opcode 2) calculates the value of its combo operand modulo 8 (thereby keeping only its lowest 3 bits),
 * then writes that value to the B register.
 */
export class BstOpCode extends Opcode {
    constructor(opcodeValue: bigint, operandValue: bigint, registers: Record<RegisterEnum, bigint>) {
        super(opcodeValue, operandValue, registers);
    }

    override toOperand(operandValue: bigint, registers: Record<RegisterEnum, bigint>): Operand {
        return OperandFactory.toComboOperand(operandValue, registers);
    }

    override run(registers: Record<RegisterEnum, bigint>): Result {
        registers[RegisterEnum.B] = this.operand.value % 8n;
        return new Result(null, null);
    }
}
