export class MulCommand {

    x: number;
    y: number;

    constructor(command: `mul(${number},${number})`) {
        const [x, y] = command.substring(4, command.length - 1).split(',').map(n => parseInt(n));
        this.x = x;
        this.y = y;

    }

    mul(): number {
        return this.x * this.y;
    }
}
