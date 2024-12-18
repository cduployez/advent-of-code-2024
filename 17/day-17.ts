import {ProgramInput} from './program-input';
import {OperationUtils} from './operation-utils';

class ResultPart {
    /**
     * Result in binary format
     */
    binaryNumber: string;

    /**
     * Corresponding length of the values
     */
    length: number;

    constructor(result: string, length: number) {
        this.binaryNumber = result;
        this.length = length;
    }

    groupByThreeBit(): string[] {
        const decomposedBinaryNumbers: string[] = [];
        for (let i = 0; i < this.binaryNumber.length; i += 3) {
            decomposedBinaryNumbers.push(this.binaryNumber.slice(i, i + 3));
        }
        return decomposedBinaryNumbers;
    }

    display(): void {
        const threeBitBinaries: string[] = this.groupByThreeBit();
        console.log(`        ---
        Binary=${this.binaryNumber}
        3-bits=[${this.groupByThreeBit().join(',')}]
        Values=[${this.groupByThreeBit().map(value => OperationUtils.fromBinaryString(value).toString()).join(',')}]
        ---`);
    }
}

export class Day17 {
    static part1(inputFilePath: string): string {
        const program = new ProgramInput(inputFilePath).parse();
        program.display();
        return program.run();
    }

    static part2(inputFilePath: string): string {
        // Expected output
        let program = new ProgramInput(inputFilePath).parse();
        program.display();
        const expectedOutputs: string[] = program.values.map(value => value.toString());
        // Start searching
        const options: ResultPart[] = [new ResultPart('', 0)];
        while (options.length > 0) {
            const resultPart: ResultPart = options.shift()!;
            if (resultPart.length === expectedOutputs.length) {
                return OperationUtils.fromBinaryString(resultPart.binaryNumber).toString();
            }
            const from: number = OperationUtils.fromBinaryString(resultPart.binaryNumber + '000'); // Add the next 3-bit number (min value)
            const to: number = OperationUtils.fromBinaryString(resultPart.binaryNumber + '111'); // Add the next 3-bit number (max value)
            const expectedOutputPart: string = expectedOutputs.slice(-(resultPart.length + 1)).join(','); // Get the next expected output part
            console.log(`Searching from ${from} to ${to} for ${expectedOutputPart}`);
            for (let aValue = from; aValue <= to; aValue++) {
                const result: string = program.run(BigInt(aValue));
                if (result === expectedOutputPart) {
                    console.log(`Found for value ${aValue} = ${OperationUtils.toBinaryString(aValue)} in binary`);
                    const nextResultPart = new ResultPart(OperationUtils.toBinaryString(aValue), resultPart.length + 1)
                    options.push(nextResultPart);
                    nextResultPart.display();
                }
            }
        }
        return 'Not found';
    }
}

const startTime = performance.now();
// console.log('Part 1 - Example: ', Day17.part1('example-input.txt')); // 4,6,3,5,6,3,5,2,1,0
// console.log('Part 1 - Example2: ', Day17.part1('example-input2.txt')); // Sets register B to 1
// console.log('Part 1 - Example3: ', Day17.part1('example-input3.txt')); // 0,1,2
// console.log('Part 1 - Example4: ', Day17.part1('example-input4.txt')); // 4,2,5,6,7,7,7,7,3,1,0
// console.log('Part 1 - Example5: ', Day17.part1('example-input5.txt')); // Sets register B to 26
// console.log('Part 1 - Example6: ', Day17.part1('example-input6.txt')); // Sets register B to 44354
// console.log('Part 1 - Puzzle: ', Day17.part1('puzzle-input.txt')); // 3,1,5,3,7,4,2,7,5

// console.log('Part 2 - Example7: ', Day17.part2('example-input7.txt')); // 117440
console.log('Part 2 - Puzzle: ', Day17.part2('puzzle-input.txt')); // 190593310997519
const endTime = performance.now();
console.log(`Call to method took ${endTime - startTime} milliseconds`);

