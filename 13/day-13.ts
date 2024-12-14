import {Input} from '../input';
import {Position} from '../position';

class Equation {
    aMultiplier: number; // x or z
    bMultiplier: number; // y or w
    result: number; // c or d

    constructor(aMultiplier: number, bMultiplier: number, result: number) {
        this.aMultiplier = aMultiplier;
        this.bMultiplier = bMultiplier;
        this.result = result;
    }
}

class DoubleEquation {
    equation1: Equation;
    equation2: Equation;


    constructor(equation1: Equation, equation2: Equation) {
        this.equation1 = equation1;
        this.equation2 = equation2;
    }

    solve(): { a: number, b: number } {
        // Equation 1 values : xA + yB = c
        const x = this.equation1.aMultiplier;
        const y = this.equation1.bMultiplier;
        const c = this.equation1.result;
        // Equation 2 values: zA + wB = d
        const z = this.equation2.aMultiplier;
        const w = this.equation2.bMultiplier;
        const d = this.equation2.result;
        // Solve the system of equations
        const b = (z * c - x * d) / (z * y - x * w);
        const a = (c - y * b) / x;
        return {a, b};
    }
}

enum ButtonEnum {
    A = 'A',
    B = 'B'
}

class MathUtils {
    static isRound(num: number): boolean {
        return num % 1 === 0;
    }
}

const COST = {
    [ButtonEnum.A]: 3,
    [ButtonEnum.B]: 1
};

class Button {
    constructor(public readonly buttonEnum: ButtonEnum,
                public readonly vectorPosition: Position,
                public readonly nbTokens: number) {
    }
}

class A extends Button {
    constructor(vector: Position) {
        super(ButtonEnum.A, vector, COST[ButtonEnum.A]);
    }
}

class B extends Button {
    constructor(vector: Position) {
        super(ButtonEnum.B, vector, COST[ButtonEnum.B]);
    }
}


class Machine {
    a: A;
    b: B;
    prizePosition: Position;

    constructor(aVector: Position, bVector: Position, prizePosition: Position) {
        this.a = new A(aVector);
        this.b = new B(bVector);
        this.prizePosition = prizePosition;
    }

    solve(): { nbA: number, nbB: number } {
        const xEquation = new Equation(this.a.vectorPosition.x, this.b.vectorPosition.x, this.prizePosition.x);
        const yEquation = new Equation(this.a.vectorPosition.y, this.b.vectorPosition.y, this.prizePosition.y);
        const doubleEquation = new DoubleEquation(xEquation, yEquation);
        const {a, b} = doubleEquation.solve();
        const ok = MathUtils.isRound(a) && MathUtils.isRound(b);
        console.log(`[${ok ? 'OK' : '--'}] A: ${a}, B: ${b}`);
        return {nbA: a, nbB: b};
    }

    getNbTokens(maxNbA: number | null, maxNbB: number | null): number {
        const nbMoves = this.solve();
        if (MathUtils.isRound(nbMoves.nbA) && MathUtils.isRound(nbMoves.nbB)) {
            if (maxNbA && maxNbB && (nbMoves.nbA > maxNbA || nbMoves.nbB > maxNbB)) {
                return 0;
            }
            return nbMoves.nbA * this.a.nbTokens + nbMoves.nbB * this.b.nbTokens;
        }
        return 0;
    }

    static getTotalTokens(machines: Machine[], maxNbA: number | null, maxNbB: number | null): number {
        return machines.reduce((acc, machine) => acc + machine.getNbTokens(maxNbA, maxNbB), 0);
    }
}

class MachinesInput extends Input<Machine[]> {

    constructor(filePath: string) {
        super(filePath);
    }

    parse(): Machine[] {
        const lines = this.toText().split('\n').filter(line => line.length > 0);
        const machines: Machine[] = [];
        for (let i = 0; i < lines.length; i += 3) {
            // Button A - Button A: X+94, Y+34
            const aLine = lines[i];
            const aVector = this.toButtonVector(aLine);
            // Button B - Button B: X+22, Y+67
            const bLine = lines[i + 1];
            const bVector = this.toButtonVector(bLine);
            // Prize - Prize: X=8400, Y=5400
            const prizeLine = lines[i + 2];
            const prizePosition = this.toPrizePosition(prizeLine);
            // Add machine
            machines.push(new Machine(aVector, bVector, prizePosition));
        }
        return machines;
    }

    private toButtonVector(line: string): Position {
        const matches = line.matchAll(/[XY]([+-]\d+)/g);
        const values: number[] = Array.from(matches).map(match => parseInt(match[1]));
        if (values.length !== 2) {
            throw new Error('Invalid button vector');
        }
        return new Position(values[0], values[1]);
    }

    private toPrizePosition(line: string): Position {
        const matches = line.matchAll(/[XY]=(\d+)/g);
        const values: number[] = Array.from(matches).map(match => parseInt(match[1]));
        if (values.length !== 2) {
            throw new Error('Invalid prize vector');
        }
        return new Position(values[0], values[1]);
    }
}

class Day13 {
    static part1(inputFilePath: string): number {
        const machines = new MachinesInput(inputFilePath).parse();
        return Machine.getTotalTokens(machines, 100, 100);
    }

    static part2(inputFilePath: string): number {
        const machines = new MachinesInput(inputFilePath).parse();
        machines.forEach(machine => {
            machine.prizePosition.x += 10000000000000;
            machine.prizePosition.y += 10000000000000;
        })
        return Machine.getTotalTokens(machines, null, null);
    }
}

const startTime = performance.now();
// console.log('Part 1 - Example: ', Day13.part1('simple-input.txt')); // 280
// console.log('Part 1 - Example: ', Day13.part1('example-input.txt')); // 480
// console.log('Part 1 - Input: ', Day13.part1('puzzle-input.txt')); // 26005
// console.log('Part 2 - Example: ', Day13.part2('example-input.txt')); // 875318608908
console.log('Part 2 - Input: ', Day13.part2('puzzle-input.txt')); // 105620095782547
const endTime = performance.now();
console.log(`Call to method took ${endTime - startTime} milliseconds`);

