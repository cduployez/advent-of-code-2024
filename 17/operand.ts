export abstract class Operand {
    protected operandValue: number;

    constructor(value: number) {
        this.operandValue = value;
    }

    abstract get value(): number;
}
