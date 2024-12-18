export class OperationUtils {

    static dv(operandValue: bigint, registerValue: bigint): bigint {
        const denominator = 2n ** operandValue;
        return registerValue / denominator;
    }

    static xor(value1: bigint, value2: bigint): bigint {
        return value1 ^ value2;
    }

}
