import {RegisterEnum} from './register-enum';
import {Instruction} from './instruction';
import {Result} from './result';

export class Program {
    values: bigint[];
    registers: Record<RegisterEnum, bigint>;
    initialRegisters: Record<RegisterEnum, bigint>;

    constructor(values: bigint[], registers: Record<RegisterEnum, bigint>) {
        this.values = values;
        this.initialRegisters = registers;
        this.registers = registers;
    }

    toDisplayRegister(): string {
        return `A=${this.registers.A}, B=${this.registers.B}, C=${this.registers.C}`;
    }

    run(a: bigint = this.initialRegisters.A, b: bigint = this.initialRegisters.B, c: bigint = this.initialRegisters.C): string {
        // Reset registers
        this.registers.A = a;
        this.registers.B = b;
        this.registers.C = c;
        // Run program
        const outputs: bigint[] = [];
        let pointer: bigint = 0n;
        while (pointer < this.values.length - 1) {
            const index: number = Number(pointer);
            // this.display(index);
            const result: Result = new Instruction(this.values[index], this.values[index + 1], this.registers).run(this.registers);
            if (result.output !== null) {
                outputs.push(result.output);
            }
            // this.displayResult(index, result, outputs);
            pointer = result.jump !== null ? result.jump : pointer + 2n;
            // console.log('----------------');
        }
        return outputs.map(value => value.toString()).join(',');
    }

    display(index: number = 0): void {
        console.log(`${this.values.map(v => Number(v)).join(',')} [${this.toDisplayRegister()}]`);
        console.log(`${this.values.map((v, i) => i === index ? '^' : ' ').join(' ')}`);
    }

    private displayResult(index: number, result: Result, outputs: bigint[]): void {
        console.log(`(${this.values[index]}, ${this.values[index + 1]}), Output=${result.output}, Jump=${result.jump}, ${this.toDisplayRegister()} Outputs=[${outputs.join(',')}]`);
    }
}
