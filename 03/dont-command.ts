import {CommandEnum} from './command.enum';

import {Command} from './command';

export class DontCommand extends Command<CommandEnum.DONT> {

    constructor() {
        super(CommandEnum.DONT);
    }
}
