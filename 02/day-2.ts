import {ReportInput} from './report-input';
import {Report} from './report';

class Day2 {
    static part1(inputFilePath: string): number {
        return new ReportInput(inputFilePath).parse()
            .map(levels => new Report(levels, 0))
            .filter(report => report.isSafe())
            .length;
    }

    static part2(inputFilePath: string): number {
        return new ReportInput(inputFilePath).parse()
            .map(levels => new Report(levels, 1))
            .filter(report => report.isSafe())
            .length;
    }
}

console.log('Part 1 - Example: ', Day2.part1('example-input.txt')); // 2
console.log('Part 1 - Input: ', Day2.part1('puzzle-input.txt')); // 463
console.log('Part 2 - Example: ', Day2.part2('example-input.txt')); // 4
console.log('Part 2 - Input: ', Day2.part2('puzzle-input.txt')); // 514
