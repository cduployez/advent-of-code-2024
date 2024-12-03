import {DistanceUtils} from './distance-utils';
import {PuzzleInput} from './puzzle-input';

class Main {
    static part1(inputFile: string): number {
        const [leftList, rightList] = new PuzzleInput(inputFile).parse();
        return DistanceUtils.distanceSum(leftList, rightList);
    }

    static part2(inputFile: string): number {
        const [leftList, rightList] = new PuzzleInput(inputFile).parse();
        return DistanceUtils.similarityScore(leftList, rightList);
    }
}

console.log('Part 1 - Example: ', Main.part1('example-input.txt')); // 11
console.log('Part 1 - Input: ', Main.part1('puzzle-input.txt')); // 1530215
console.log('Part 2 - Example: ', Main.part2('example-input.txt')); // 31
console.log('Part 2 - Input: ', Main.part2('puzzle-input.txt')); // 26800609
