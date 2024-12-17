import {Input} from '../input';

class NullInput extends Input<null> {
    parse(): null {
        const lines = this.toText().split('\n').filter(line => line.length > 0);
        return null;
    }
}

class DayXX {
    static part1(inputFilePath: string): number {
        return 0;
    }

    static part2(inputFilePath: string): number {
        return 0;
    }
}

const startTime = performance.now();
console.log('Part 1 - Example: ', DayXX.part1('example-input.txt')); //
// console.log('Part 1 - Puzzle: ', DayXX.part1('puzzle-input.txt')); //
// console.log('Part 2 - Example: ', DayXX.part2('example-input.txt')); //
// console.log('Part 2 - Puzzle: ', DayXX.part2('puzzle-input.txt')); //
const endTime = performance.now();
console.log(`Call to method took ${endTime - startTime} milliseconds`);

