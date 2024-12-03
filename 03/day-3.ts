import {MulCommand} from './mul-command';
import {InstructionUtils} from './instruction-utils';
import {InstructionInput} from './instruction-input';
import {CommandEnum} from './command.enum';
import {Command} from './command';

class Day3 {
    static part1(inputFilePath: string): number {
        const instruction: string = new InstructionInput(inputFilePath).parse();
        const commands: Command<CommandEnum>[] = InstructionUtils.extract(instruction, [CommandEnum.MUL]);
        return commands.map((mulCommand: MulCommand) => mulCommand.mul()).reduce((acc, n) => acc + n, 0);
    }

    static part2(inputFilePath: string): number {
        const instruction: string = new InstructionInput(inputFilePath).parse();
        const commands: Command<CommandEnum>[] = InstructionUtils.extract(instruction, [CommandEnum.MUL, CommandEnum.DO, CommandEnum.DONT]);
        let enabled: boolean = true;
        return commands.map((command: Command<CommandEnum>) => {
            if (command.commandType === CommandEnum.DO) {
                enabled = true;
            } else if (command.commandType === CommandEnum.DONT) {
                enabled = false;
            }
            return enabled ? command.mul() : 0;
        }).reduce((acc, n) => acc + n, 0);
    }
}

console.log('Part 1 - Example: ', Day3.part1('example-input.txt')); // 161
console.log('Part 1 - Input: ', Day3.part1('puzzle-input.txt')); // 163931492
console.log('Part 2 - Example: ', Day3.part2('example-input2.txt')); // 48
console.log('Part 2 - Input: ', Day3.part2('puzzle-input.txt')); // 76911921
