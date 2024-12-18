import {RegisterEnum} from './register-enum';
import {Instruction} from './instruction';

export class Program {
    values: number[];
    registers: Record<RegisterEnum, number> = {
        [RegisterEnum.A]: 0,
        [RegisterEnum.B]: 0,
        [RegisterEnum.C]: 0
    };

    constructor(values: number[], registers: Partial<Record<RegisterEnum, number>>) {
        this.values = values;
        this.registers = {...this.registers, ...registers};
    }

    run(): number[] {
        const outputs: number[] = [];
        let i = 0;
        while (i < this.values.length - 1) {
            console.log(`${this.values[i]},${this.values[i + 1]} (${JSON.stringify(this.registers)})`);
            const result = new Instruction(this.values[i], this.values[i + 1], this.registers).run(this.registers);
            console.log(`${this.values[i]},${this.values[i + 1]} => ${JSON.stringify(result)} (${JSON.stringify(this.registers)})`);
            if (result.output !== null) {
                outputs.push(result.output);
            }
            i = result.jump !== null ? result.jump : i + 2;
        }
        console.log(`i ${i}`);
        return outputs;
    }
}
