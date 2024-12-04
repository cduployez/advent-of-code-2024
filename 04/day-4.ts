import {CrossWordInput} from './cross-word-input';
import {CrossWord} from './cross-word';

class Day4 {
    static part1(inputFilePath: string): number {
        const lines: string[][] = new CrossWordInput(inputFilePath).parse();
        const horizontalGrid: string[][] = [['X', 'M', 'A', 'S']];
        const horizontalCount = CrossWord.countGrid(lines, horizontalGrid);
        const horizontalReverseGrid: string[][] = [['S', 'A', 'M', 'X']];
        const horizontalReverseCount = CrossWord.countGrid(lines, horizontalReverseGrid);
        const verticalGrid: string[][] = [['X'], ['M'], ['A'], ['S']];
        const verticalCount = CrossWord.countGrid(lines, verticalGrid);
        const verticalReverseGrid: string[][] = [['S'], ['A'], ['M'], ['X']];
        const verticalReverseCount = CrossWord.countGrid(lines, verticalReverseGrid);
        const diagonalTopLeftToBottomRightGrid = `X...
.M..
..A.
...S`.split('\n').map(l => l.split(''));
        const diagonalTopLeftToBottomRightCount = CrossWord.countGrid(lines, diagonalTopLeftToBottomRightGrid);
        const diagonalTopLeftToBottomRightReverseGrid = `S...
.A..
..M.
...X`.split('\n').map(l => l.split(''));
        const diagonalTopLeftToBottomRightReverseCount = CrossWord.countGrid(lines, diagonalTopLeftToBottomRightReverseGrid);
        const diagonalTopRightToBottomLeftCount = CrossWord.countGrid(CrossWord.reverseLines(lines), diagonalTopLeftToBottomRightGrid);
        const diagonalTopRightToBottomLeftReverseCount = CrossWord.countGrid(CrossWord.reverseLines(lines), diagonalTopLeftToBottomRightReverseGrid);
        return horizontalCount + verticalCount + horizontalReverseCount + verticalReverseCount + diagonalTopLeftToBottomRightCount + diagonalTopLeftToBottomRightReverseCount + diagonalTopRightToBottomLeftCount + diagonalTopRightToBottomLeftReverseCount;
    }

    static part2(inputFilePath: string): number {
        const lines: string[][] = new CrossWordInput(inputFilePath).parse();
        const grid1: string[][] = `M.S
.A.
M.S`.split('\n').map(l => l.split(''));
        const grid1Count = CrossWord.countGrid(lines, grid1);

        const grid2: string[][] = `S.M
.A.
S.M`.split('\n').map(l => l.split(''));
        const grid2Count = CrossWord.countGrid(lines, grid2);

        const grid3: string[][] = `S.S
.A.
M.M`.split('\n').map(l => l.split(''));
        const grid3Count = CrossWord.countGrid(lines, grid3);

        const grid4: string[][] = `M.M
.A.
S.S`.split('\n').map(l => l.split(''));
        const grid4Count = CrossWord.countGrid(lines, grid4);

        return grid1Count + grid2Count + grid3Count + grid4Count;
    }
}

console.log('Part 1 - Example: ', Day4.part1('example-input.txt')); // 18
console.log('Part 1 - Input: ', Day4.part1('puzzle-input.txt')); // 2654
console.log('Part 2 - Example: ', Day4.part2('example-input.txt')); // 9
console.log('Part 2 - Input: ', Day4.part2('puzzle-input.txt')); // 1990
