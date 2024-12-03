import {CommandEnum} from './command.enum';

export abstract class Command<T extends CommandEnum> {
    constructor(public readonly commandType: T) {

    }

    mul(): number {
        return 0;
    }
}
