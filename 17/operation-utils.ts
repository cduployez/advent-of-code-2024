export class OperationUtils {

    static dv(operandValue: number, registerValue: number): number {
        const denominator = Math.pow(2, operandValue);
        return Math.trunc(registerValue / denominator);
    }

    static xor(value1: number, value2: number): number {
        return value1 ^ value2;
    }

}
