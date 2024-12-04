export class CrossWord {

    static countWord(lines: string[], word: string): number {
        const horizontal = this.countWordHorizontal(lines, word);
        const horizontalReverse = this.countWordHorizontalReverse(lines, word);
        const vertical = this.countWordVertical(lines, word);
        const verticalReverse = this.countWordVerticalReverse(lines, word);
        const diagonalLeftToRight = this.countWordDiagonalLeftToRight(lines, word);
        const diagonalLeftToRightReverse = this.countWordDiagonalLeftToRightReverse(lines, word);
        const diagonalRightToLeft = this.countWordDiagonalRightToLeft(lines, word);
        const diagonalRightToLeftReverse = this.countWordDiagonalRightToLeftReverse(lines, word);
        return horizontal + horizontalReverse + vertical + verticalReverse + diagonalLeftToRight + diagonalLeftToRightReverse + diagonalRightToLeft + diagonalRightToLeftReverse;
    }

    private static countWordHorizontal(lines: string[], word: string): number {
        let count = 0;
        lines.forEach(l => {
            let lineCount = l.split(word).length - 1;
            count += lineCount;
        });
        return count;
    }

    private static countWordHorizontalReverse(lines: string[], word: string): number {
        return this.countWordHorizontal(lines, CrossWord.reverse(word));
    }

    private static countWordVertical(lines: string[], word: string): number {
        let count = 0;
        for (let charIndex = 0; charIndex < lines[0].length; charIndex++) {
            let line = '';
            lines.forEach(l => {
                line += l[charIndex];
            });
            let lineCount = line.split(word).length - 1;
            count += lineCount;
        }
        return count;
    }

    private static countWordVerticalReverse(lines: string[], word: string): number {
        return this.countWordVertical(lines, CrossWord.reverse(word));
    }

    private static countWordDiagonalLeftToRight(lines: string[], word: string): number {
        // Top left to bottom right, upper half
        const upperHalfDiagonalLines = [];
        for (let rowIndex = 0; rowIndex < lines.length; rowIndex++) {
            let line = '';
            for (let columnIndex = 0; columnIndex < lines[rowIndex].length; columnIndex++) {
                if (rowIndex + columnIndex < lines.length) {
                    line += lines[rowIndex + columnIndex][columnIndex];
                }
            }
            upperHalfDiagonalLines.push(line);
        }
        // Top left to bottom right, lower half
        const lowerHalfDiagonalLines = [];
        // Start from 1 to avoid the middle diagonal line
        for (let rowIndex = 1; rowIndex < lines.length; rowIndex++) {
            let line = '';
            for (let columnIndex = 0; columnIndex < lines[rowIndex].length; columnIndex++) {
                if (columnIndex + rowIndex < lines.length) {
                    line += lines[columnIndex][columnIndex + rowIndex];
                }
            }
            lowerHalfDiagonalLines.push(line);
        }
        return this.countWordHorizontal(upperHalfDiagonalLines, word) + this.countWordHorizontal(lowerHalfDiagonalLines, word);
    }

    private static countWordDiagonalLeftToRightReverse(lines: string[], word: string): number {
        return this.countWordDiagonalLeftToRight(lines, CrossWord.reverse(word));
    }

    private static countWordDiagonalRightToLeft(lines: string[], word: string): number {
        return this.countWordDiagonalLeftToRight(CrossWord.reverseLines(lines), word);
    }

    private static countWordDiagonalRightToLeftReverse(lines: string[], word: string): number {
        return this.countWordDiagonalLeftToRight(CrossWord.reverseLines(lines), CrossWord.reverse(word));
    }

    private static reverse(text: string): string {
        return text.split('').reverse().join('');
    }

    private static reverseLines(lines: string[]): string[] {
        return lines.map(l => CrossWord.reverse(l));
    }


}
