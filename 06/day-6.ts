import {BoardInput} from './board-input';
import {Board} from './board';

class Day6 {
    static part1(inputFilePath: string): number {
        const board: Board = new BoardInput(inputFilePath).parse();
        board.logBoard();
        board.play();
        board.logBoard();
        return board.countVisited();
    }

    static part2(inputFilePath: string): number {
        return 0;
    }
}

console.log('Part 1 - Example: ', Day6.part1('example-input.txt')); // 41
console.log('Part 1 - Input: ', Day6.part1('puzzle-input.txt')); // 5409
// console.log('Part 2 - Example: ', Day6.part2('example-input.txt')); //
// console.log('Part 2 - Input: ', Day6.part2('puzzle-input.txt')); //
