import {CommandEnum} from './command.enum';
import {Command} from './command';

export class MulCommand extends Command<CommandEnum.MUL> {

    x: number;
    y: number;

    constructor(command: `mul(${number},${number})`) {
        super(CommandEnum.MUL);
        const [x, y] = command.substring(4, command.length - 1).split(',').map(n => parseInt(n));
        this.x = x;
        this.y = y;
    }

    override mul(): number {
        return this.x * this.y;
    }
}
