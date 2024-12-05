import {InputResult} from './input-result';
import {UpdatePageNumberUtils} from './update-page-number-utils';
import {PageInput} from './page-input';

class Day5 {
    static part1(inputFilePath: string): number {
        const input: InputResult = new PageInput(inputFilePath).parse();
        return UpdatePageNumberUtils.addVerifiedMiddlePageNumbers(input.updatePageNumbers, input.pageOrderingRuleMap);
    }

    static part2(inputFilePath: string): number {
        const input: InputResult = new PageInput(inputFilePath).parse();
        return UpdatePageNumberUtils.addUnverifiedFixedMiddlePageNumbers(input.updatePageNumbers, input.pageOrderingRuleMap);
    }
}

console.log('Part 1 - Example: ', Day5.part1('example-input.txt')); // 143
console.log('Part 1 - Input: ', Day5.part1('puzzle-input.txt')); // 4905
console.log('Part 2 - Example: ', Day5.part2('example-input.txt')); // 123
console.log('Part 2 - Input: ', Day5.part2('puzzle-input.txt')); // 6204
