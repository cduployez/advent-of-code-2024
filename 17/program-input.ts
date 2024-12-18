import {Input} from '../input';
import {Program} from './program';
import {RegisterEnum} from './register-enum';

export class ProgramInput extends Input<Program> {
    parse(): Program {
        const lines = this.toText().split('\n').filter(line => line.length > 0);
        const registers: Record<RegisterEnum, bigint> = this.parseRegisters(lines);
        const values: bigint[] = this.parseInstructions(lines);
        return new Program(values, registers);
    }

    private parseRegisters(lines: string[]): Record<RegisterEnum, bigint> {
        const registerLines: string[] = lines.filter(l => l.startsWith('Register'));
        const registers: Record<RegisterEnum, bigint> = {
            A: 0n,
            B: 0n,
            C: 0n
        };
        (Object.keys(RegisterEnum) as RegisterEnum[]).forEach((key: RegisterEnum) => {
            const prefix: string = `Register ${key}: `;
            const value = registerLines.find(l => l.startsWith(prefix))?.split(prefix)[1];
            registers[key] = value ? BigInt(value) : 0n;
            console.log(`Register ${key} has value ${registers[key]}`);
        });
        return registers;
    }

    private parseInstructions(lines: string[]): bigint[] {
        const prefix = 'Program: ';
        return lines.find(l => l.startsWith(prefix))!.split(prefix)[1].split(',').map(v => BigInt(v));
    }
}
