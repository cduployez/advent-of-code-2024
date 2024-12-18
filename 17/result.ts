export class Result {
    output: bigint | null;
    jump: bigint | null;

    constructor(output: bigint | null, jump: bigint | null) {
        this.output = output;
        this.jump = jump;
    }
}
