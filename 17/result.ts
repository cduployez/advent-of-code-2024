export class Result {
    output: number | null;
    jump: number | null;

    constructor(output: number | null, jump: number | null) {
        this.output = output;
        this.jump = jump;
    }
}
