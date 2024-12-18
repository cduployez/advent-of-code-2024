import {ProgramInput} from './program-input';

export class Day17 {
    static part1(inputFilePath: string): string {
        const program = new ProgramInput(inputFilePath).parse();
        program.display();
        const outputs = program.run();
        console.log(outputs.join(','));
        return outputs.join(',');
    }

    static part2(inputFilePath: string): string {
        return '0';
    }
}

const startTime = performance.now();
// console.log('Part 1 - Example: ', Day17.part1('example-input.txt')); // 4,6,3,5,6,3,5,2,1,0
// console.log('Part 1 - Example2: ', Day17.part1('example-input2.txt')); // Sets register B to 1
// console.log('Part 1 - Example3: ', Day17.part1('example-input3.txt')); // 0,1,2
// console.log('Part 1 - Example4: ', Day17.part1('example-input4.txt')); // 4,2,5,6,7,7,7,7,3,1,0
// console.log('Part 1 - Example5: ', Day17.part1('example-input5.txt')); // Sets register B to 26
// console.log('Part 1 - Example6: ', Day17.part1('example-input6.txt')); // Sets register B to 44354
console.log('Part 1 - Puzzle: ', Day17.part1('puzzle-input.txt')); // 3,1,5,3,7,4,2,7,5

// console.log('Part 2 - Example: ', Day17.part2('example-input.txt')); //
// console.log('Part 2 - Puzzle: ', Day17.part2('puzzle-input.txt')); //
const endTime = performance.now();
console.log(`Call to method took ${endTime - startTime} milliseconds`);

