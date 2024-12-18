export class OperationUtils {

    static dv(operandValue: bigint, registerValue: bigint): bigint {
        const denominator = 2n ** operandValue;
        return registerValue / denominator;
    }

    static xor(value1: bigint, value2: bigint): bigint {
        return value1 ^ value2;
    }

    static fromBinaryString(value: string): number {
        return parseInt(value, 2);
    }

    static toBinaryString(value: number): string {
        return value.toString(2);
    }
}
