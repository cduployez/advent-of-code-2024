import {Operand} from './operand';
import {LiteralOperand} from './literal-operand';
import {RegisterEnum} from './register-enum';
import {RegisterOperand} from './register-operand';

export class OperandFactory {

    static toLiteralOperand(operandValue: number): Operand {
        return new LiteralOperand(operandValue);
    }

    static toComboOperand(operandValue: number, registers: Record<RegisterEnum, number>): Operand {
        if (operandValue >= 0 && operandValue <= 3) {
            return new LiteralOperand(operandValue);
        } else if (operandValue === 4) {
            return new RegisterOperand(operandValue, RegisterEnum.A, registers);
        } else if (operandValue === 5) {
            return new RegisterOperand(operandValue, RegisterEnum.B, registers);
        } else if (operandValue === 6) {
            return new RegisterOperand(operandValue, RegisterEnum.C, registers);
        }
        console.log(`Operand value ${operandValue} is not a valid combo operand`);
        throw new Error(`Invalid combo operand value ${operandValue}`);
    }
}
