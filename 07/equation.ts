import {OngoingEquation} from './ongoing-equation';

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
