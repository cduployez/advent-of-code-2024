import {Input} from '../input';

class Block {
    id: number | null;
    length: number;


    constructor(id: number | null, length: number) {
        this.id = id;
        this.length = length;
    }

    toIndividualBlocks(): number[] | null[] {
        return new Array<number>(this.length).fill(this.id);
    }
}

class DiskMap {
    blocks: Block[] = [];

    displayDenseFormat(): void {
        console.log(this.blocks.map(block => block.length).join(''));
    }

    displayIndividualBlocks(): void {
        console.log(this.blocks.map(block => block.toIndividualBlocks().map(id => id === null ? '.' : id).join('')).join(''));
    }

    toIndividualBlocks(): (number | null)[] {
        return this.blocks.map(b => b.toIndividualBlocks()).flat();
    }

    compact(): DiskMap {
        let individualBlocks = this.toIndividualBlocks();
        const nbEmpty = individualBlocks.filter(id => id === null).length;
        const compactedBlocks: (number | null)[] = [...individualBlocks];
        let i = 0;
        while (i < compactedBlocks.length) {
            const currentBlock = compactedBlocks[i];
            if (currentBlock === null) {
                let poppedBlock = compactedBlocks.pop();
                while (poppedBlock === null) {
                    poppedBlock = compactedBlocks.pop();
                }
                compactedBlocks[i] = poppedBlock;
            }
            i++;
        }
        for(let j = 0; j < nbEmpty; j++) {
            compactedBlocks.push(null);
        }
        return DiskMap.fromIndividualBlocks(compactedBlocks);
    }

    toFilesystemChecksum(): number {
        let sum = 0;
        this.toIndividualBlocks().forEach((value, index) => {
            sum += value !== null ? value * index : 0;
        });
        return sum;
    }

    static fromDenseFormat(line: (number | null)[]): DiskMap {
        const diskMap = new DiskMap();
        let id = 0;
        let isBlock = true;
        diskMap.blocks = line.map((value, index) => {
            const block = new Block(isBlock ? id++ : null, value);
            isBlock = !isBlock;
            return block;
        });
        return diskMap;
    }

    static fromIndividualBlocks(line: (number | null)[]): DiskMap {
        const diskMap = new DiskMap();
        let currentValue: number | null | undefined = undefined;
        let currentBlock: Block | null = null;
        line.forEach(value => {
            if (currentValue === value) {
                currentBlock.length++;
            } else {
                currentValue = value;
                currentBlock = new Block(value, 1);
                diskMap.blocks.push(currentBlock);
            }
        });
        return diskMap;
    }
}

class DiskMapInput extends Input<DiskMap> {
    parse(): DiskMap {
        const line = this.toText().split('\n')[0];
        return DiskMap.fromDenseFormat(line.split('').map(value => value === '.' ? null : parseInt(value)));
    }

}

class Day9 {
    static part1(inputFilePath: string): number {
        const diskMap = new DiskMapInput(inputFilePath).parse();
        diskMap.displayDenseFormat();
        diskMap.displayIndividualBlocks();
        const compactedDiskMap = diskMap.compact();
        console.log('\nCompacted');
        compactedDiskMap.displayDenseFormat();
        compactedDiskMap.displayIndividualBlocks();
        console.log('\nChecksum');
        return compactedDiskMap.toFilesystemChecksum();
    }

    static part2(inputFilePath: string): number {
        return 0;
    }
}

const startTime = performance.now();
// console.log('Part 1 - Tutorial: ', Day9.part1('tutorial-input.txt')); // 60
// console.log('Part 1 - Example: ', Day9.part1('example-input.txt')); // 1928
console.log('Part 1 - Input: ', Day9.part1('puzzle-input.txt')); // 6463499258318
// console.log('Part 2 - Example: ', Day9.part2('example-input.txt')); //
// console.log('Part 2 - Input: ', Day9.part2('puzzle-input.txt')); //
const endTime = performance.now();
console.log(`Call to method took ${endTime - startTime} milliseconds`);

