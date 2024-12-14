import {Input} from '../input';

const MULTIPLY_NUMBER: number = 2024;

class Stone {
    value: number;
    nbOccurrences: number = 1;

    constructor(value: number, nbOccurrences: number) {
        this.value = value;
        this.nbOccurrences = nbOccurrences;
    }

    get textValue(): string {
        return this.value.toString();
    }

    static display(stones: Stone[]): void {
        console.log(stones.map(s => s.value).join(' '));
    }

    static blinkAll(stones: Stone[]): Stone[] {
        return stones.map(s => s.blink()).flat();
    }

    static blinkOneStoneAtATimeMultipleTimes(stones: Stone[], nbBlinks: number): Stone[] {
        let blinkedStones: Stone[] = [];
        for (let stoneIndex = 0; stoneIndex < stones.length; stoneIndex++) {
            console.log(`Blinking stone ${stoneIndex + 1}...`);
            const stone = stones[stoneIndex];
            blinkedStones.push(...stone.getNbStonesAfterMultipleBlinks(stone, nbBlinks));
        }
        return blinkedStones;
    }

    static blinkAllMultipleTimes(stones: Stone[], nbBlinks: number): Stone[] {
        for (let i = 0; i < nbBlinks; i++) {
            console.log(`After ${i + 1} blinks:`);
            stones = Stone.blinkAll(stones);
            // Group stones by value
            const groupedStones: { [key: number]: Stone } = {};
            stones.forEach(stone => {
                if (!groupedStones[stone.value]) {
                    groupedStones[stone.value] = stone;
                } else {
                    groupedStones[stone.value].nbOccurrences += stone.nbOccurrences;
                }
            });
            stones = Object.values(groupedStones);
        }
        return stones;
    }

    getNbStonesAfterMultipleBlinks(stone: Stone, nbBlinks: number): Stone[] {
        let stones: Stone[] = [stone];
        for (let i = 0; i < nbBlinks; i++) {
            console.log(`After ${i + 1} blinks:`);
            stones = stones.map(s => s.blink()).flat();
        }
        return stones;
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
        let stones: Stone[];
        if (this.isEngravedWithZero()) {
            stones = [new Stone(1, this.nbOccurrences)];
        } else if (this.isEngravedWithAnEvenNumberOfDigits()) {
            // The left half of the digits on the left stone
            const leftStone = new Stone(parseInt(this.leftHalfOfTextValue()), this.nbOccurrences);
            // The right half of the digits on the right stone
            const rightStone = new Stone(parseInt(this.rightHalfOfTextValue()), this.nbOccurrences);
            stones = [leftStone, rightStone];
        } else {
            stones = [new Stone(this.value * MULTIPLY_NUMBER, this.nbOccurrences)];
        }
        return stones;
    }

    isEngravedWithZero(): boolean {
        return this.value === 0;
    }

    isEngravedWithAnEvenNumberOfDigits(): boolean {
        return this.textValue.length % 2 === 0;
    }

    static getNbStones(stones: Stone[]): number {
        // Should be the sum of the number of occurrences of each stone
        return stones.map(s => s.nbOccurrences).reduce((acc, value) => acc + value, 0);
    }
}

class StonesInput extends Input<Stone[]> {
    parse(): Stone[] {
        return this.toText().split('\n')[0].split(' ').map(value => new Stone(parseInt(value), 1));
    }

}

class Day11 {
    static part1(inputFilePath: string, nbBlinks: number): number {
        let stones = new StonesInput(inputFilePath).parse();
        Stone.display(stones);
        stones = Stone.blinkAllMultipleTimes(stones, nbBlinks);
        return Stone.getNbStones(stones);
    }

    static part2(inputFilePath: string, nbBlinks: number): number {
        return Day11.part1(inputFilePath, nbBlinks);
    }
}

const startTime = performance.now();
// console.log('Part 1 - Example: ', Day11.part1('example-input.txt', 1)); // 7
// console.log('Part 1 - Example: ', Day11.part1('example-input2.txt', 6)); // 22
// console.log('Part 1 - Example: ', Day11.part1('example-input2.txt', 25)); // 55312
// console.log('Part 1 - Input: ', Day11.part1('puzzle-input.txt', 25)); // 199982
// console.log('Part 2 - Input: ', Day11.part2('puzzle-input.txt', 25)); // 199982
// console.log('Part 2 - Input: ', Day11.part2('puzzle-input.txt', 75)); // 237149922829154
const endTime = performance.now();
console.log(`Call to method took ${endTime - startTime} milliseconds`);

