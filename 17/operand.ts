export abstract class Operand {
    protected operandValue: bigint;

    constructor(value: bigint) {
        this.operandValue = value;
    }

    abstract get value(): bigint;
}
