import {DiskMapInput} from './disk-map-input';

class Day9 {
    static part1(inputFilePath: string): number {
        const diskMap = new DiskMapInput(inputFilePath).parse();
        diskMap.displayDenseFormat();
        diskMap.displayIndividualBlocks();
        const compactedDiskMap = diskMap.compactFragmented();
        console.log('\nCompacted');
        compactedDiskMap.displayDenseFormat();
        compactedDiskMap.displayIndividualBlocks();
        console.log('\nChecksum');
        return compactedDiskMap.toFilesystemChecksum();
    }

    static part2(inputFilePath: string): number {
        const diskMap = new DiskMapInput(inputFilePath).parse();
        diskMap.displayDenseFormat();
        diskMap.displayIndividualBlocks();
        const compactedDiskMap = diskMap.compactBlocks();
        console.log('\nCompacted');
        compactedDiskMap.displayDenseFormat();
        compactedDiskMap.displayIndividualBlocks();
        console.log('\nChecksum');
        return compactedDiskMap.toFilesystemChecksum();
    }
}

const startTime = performance.now();
console.log('Part 1 - Tutorial: ', Day9.part1('tutorial-input.txt')); // 60
console.log('Part 1 - Example: ', Day9.part1('example-input.txt')); // 1928
console.log('Part 1 - Input: ', Day9.part1('puzzle-input.txt')); // 6463499258318
console.log('Part 2 - Example: ', Day9.part2('example-input.txt')); // 2858
console.log('Part 2 - Input: ', Day9.part2('puzzle-input.txt')); // 6493634986625
const endTime = performance.now();
console.log(`Call to method took ${endTime - startTime} milliseconds`);

