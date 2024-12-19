import {Input} from '../input';

enum StripeEnum {
    WHITE = 'w',
    BLUE = 'u',
    'BLACK' = 'b',
    RED = 'r',
    GREEN = 'g'
}

class StripeManager {
    towelPatterns: string[];
    desiredDesigns: string[];

    // All possible concatenations of towel (a towel can be used multiple times) to reach given string size
    dictionary: Record<number, Record<string, number>> = {
        [0]: {'': 1}
    };

    constructor(towelPatterns: string[], desiredDesigns: string[]) {
        // Sort by length desc
        this.towelPatterns = towelPatterns.sort((a, b) => b.length - a.length);
        this.desiredDesigns = desiredDesigns;
        this.fillDictionary();
    }

    fillDictionary(): void {
        this.towelPatterns.forEach(towelPattern => {
            this.addDictionaryKey(towelPattern, 1);
        });
    }

    getDictionaryAtSize(size: number, maxDictionarySize: number = 1): Record<string, number> | null {
        if (size < 0) {
            return null;
        }
/*        if (!this.dictionary[size]) {
            if (size <= maxDictionarySize) {
                this.fillDictionaryForSize(size);
            }
        }*/
        return this.dictionary[size];
    }

    fillDictionaryForSize(size: number): void {
        console.log(`Building dictionary for size ${size}`);
        for (let towelPattern of this.towelPatterns) {
            if (towelPattern.length <= size) {
                const previousSize: number = size - towelPattern.length;
                const previousSizeDictionary: Record<string, number> | null = this.getDictionaryAtSize(previousSize);
                if (!previousSizeDictionary) {
                    continue;
                }
                for (let previousSizeKey in previousSizeDictionary) {
                    const newKey: string = previousSizeKey + towelPattern;
                    this.addDictionaryKey(newKey, previousSizeDictionary[previousSizeKey]);
                }
            }
        }
        console.log(`Dictionary built for size ${size}`);
    }

    addDictionaryKey(key: string, value: number) {
        if (!this.dictionary[key.length]) {
            this.dictionary[key.length] = {};
        }
        if (!this.dictionary[key.length][key]) {
            this.dictionary[key.length][key] = 0;
        }
        this.dictionary[key.length][key] += value;
        console.log(`Key ${key} of size ${key.length} with value ${this.dictionary[key.length][key]}`);
        console.log('');
    }

    searchAll(): Record<string, number> {
        const results: Record<string, number> = {};
        this.desiredDesigns.forEach(desiredDesign => {
            results[desiredDesign] = this.searchRecursive(desiredDesign);
        });
        return results;
    }

    searchAllFromDictionary(): Record<string, number> {
        const results: Record<string, number> = {};
        this.desiredDesigns.forEach(desiredDesign => {
            results[desiredDesign] = this.getDictionaryAtSize(desiredDesign.length)![desiredDesign] || 0;
        });
        return results;
    }

    searchAllRecursiveAlsoUsingDictionary(): Record<string, number> {
        const results: Record<string, number> = {};
        this.desiredDesigns.forEach(desiredDesign => {
            results[desiredDesign] = this.searchRecursiveAlsoUsingDictionary(desiredDesign);
        });
        return results;
    }

    checkAll(): boolean[] {
        return this.desiredDesigns.map(desiredDesign => this.checkRecursive(desiredDesign));
    }

    checkRecursive(desiredDesign: string, foundStripes: string = '', level: number = 0): boolean {
        if (level === 0) {
            console.log('Desired design:', desiredDesign);
        }
        if (desiredDesign.length === 0) {
            return true;
        }
        let found = false;
        for (let towelPattern of this.towelPatterns) {
            if (desiredDesign === foundStripes + towelPattern) {
                console.log(`    FOUND [${desiredDesign}] with ${foundStripes} + ${towelPattern}`);
                return true;
            } else if (desiredDesign.startsWith(foundStripes + towelPattern)) {
                console.log(`    [${desiredDesign}] Added ${towelPattern} --> ${foundStripes + towelPattern}`);
               found = this.checkRecursive(desiredDesign, foundStripes + towelPattern, 1);
                if (found) {
                    break;
                }
            }
        }
        return found;
    }

    /**
     * Find all possible towel patterns that can be used to create the desired design
     */
    private searchRecursive(desiredDesign: string, foundStripes: string = '', level: number = 0): number {
        if (level === 0) {
            console.log('Desired design:', desiredDesign);
        }
        if (desiredDesign.length === 0) {
            return 0
        }
        let foundResults: number = 0;
        for (let towelPattern of this.towelPatterns) {
            if (desiredDesign === foundStripes + towelPattern) {
                console.log(`    FOUND [${desiredDesign}] ${foundStripes} + ${towelPattern} = ${foundStripes + towelPattern}`);
                foundResults++;
            } else if (desiredDesign.startsWith(foundStripes + towelPattern)) {
                console.log(`    [${desiredDesign}] ${foundStripes} + ${towelPattern} = ${foundStripes + towelPattern}`);
                foundResults += this.searchRecursive(desiredDesign, foundStripes + towelPattern, 1);
            }
        }
        return foundResults;
    }

    /**
     * Find all possible towel patterns that can be used to create the desired design, also using dictionary up to level 7
     */
    private searchRecursiveAlsoUsingDictionary(desiredDesign: string, foundStripes: string = '', nbFound: number = 0, level: number = 0): number {
        if (level === 0) {
            console.log('Desired design:', desiredDesign);
        }
        if (desiredDesign.length === 0) {
            return 0
        }
        let foundMatches: boolean = false;
        const usedDictionaryTexts: string[] = [];
        const maxDictionarySize = Object.keys(this.dictionary).length;
        for(let dictionarySize = maxDictionarySize; dictionarySize > 0; dictionarySize--) {
            const dictionary = this.getDictionaryAtSize(dictionarySize);
            // Check if some values match
            for (let key in dictionary) {
                if (!usedDictionaryTexts.some(t => t.startsWith(foundStripes + key))) {
                    if (desiredDesign === foundStripes + key) {
                        nbFound += dictionary[key];
                        usedDictionaryTexts.push(key);
                        console.log(`    FOUND [${desiredDesign}] ${foundStripes} + ${key} = ${foundStripes + key} (${nbFound})`);
                        foundMatches = true;
                    } else if (desiredDesign.startsWith(foundStripes + key)) {
                        let nbFoundForKey = this.searchRecursiveAlsoUsingDictionary(desiredDesign, foundStripes + key, 0, level + 1);
                        this.addDictionaryKey(foundStripes + key, nbFoundForKey);
                        nbFound += nbFoundForKey;
                        usedDictionaryTexts.push(key);
                        // console.log(`    [${desiredDesign}] ${foundStripes} + ${key} = ${foundStripes + key}`);
                    }
                }
            }
        }
        return nbFound;
    }




}

class StripeManagerInput extends Input<StripeManager> {
    parse(): StripeManager {
        const lines = this.toText().split('\n').filter(line => line.length > 0);
        return new StripeManager(lines.shift()!.split(', '), lines);
    }
}

class Day19 {
    static part1(inputFilePath: string): number {
        const stripeManager = new StripeManagerInput(inputFilePath).parse();
        console.log('Stripe manager:', stripeManager);
        return stripeManager.checkAll().filter(found => found).length;
    }

    static part2(inputFilePath: string): number {
        const stripeManager = new StripeManagerInput(inputFilePath).parse();
        console.log('Stripe manager:', stripeManager);
        const nbSolutionsPerDesign = stripeManager.searchAll();
        console.log(nbSolutionsPerDesign);
        return Object.values(nbSolutionsPerDesign).reduce((acc, value) => acc + value, 0);
    }

    static part2b(inputFilePath: string): number {
        const stripeManager = new StripeManagerInput(inputFilePath).parse();
        const nbSolutionsPerDesign = stripeManager.searchAllFromDictionary();
        console.log(nbSolutionsPerDesign);
        return Object.values(nbSolutionsPerDesign).reduce((acc, value) => acc + value, 0);
    }

    static part2c(inputFilePath: string): number {
        const stripeManager = new StripeManagerInput(inputFilePath).parse();
        const nbSolutionsPerDesign = stripeManager.searchAllRecursiveAlsoUsingDictionary();
        console.log(nbSolutionsPerDesign);
        return Object.values(nbSolutionsPerDesign).reduce((acc, value) => acc + value, 0);
    }
}

const startTime = performance.now();
// console.log('Part 1 - Example: ', Day19.part1('example-input.txt')); // 6
// console.log('Part 1 - Puzzle: ', Day19.part1('puzzle-input.txt')); // 228

console.log('Part 2 - Example: ', Day19.part2c('example-input.txt')); // 16
/*
{
  brwrr: 2,
  bggr: 1,
  gbbr: 4,
  rrbgbr: 6,
  ubwu: 0,
  bwurrg: 1,
  brgr: 2,
  bbrgwb: 0
}
 */

// console.log('Part 2 - Puzzle: ', Day19.part2c('puzzle-input.txt')); //
const endTime = performance.now();
console.log(`Call to method took ${endTime - startTime} milliseconds`);

