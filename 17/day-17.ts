import {Input} from '../input';

enum RegisterEnum {
    A = 'A',
    B = 'B',
    C = 'C'
}

abstract class Operand {
    protected operandValue: number;

    constructor(value: number) {
        this.operandValue = value;
    }

    abstract get value(): number;
}

class LiteralOperand extends Operand {
    constructor(operandValue: number) {
        super(operandValue);
    }

    get value(): number {
        return this.operandValue;
    }
}

class RegisterOperand extends Operand {
    private registerEnum: RegisterEnum;
    private registers: Record<RegisterEnum, number>;

    constructor(operandValue: number, registerEnum: RegisterEnum, registers: Record<RegisterEnum, number>) {
        super(operandValue);
        this.registerEnum = registerEnum;
        this.registers = registers;
    }

    get value(): number {
        return this.registers[this.registerEnum];
    }
}

class OperandFactory {
    static create(operandValue: number, registers: Record<RegisterEnum, number>): Operand {
        if (operandValue >= 0 && operandValue <= 3) {
            return new LiteralOperand(operandValue);
        } else if (operandValue === 4) {
            return new RegisterOperand(operandValue, RegisterEnum.A, registers);
        } else if (operandValue === 5) {
            return new RegisterOperand(operandValue, RegisterEnum.B, registers);
        } else if (operandValue === 6) {
            return new RegisterOperand(operandValue, RegisterEnum.C, registers);
        }
        throw new Error(`Invalid operand value ${operandValue}`);
    }
}

class Instruction {
    opcode: Opcode;
    operand: Operand;

    constructor(opcode: number, operand: number, registers: Record<RegisterEnum, number>) {
        this.operand = OperandFactory.create(operand, registers);
        this.opcode = OpCodeFactory.create(opcode, this.operand);
    }

    run(registers: Record<RegisterEnum, number>): Result {
        return this.opcode.run(registers);
    }
}

class Result {
    output: number | null;
    jump: number | null;

    constructor(output: number | null, jump: number | null) {
        this.output = output;
        this.jump = jump;
    }
}

abstract class Opcode {
    opcodeValue: number;
    operand: Operand;

    constructor(opcodeValue: number, operand: Operand) {
        this.opcodeValue = opcodeValue;
        this.operand = operand;
    }

    abstract run(registers: Record<RegisterEnum, number>): Result;
}

/**
 * The adv instruction (opcode 0) performs division. The numerator is the value in the A register.
 * The denominator is found by raising 2 to the power of the instruction's combo operand.
 * (So, an operand of 2 would divide A by 4 (2^2); an operand of 5 would divide A by 2^B.)
 * The result of the division operation is truncated to an integer and then written to the A register.
 */
class AdvOpCode extends Opcode {
    constructor(opcodeValue: number, operand: Operand) {
        super(opcodeValue, operand);
    }

    override run(registers: Record<RegisterEnum, number>): Result {
        const denominator = Math.pow(2, this.operand.value);
        registers[RegisterEnum.A] = Math.trunc(registers[RegisterEnum.A] / denominator);
        return new Result(null, null);
    }
}

/**
 * The bxl instruction (opcode 1) calculates the bitwise XOR of register B and the instruction's literal operand, then stores the result in register B.
 */
class BxlOpCode extends Opcode {
    constructor(opcodeValue: number, operand: Operand) {
        super(opcodeValue, operand);
    }

    override run(registers: Record<RegisterEnum, number>): Result {
        registers[RegisterEnum.B] = registers[RegisterEnum.B] ^ this.operand.value;
        return new Result(null, null);
    }
}

/**
 * The bst instruction (opcode 2) calculates the value of its combo operand modulo 8 (thereby keeping only its lowest 3 bits),
 * then writes that value to the B register.
 */
class BstOpCode extends Opcode {
    constructor(opcodeValue: number, operand: Operand) {
        super(opcodeValue, operand);
    }

    override run(registers: Record<RegisterEnum, number>): Result {
        registers[RegisterEnum.B] = this.operand.value % 8;
        return new Result(null, null);
    }
}

/**
 * The jnz instruction (opcode 3) does nothing if the A register is 0.
 * However, if the A register is not zero, it jumps by setting the instruction pointer to the value of its literal operand;
 * if this instruction jumps, the instruction pointer is not increased by 2 after this instruction.
 */
class JnzOpCode extends Opcode {
    constructor(opcodeValue: number, operand: Operand) {
        super(opcodeValue, operand);
    }

    override run(registers: Record<RegisterEnum, number>): Result {
        if (registers[RegisterEnum.A] === 0) {
            return new Result(null, null);
        }
        return new Result(null, this.operand.value);
    }
}

/**
 * The bxc instruction (opcode 4) calculates the bitwise XOR of register B and register C,
 * then stores the result in register B. (For legacy reasons, this instruction reads an operand but ignores it.)
 */
class BxcOpCode extends Opcode {
    constructor(opcodeValue: number, operand: Operand) {
        super(opcodeValue, operand);
    }

    override run(registers: Record<RegisterEnum, number>): Result {
        registers[RegisterEnum.B] = registers[RegisterEnum.B] ^ registers[RegisterEnum.C];
        return new Result(null, null);
    }
}

/**
 * The out instruction (opcode 5) calculates the value of its combo operand modulo 8, then outputs that value.
 * (If a program outputs multiple values, they are separated by commas.)
 */
class OutOpCode extends Opcode {
    constructor(opcodeValue: number, operand: Operand) {
        super(opcodeValue, operand);
    }

    override run(registers: Record<RegisterEnum, number>): Result {
        return new Result(this.operand.value % 8, null);
    }
}

/**
 * The bdv instruction (opcode 6) works exactly like the adv instruction except that the result is stored in the B register.
 * (The numerator is still read from the A register.)
 */
class BdvOpCode extends Opcode {
    constructor(opcodeValue: number, operand: Operand) {
        super(opcodeValue, operand);
    }

    override run(registers: Record<RegisterEnum, number>): Result {
        const denominator = Math.pow(2, this.operand.value);
        registers[RegisterEnum.B] = Math.floor(registers[RegisterEnum.A] / denominator);
        return new Result(null, null);
    }
}

/**
 * The cdv instruction (opcode 7) works exactly like the adv instruction except that the result is stored in the C register.
 * (The numerator is still read from the A register.)
 */
class CdvOpCode extends Opcode {
    constructor(opcodeValue: number, operand: Operand) {
        super(opcodeValue, operand);
    }

    override run(registers: Record<RegisterEnum, number>): Result {
        const denominator = Math.pow(2, this.operand.value);
        registers[RegisterEnum.C] = Math.floor(registers[RegisterEnum.A] / denominator);
        return new Result(null, null);
    }
}

class OpCodeFactory {
    static create(opcodeValue: number, operand: Operand): Opcode {
        switch (opcodeValue) {
            case 0:
                return new AdvOpCode(opcodeValue, operand);
            case 1:
                return new BxlOpCode(opcodeValue, operand);
            case 2:
                return new BstOpCode(opcodeValue, operand);
            case 3:
                return new JnzOpCode(opcodeValue, operand);
            case 4:
                return new BxcOpCode(opcodeValue, operand);
            case 5:
                return new OutOpCode(opcodeValue, operand);
            case 6:
                return new BdvOpCode(opcodeValue, operand);
            case 7:
                return new CdvOpCode(opcodeValue, operand);
            default:
                throw new Error(`Invalid opcode value ${opcodeValue}`);
        }
    }
}

class Program {
    values: number[];
    registers: Record<RegisterEnum, number> = {
        [RegisterEnum.A]: 0,
        [RegisterEnum.B]: 0,
        [RegisterEnum.C]: 0
    };

    constructor(values: number[], registers: Partial<Record<RegisterEnum, number>>) {
        this.values = values;
        this.registers = {...this.registers, ...registers};
    }

    run(): string[] {
        const outputs: string[] = [];
        let i = 0;
        while (i < this.values.length) {
            const result = new Instruction(this.values[i], this.values[i + 1], this.registers).run(this.registers);
            console.log(`${this.values[i]},${this.values[i + 1]} => ${JSON.stringify(result)} (${JSON.stringify(this.registers)})`);
            if (result.output !== null) {
                outputs.push(result.output.toString());
            }
            if (result.jump !== null) {
                i = result.jump;
            } else {
                i += 2;
            }
        }
        return outputs;
    }
}

class ProgramInput extends Input<Program> {
    parse(): Program {
        const lines = this.toText().split('\n').filter(line => line.length > 0);
        const registers: Record<RegisterEnum, number> = this.parseRegisters(lines);
        const values: number[] = this.parseInstructions(lines, registers);
        return new Program(values, registers);
    }

    private parseRegisters(lines: string[]): Record<RegisterEnum, number> {
        const registerLines: string[] = lines.filter(l => l.startsWith('Register'));
        const registers: Record<RegisterEnum, number> = {A: 0, B: 0, C: 0};
        (Object.keys(RegisterEnum) as RegisterEnum[]).forEach((key: RegisterEnum) => {
            const prefix: string = `Register ${key}: `;
            const value = registerLines.find(l => l.startsWith(prefix))?.split(prefix)[1];
            registers[key] = value ? parseInt(value) : 0;
            console.log(`Register ${key} has value ${registers[key]}`);
        });
        return registers;
    }

    private parseInstructions(lines: string[], registers: Record<RegisterEnum, number>): number[] {
        const prefix = 'Program: ';
        return lines.find(l => l.startsWith(prefix))!.split(prefix)[1].split(',').map(v => parseInt(v));
    }
}

class Day17 {
    static part1(inputFilePath: string): number {
        const program = new ProgramInput(inputFilePath).parse();
        console.log(program);
        const outputs = program.run();
        console.log(outputs.join(','));
        return parseInt(outputs.join(''));
    }

    static part2(inputFilePath: string): number {
        return 0;
    }
}

const startTime = performance.now();
// console.log('Part 1 - Example: ', Day17.part1('simple-input.txt')); //
console.log('Part 1 - Example: ', Day17.part1('example-input.txt')); //
// console.log('Part 1 - Puzzle: ', Day17.part1('puzzle-input.txt')); //
// console.log('Part 2 - Example: ', Day17.part2('example-input.txt')); //
// console.log('Part 2 - Puzzle: ', Day17.part2('puzzle-input.txt')); //
const endTime = performance.now();
console.log(`Call to method took ${endTime - startTime} milliseconds`);

