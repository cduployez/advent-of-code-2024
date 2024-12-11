import {Block} from './block';

export class DiskMap {
    blocks: Block[];

    constructor(blocks: Block[] = []) {
        this.blocks = blocks;
    }

    displayDenseFormat(): void {
        console.log(this.blocks.map(block => block.length).join(''));
    }

    displayIndividualBlocks(): void {
        console.log(this.blocks.map(block => block.toIndividualBlocks().map(id => id === null ? '.' : id).join('')).join(''));
    }

    toIndividualBlocks(): (number | null)[] {
        return this.blocks.map(b => b.toIndividualBlocks()).flat();
    }

    compactFragmented(): DiskMap {
        let individualBlocks = this.toIndividualBlocks();
        const nbEmpty = individualBlocks.filter(id => id === null).length;
        const compactedBlocks: (number | null | undefined)[] = [...individualBlocks];
        let i = 0;
        while (i < compactedBlocks.length) {
            const currentBlock = compactedBlocks[i];
            if (currentBlock === null || currentBlock === undefined) {
                let poppedBlock = compactedBlocks.pop();
                while (poppedBlock === null) {
                    poppedBlock = compactedBlocks.pop();
                }
                compactedBlocks[i] = poppedBlock;
            }
            i++;
        }
        for (let j = 0; j < nbEmpty; j++) {
            compactedBlocks.push(null);
        }
        return DiskMap.fromIndividualBlocks(compactedBlocks);
    }

    compactBlocks(): DiskMap {
        const blocks = [...this.blocks.map(b => b.copy())];
        for (let i = 0; i < blocks.length; i++) {
            let emptyBlock = blocks[i];
            if (emptyBlock.id === null) {
                for (let j = blocks.length - 1; j > i; j--) {
                    let nextBlock = blocks[j];
                    if (nextBlock.id !== null && nextBlock.length <= emptyBlock.length) {
                        let remainingLength = emptyBlock.length - nextBlock.length;
                        emptyBlock.length = nextBlock.length;
                        emptyBlock.id = nextBlock.id;
                        nextBlock.id = null;
                        if (remainingLength > 0) {
                            // Insert a new block after i
                            blocks.splice(i + 1, 0, new Block(null, remainingLength));
                        }
                        break;
                    }
                }
            }
        }

        return new DiskMap(blocks);
    }

    toFilesystemChecksum(): number {
        let sum = 0;
        this.toIndividualBlocks().forEach((value, index) => {
            sum += value !== null ? value * index : 0;
        });
        return sum;
    }

    static fromDenseFormat(line: (number | null | undefined)[]): DiskMap {
        const diskMap = new DiskMap();
        let id = 0;
        let isBlock = true;
        diskMap.blocks = line.map((value, index) => {
            const block = new Block(isBlock ? id++ : null, value || 0);
            isBlock = !isBlock;
            return block;
        });
        return diskMap;
    }

    static fromIndividualBlocks(line: (number | null | undefined)[]): DiskMap {
        const diskMap = new DiskMap();
        let currentValue: number | null | undefined = undefined;
        let currentBlock: Block | null = null;
        line.forEach(value => {
            if (currentValue === value) {
                if (currentBlock) {
                    currentBlock.length++;
                }
            } else {
                currentValue = value;
                currentBlock = new Block(value, 1);
                diskMap.blocks.push(currentBlock);
            }
        });
        return diskMap;
    }
}
