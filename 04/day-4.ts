import {CrossWordInput} from './cross-word-input';
import {CrossWord} from './cross-word';

class Day4 {
    static part1(inputFilePath: string): number {
        const lines: string[] = new CrossWordInput(inputFilePath).parse();
        return CrossWord.countWord(lines, 'XMAS');
    }

    static part2(inputFilePath: string): number {
        return 0;
    }
}

console.log('Part 1 - Example: ', Day4.part1('example-input.txt')); // 18
console.log('Part 1 - Input: ', Day4.part1('puzzle-input.txt')); // 2654
// console.log('Part 2 - Example: ', Day4.part2('example-input.txt')); //
// console.log('Part 2 - Input: ', Day4.part2('puzzle-input.txt')); //
