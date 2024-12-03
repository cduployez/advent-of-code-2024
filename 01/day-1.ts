import {DistanceUtils} from './distance-utils';
import {PuzzleInput} from './puzzle-input';

class Day1 {
    static part1(inputFile: string): number {
        const [leftList, rightList] = new PuzzleInput(inputFile).parse();
        return DistanceUtils.distanceSum(leftList, rightList);
    }

    static part2(inputFile: string): number {
        const [leftList, rightList] = new PuzzleInput(inputFile).parse();
        return DistanceUtils.similarityScore(leftList, rightList);
    }
}

console.log('Part 1 - Example: ', Day1.part1('example-input.txt')); // 11
console.log('Part 1 - Input: ', Day1.part1('puzzle-input.txt')); // 1530215
console.log('Part 2 - Example: ', Day1.part2('example-input.txt')); // 31
console.log('Part 2 - Input: ', Day1.part2('puzzle-input.txt')); // 26800609
