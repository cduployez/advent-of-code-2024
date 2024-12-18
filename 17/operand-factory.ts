import {Operand} from './operand';
import {LiteralOperand} from './literal-operand';
import {RegisterEnum} from './register-enum';
import {RegisterOperand} from './register-operand';

export class OperandFactory {

    static toLiteralOperand(operandValue: bigint): Operand {
        return new LiteralOperand(operandValue);
    }

    static toComboOperand(operandValue: bigint, registers: Record<RegisterEnum, bigint>): Operand {
        if (operandValue >= 0n && operandValue <= 3n) {
            return new LiteralOperand(operandValue);
        } else if (operandValue === 4n) {
            return new RegisterOperand(operandValue, RegisterEnum.A, registers);
        } else if (operandValue === 5n) {
            return new RegisterOperand(operandValue, RegisterEnum.B, registers);
        } else if (operandValue === 6n) {
            return new RegisterOperand(operandValue, RegisterEnum.C, registers);
        }
        console.log(`Operand value ${operandValue} is not a valid combo operand`);
        throw new Error(`Invalid combo operand value ${operandValue}`);
    }
}
