import {Input} from '../input';

const MULTIPLY_NUMBER: number = 2024;

class Stone {
    value: number;

    get textValue(): string {
        return this.value.toString();
    }

    constructor(value: number) {
        this.value = value;
    }

    leftHalfOfTextValue(): string {
        return this.removeLeadingZeros(this.textValue.slice(0, this.textValue.length / 2));
    }

    rightHalfOfTextValue(): string {
        return this.removeLeadingZeros(this.textValue.slice(this.textValue.length / 2));
    }

    removeLeadingZeros(text: string): string {
        return text.replace(/[0+]$/, '0');
    }

    blink(): Stone[] {
        if (this.isEngravedWithZero()) {
            return [new Stone(1)];
        } else if (this.isEngravedWithAnEvenNumberOfDigits()) {
            // The left half of the digits on the left stone
            const leftStone = new Stone(parseInt(this.leftHalfOfTextValue()));
            // The right half of the digits on the right stone
            const rightStone = new Stone(parseInt(this.rightHalfOfTextValue()));
            return [leftStone, rightStone];
        } else {
            return [new Stone(this.value * MULTIPLY_NUMBER)];
        }
    }

    isEngravedWithZero(): boolean {
        return this.value === 0;
    }

    isEngravedWithAnEvenNumberOfDigits(): boolean {
        return this.textValue.length % 2 === 0;
    }

    static display(stones: Stone[]): void {
        console.log(stones.map(s => s.value).join(' '));
    }

    static blinkAll(stones: Stone[]): Stone[] {
        return stones.map(s => s.blink()).flat();
    }
}

class StonesInput extends Input<Stone[]> {
    parse(): Stone[] {
        return this.toText().split('\n')[0].split(' ').map(value => new Stone(parseInt(value)));
    }

}

class Day10 {
    static part1(inputFilePath: string, nbBlinks: number): number {
        let stones = new StonesInput(inputFilePath).parse();
        Stone.display(stones);
        for (let i = 0; i < nbBlinks; i++) {
            console.log(`After ${i + 1} blinks:`);
            const newStones = Stone.blinkAll(stones);
            Stone.display(newStones);
            stones = newStones;
        }
        return stones.length;
    }

    static part2(inputFilePath: string): number {
        return 0;
    }
}

const startTime = performance.now();
// console.log('Part 1 - Example: ', Day10.part1('example-input.txt', 1)); // 7
// console.log('Part 1 - Example: ', Day10.part1('example-input2.txt', 6)); // 22
// console.log('Part 1 - Example: ', Day10.part1('example-input2.txt', 25)); // 55312
console.log('Part 1 - Input: ', Day10.part1('puzzle-input.txt', 25)); //
// console.log('Part 2 - Example: ', Day10.part2('example-input.txt')); //
// console.log('Part 2 - Input: ', Day10.part2('puzzle-input.txt')); //
const endTime = performance.now();
console.log(`Call to method took ${endTime - startTime} milliseconds`);

