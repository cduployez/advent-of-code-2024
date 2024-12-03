import {MulCommand} from './mul-command';

export class InstructionUtils {
    static extract(text: string): MulCommand[] {
        return text.match(/mul\(\d+,\d+\)/g).map(mul => new MulCommand(mul as `mul(${number},${number})`));
    }
}
