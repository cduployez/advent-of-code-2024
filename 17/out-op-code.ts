import {Opcode} from './opcode';
import {RegisterEnum} from './register-enum';
import {Operand} from './operand';
import {OperandFactory} from './operand-factory';
import {Result} from './result';

/**
 * The out instruction (opcode 5) calculates the value of its combo operand modulo 8, then outputs that value.
 * (If a program outputs multiple values, they are separated by commas.)
 */
export class OutOpCode extends Opcode {
    constructor(opcodeValue: bigint, operandValue: bigint, registers: Record<RegisterEnum, bigint>) {
        super(opcodeValue, operandValue, registers);
    }

    override toOperand(operandValue: bigint, registers: Record<RegisterEnum, bigint>): Operand {
        return OperandFactory.toComboOperand(operandValue, registers);
    }

    override run(registers: Record<RegisterEnum, bigint>): Result {
        return new Result(this.operand.value % 8n, null);
    }
}
