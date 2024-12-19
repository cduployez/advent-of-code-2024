import {Input} from '../input';

class StripeManager {
    towelPatterns: string[];
    desiredDesigns: string[];

    constructor(towelPatterns: string[], desiredDesigns: string[]) {
        // Sort by length desc
        this.towelPatterns = towelPatterns.sort((a, b) => b.length - a.length);
        this.desiredDesigns = desiredDesigns;
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
        return 0;
    }
}

const startTime = performance.now();
// console.log('Part 1 - Example: ', Day19.part1('example-input.txt')); // 6
console.log('Part 1 - Puzzle: ', Day19.part1('puzzle-input.txt')); // 228
// console.log('Part 2 - Example: ', Day19.part2('example-input.txt')); // 16
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
// console.log('Part 2 - Puzzle: ', Day19.part2('puzzle-input.txt')); //
const endTime = performance.now();
console.log(`Call to method took ${endTime - startTime} milliseconds`);

