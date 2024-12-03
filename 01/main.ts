import {DistanceUtils} from './distance-utils';
import {PuzzleInput} from './puzzle-input';

class Main {
    static main(inputFile: string): number {
        return DistanceUtils.distanceSum(...new PuzzleInput(inputFile).parse());
    }
}

console.log(Main.main('puzzle-input.txt')); // 1530215
