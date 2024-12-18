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
    static create(opcodeValue: bigint, operandValue: bigint, registers: Record<RegisterEnum, bigint>): Opcode {
        switch (opcodeValue) {
            case 0n:
                return new AdvOpCode(opcodeValue, operandValue, registers);
            case 1n:
                return new BxlOpCode(opcodeValue, operandValue, registers);
            case 2n:
                return new BstOpCode(opcodeValue, operandValue, registers);
            case 3n:
                return new JnzOpCode(opcodeValue, operandValue, registers);
            case 4n:
                return new BxcOpCode(opcodeValue, operandValue, registers);
            case 5n:
                return new OutOpCode(opcodeValue, operandValue, registers);
            case 6n:
                return new BdvOpCode(opcodeValue, operandValue, registers);
            case 7n:
                return new CdvOpCode(opcodeValue, operandValue, registers);
            default:
                throw new Error(`Invalid opcode value ${opcodeValue}`);
        }
    }
}
