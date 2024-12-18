import {Opcode} from './opcode';
import {RegisterEnum} from './register-enum';
import {Operand} from './operand';
import {OperandFactory} from './operand-factory';
import {Result} from './result';

/**
 * The jnz instruction (opcode 3) does nothing if the A register is 0.
 * However, if the A register is not zero, it jumps by setting the instruction pointer to the value of its literal operand;
 * if this instruction jumps, the instruction pointer is not increased by 2 after this instruction.
 */
export class JnzOpCode extends Opcode {
    constructor(opcodeValue: bigint, operandValue: bigint, registers: Record<RegisterEnum, bigint>) {
        super(opcodeValue, operandValue, registers);
    }

    override toOperand(operandValue: bigint, registers: Record<RegisterEnum, bigint>): Operand {
        return OperandFactory.toLiteralOperand(operandValue);
    }

    override run(registers: Record<RegisterEnum, bigint>): Result {
        if (registers[RegisterEnum.A] === 0n) {
            return new Result(null, null);
        }
        return new Result(null, this.operand.value);
    }
}
