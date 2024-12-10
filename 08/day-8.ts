import {BoardInput} from './board-input';

class Day8 {
    static part1(inputFilePath: string): number {
        const board = new BoardInput(inputFilePath).parse();
        // board.displayBoard();
        board.generateAntinodes();
        // console.log(board.antinodes.map(a => `Antinode at (${a.position.x}, ${a.position.y}) for Antennas ${a.antennas[0].name} and ${a.antennas[1].name}`));
        // board.displayBoard();
        return board.antinodes.length;
    }

    static part2(inputFilePath: string): number {
        const board = new BoardInput(inputFilePath).parse();
        // board.displayBoard();
        board.generateAntinodes(true);
        // console.log(board.antinodes.map(a => `Antinode at (${a.position.x}, ${a.position.y}) for Antennas ${a.antennas[0].name} and ${a.antennas[1].name}`));
        // board.displayBoard();
        return board.antinodes.length;
    }
}

const startTime = performance.now();
console.log('Part 1 - Tutorial: ', Day8.part1('part1-tutorial-input.txt')); // 2
console.log('Part 1 - Example: ', Day8.part1('example-input.txt')); // 14
console.log('Part 1 - Input: ', Day8.part1('puzzle-input.txt')); // 303
console.log('Part 2 - Tutorial: ', Day8.part2('part2-tutorial-input.txt')); // 9
console.log('Part 2 - Example: ', Day8.part2('example-input.txt')); // 34
console.log('Part 2 - Input: ', Day8.part2('puzzle-input.txt')); // 1045
const endTime = performance.now();
console.log(`Call to method took ${endTime - startTime} milliseconds`);

