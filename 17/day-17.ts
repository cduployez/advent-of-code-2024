import {ProgramInput} from './program-input';

export class Day17 {
    static part1(inputFilePath: string): string {
        const program = new ProgramInput(inputFilePath).parse();
        console.log(program);
        const outputs = program.run();
        console.log(outputs.join(','));
        return outputs.join('');
    }

    static part2(inputFilePath: string): string {
        return '0';
    }
}

const startTime = performance.now();
// console.log('Part 1 - Example: ', Day17.part1('example-input.txt')); // 4635635210
console.log('Part 1 - Puzzle: ', Day17.part1('puzzle-input.txt')); // Not 315374275, Not 215523367
// console.log('Part 2 - Example: ', Day17.part2('example-input.txt')); //
// console.log('Part 2 - Puzzle: ', Day17.part2('puzzle-input.txt')); //
const endTime = performance.now();
console.log(`Call to method took ${endTime - startTime} milliseconds`);

