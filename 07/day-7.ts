import {Input} from '../input';

export enum OperationEnum {
    ADD = 'add',
    MULTIPLY = 'multiply',
}

export class OngoingEquation {
    currentTotal: number;
    remainingNumbers: number[];
    operationEnum: OperationEnum;


    constructor(currentTotal: number, remainingNumbers: number[], operationEnum: OperationEnum) {
        this.remainingNumbers = [...remainingNumbers];
        this.currentTotal = currentTotal;
        this.operationEnum = operationEnum;
    }

    next(): OngoingEquation[] {
        const nextEquations: OngoingEquation[] = [];
        const nextNumber = this.remainingNumbers.shift();
        if (nextNumber) {
            nextEquations.push(new OngoingEquation(this.currentTotal + nextNumber, this.remainingNumbers, OperationEnum.ADD));
            nextEquations.push(new OngoingEquation(this.currentTotal * nextNumber, this.remainingNumbers, OperationEnum.MULTIPLY));
        }
        return nextEquations;
    }

    static fromEquation(equation: Equation): OngoingEquation[] {
        if (equation.remainingNumbers.length < 2) {
            throw new Error('Equation must have at least 2 numbers');
        }
        const firstNumber = equation.remainingNumbers.shift();
        const secondNumber = equation.remainingNumbers.shift();
        const add = new OngoingEquation(firstNumber + secondNumber, equation.remainingNumbers, OperationEnum.ADD);
        const multiply = new OngoingEquation(firstNumber * secondNumber, equation.remainingNumbers, OperationEnum.MULTIPLY);
        return [add, multiply];
    }
}

export class Equation {
    readonly testValue: number;
    remainingNumbers: number[];

    constructor(testValue: number, remainingNumbers: number[]) {
        this.testValue = testValue;
        this.remainingNumbers = remainingNumbers;
    }

    /**
     * Returns true if testValue can be calculated from the remaining numbers
     */
    solve(): boolean {
        const ongoingEquations: OngoingEquation[] = OngoingEquation.fromEquation(this);
        while (ongoingEquations.length > 0) {
            const ongoingEquation = ongoingEquations.shift();
            if (ongoingEquation) {
                if (ongoingEquation.remainingNumbers.length === 0) {
                    if (ongoingEquation.currentTotal === this.testValue) {
                        return true;
                    }
                } else {
                    ongoingEquations.push(...ongoingEquation.next());
                }
            }
        }
        return false;
    }

    static getSolvableCalculationResult(equations: Equation[]): number {
        const solvableEquations = equations.filter(equation => equation.solve());
        console.log('Solvable equations: ', solvableEquations);
        // Add testValue
        return solvableEquations.reduce((acc, equation) => acc + equation.testValue, 0);
    }
}

export class EquationsInput extends Input<Equation[]> {
    constructor(filePath: string) {
        super(filePath);
    }

    parse(): Equation[] {
        // Format: <testValue>: <remainingNumber 1> <remainingNumber 2> ... <remainingNumber n>
        return this.toText().split('\n').filter(line => line.length > 0).map(line => {
            const [testValue, ...remainingNumbers] = line.split(/[: ]+/);
            return new Equation(parseInt(testValue.trim()), remainingNumbers.map(n => {
                return parseInt(n.trim())
            }));
        });
    }
}

class Day7 {
    static part1(inputFilePath: string): number {
        const equations = new EquationsInput(inputFilePath).parse();
        return Equation.getSolvableCalculationResult(equations);
    }

    static part2(inputFilePath: string): number {
        return 0;
    }
}

const startTime = performance.now();
console.log('Part 1 - Example: ', Day7.part1('example-input.txt')); // 3749
console.log('Part 1 - Input: ', Day7.part1('puzzle-input.txt')); // 5512534574980
// console.log('Part 2 - Example: ', Day7.part2('example-input.txt')); //
// console.log('Part 2 - Input: ', Day7.part2('puzzle-input.txt')); //
const endTime = performance.now();
console.log(`Call to method took ${endTime - startTime} milliseconds`);

