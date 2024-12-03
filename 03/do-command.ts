import {CommandEnum} from './command.enum';

import {Command} from './command';

export class DoCommand extends Command<CommandEnum.DO> {

    constructor() {
        super(CommandEnum.DO);
    }
}
