import {Input} from '../input';

export enum OperationEnum {
    ADD = 'add',
    MULTIPLY = 'multiply',
    CONCAT = 'concat'
}

export class Configuration {
    static allowedOperations: OperationEnum[] = [OperationEnum.ADD, OperationEnum.MULTIPLY, OperationEnum.CONCAT];
}

export class OngoingEquation {
    currentTotal: number;
    remainingNumbers: number[];
    operationEnum: OperationEnum;

    operators: Record<OperationEnum, (nextNumber: number) => OngoingEquation> = {
        [OperationEnum.ADD]: (nextNumber: number) => new OngoingEquation(this.currentTotal + nextNumber, this.remainingNumbers, OperationEnum.ADD),
        [OperationEnum.MULTIPLY]: (nextNumber: number) => new OngoingEquation(this.currentTotal * nextNumber, this.remainingNumbers, OperationEnum.MULTIPLY),
        [OperationEnum.CONCAT]: (nextNumber: number) => new OngoingEquation(parseInt(this.currentTotal.toString() + nextNumber.toString()), this.remainingNumbers, OperationEnum.CONCAT)
    };


    constructor(currentTotal: number, remainingNumbers: number[], operationEnum: OperationEnum) {
        this.remainingNumbers = [...remainingNumbers];
        this.currentTotal = currentTotal;
        this.operationEnum = operationEnum;
    }

    static fromEquation(equation: Equation): OngoingEquation[] {
        if (equation.remainingNumbers.length < 2) {
            throw new Error('Equation must have at least 2 numbers');
        }
        const firstNumber = equation.remainingNumbers.shift();
        const secondNumber = equation.remainingNumbers.shift();
        const array: OngoingEquation[] = [];
        if (Configuration.allowedOperations.includes(OperationEnum.ADD)) {
            const add = new OngoingEquation(firstNumber + secondNumber, equation.remainingNumbers, OperationEnum.ADD);
            array.push(add);
        }
        if (Configuration.allowedOperations.includes(OperationEnum.MULTIPLY)) {
            const multiply = new OngoingEquation(firstNumber * secondNumber, equation.remainingNumbers, OperationEnum.MULTIPLY);
            array.push(multiply);
        }
        if (Configuration.allowedOperations.includes(OperationEnum.CONCAT)) {
            const concat = new OngoingEquation(parseInt(firstNumber.toString() + secondNumber.toString()), equation.remainingNumbers, OperationEnum.CONCAT);
            array.push(concat);
        }
        return array;
    }

    next(): OngoingEquation[] {
        const nextEquations: OngoingEquation[] = [];
        const nextNumber = this.remainingNumbers.shift();
        if (nextNumber) {
            Configuration.allowedOperations.forEach(operation => {
                nextEquations.push(this.operators[operation](nextNumber));
            });
        }
        return nextEquations;
    }
}

export class Equation {
    readonly testValue: number;
    remainingNumbers: number[];

    constructor(testValue: number, remainingNumbers: number[]) {
        this.testValue = testValue;
        this.remainingNumbers = remainingNumbers;
    }

    static getSolvableCalculationResult(equations: Equation[]): number {
        const solvableEquations = equations.filter(equation => equation.solve());
        // Add testValue
        return solvableEquations.reduce((acc, equation) => acc + equation.testValue, 0);
    }

    displayLog(): void {
        console.log(`${this.testValue}: ${this.remainingNumbers.join(' ')}`);
    }

    /**
     * Returns true if testValue can be calculated from the remaining numbers
     */
    solve(): boolean {
        this.displayLog();
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
                return parseInt(n.trim());
            }));
        });
    }
}

class Day7 {
    static part1(inputFilePath: string): number {
        Configuration.allowedOperations = [OperationEnum.ADD, OperationEnum.MULTIPLY];
        const equations = new EquationsInput(inputFilePath).parse();
        return Equation.getSolvableCalculationResult(equations);
    }

    static part2(inputFilePath: string): number {
        Configuration.allowedOperations = [OperationEnum.ADD, OperationEnum.MULTIPLY, OperationEnum.CONCAT];
        const equations = new EquationsInput(inputFilePath).parse();
        return Equation.getSolvableCalculationResult(equations);
    }
}

const startTime = performance.now();
console.log('Part 1 - Example: ', Day7.part1('example-input.txt')); // 3749
console.log('Part 1 - Input: ', Day7.part1('puzzle-input.txt')); // 5512534574980
console.log('Part 2 - Example: ', Day7.part2('example-input.txt')); // 11387
console.log('Part 2 - Input: ', Day7.part2('puzzle-input.txt')); // 328790210468594
const endTime = performance.now();
console.log(`Call to method took ${endTime - startTime} milliseconds`);

