import {OperationEnum} from './operation-enum';
import {Configuration} from './configuration';
import {Equation} from './equation';
import {EquationsInput} from './equations-input';

class Day7 {
    static part1(inputFilePath: string): number {
        Configuration.allowedOperations = [OperationEnum.ADD, OperationEnum.MULTIPLY];
        const equations = new EquationsInput(inputFilePath).parse();
        return Equation.getSolvableCalculationResult(equations);
    }

    static part2(inputFilePath: string): number {
        Configuration.allowedOperations = [OperationEnum.ADD, OperationEnum.MULTIPLY, OperationEnum.CONCAT];
        const equations = new EquationsInput(inputFilePath).parse();
        return Equation.getSolvableCalculationResult(equations);
    }
}

const startTime = performance.now();
console.log('Part 1 - Example: ', Day7.part1('example-input.txt')); // 3749
console.log('Part 1 - Input: ', Day7.part1('puzzle-input.txt')); // 5512534574980
console.log('Part 2 - Example: ', Day7.part2('example-input.txt')); // 11387
console.log('Part 2 - Input: ', Day7.part2('puzzle-input.txt')); // 328790210468594
const endTime = performance.now();
console.log(`Call to method took ${endTime - startTime} milliseconds`);

