import {OperationEnum} from './operation-enum';
import {Configuration} from './configuration';

import {Equation} from './equation';

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
