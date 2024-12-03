import {MulCommand} from './mul-command';
import {CommandEnum} from './command.enum';
import {DoCommand} from './do-command';
import {DontCommand} from './dont-command';
import {Command} from './command';

export class InstructionUtils {
    static extract(text: string, acceptedCommands: CommandEnum[]): Command<CommandEnum>[] {
        // Mul : mul(1,2)
        // Do : do()
        // Dont : don't()
        return text.match(/(mul\(\d+,\d+\))|(do\(\))|(don't\(\))/g).map((command: string) => {
            if (command.startsWith('mul\(')) {
                return new MulCommand(command as `mul(${number},${number})`);
            } else if (command.startsWith('do\(\)')) {
                return new DoCommand();
            } else if (command.startsWith('don\'t\(\)')) {
                return new DontCommand();
            }
        }).filter((command: Command<CommandEnum>) => acceptedCommands.indexOf(command.commandType) > -1);
    }
}
