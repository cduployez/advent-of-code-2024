import {RegisterEnum} from './register-enum';
import {Opcode} from './opcode';
import {AdvOpCode} from './adv-op-code';
import {BxlOpCode} from './bxl-op-code';
import {BstOpCode} from './bst-op-code';
import {JnzOpCode} from './jnz-op-code';
import {BxcOpCode} from './bxc-op-code';
import {OutOpCode} from './out-op-code';
import {BdvOpCode} from './bdv-op-code';
import {CdvOpCode} from './cdv-op-code';

export class OpCodeFactory {
    static create(opcodeValue: number, operandValue: number, registers: Record<RegisterEnum, number>): Opcode {
        switch (opcodeValue) {
            case 0:
                return new AdvOpCode(opcodeValue, operandValue, registers);
            case 1:
                return new BxlOpCode(opcodeValue, operandValue, registers);
            case 2:
                return new BstOpCode(opcodeValue, operandValue, registers);
            case 3:
                return new JnzOpCode(opcodeValue, operandValue, registers);
            case 4:
                return new BxcOpCode(opcodeValue, operandValue, registers);
            case 5:
                return new OutOpCode(opcodeValue, operandValue, registers);
            case 6:
                return new BdvOpCode(opcodeValue, operandValue, registers);
            case 7:
                return new CdvOpCode(opcodeValue, operandValue, registers);
            default:
                throw new Error(`Invalid opcode value ${opcodeValue}`);
        }
    }
}
