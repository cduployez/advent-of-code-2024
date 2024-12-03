import {MulCommand} from './mul-command';
import {InstructionUtils} from './instruction-utils';
import {InstructionInput} from './instruction-input';

class Day3 {
    static part1(inputFilePath: string): number {
        const instruction: string = new InstructionInput(inputFilePath).parse();
        const mulCommands: MulCommand[] = InstructionUtils.extract(instruction);
        return mulCommands.map(mulCommand => mulCommand.mul()).reduce((acc, n) => acc + n, 0);
    }
}

console.log('Part 1 - Example: ', Day3.part1('example-input.txt')); // 161
console.log('Part 1 - Input: ', Day3.part1('puzzle-input.txt')); // 163931492
