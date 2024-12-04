export class CrossWord {

    /**
     * Count the number of times the gridChars appear in the lineChars. The '.' char means any character.
     */
    static countGrid(lineChars: string[][], gridChars: string[][]): number {
        let count = 0;
        for (let rowIndex = 0; rowIndex < lineChars.length; rowIndex++) {
            for (let columnIndex = 0; columnIndex < lineChars[rowIndex].length; columnIndex++) {
                if (lineChars[rowIndex][columnIndex] === gridChars[0][0]) {
                    let found = true;
                    for (let gridRowIndex = 0; gridRowIndex < gridChars.length; gridRowIndex++) {
                        for (let gridColumnIndex = 0; gridColumnIndex < gridChars[gridRowIndex].length; gridColumnIndex++) {
                            if (lineChars[rowIndex + gridRowIndex]?.[columnIndex + gridColumnIndex] !== gridChars[gridRowIndex][gridColumnIndex] && gridChars[gridRowIndex][gridColumnIndex] !== '.') {
                                found = false;
                                break;
                            }
                        }
                        if (!found) {
                            break;
                        }
                    }
                    if (found) {
                        count++;
                    }
                }
            }
        }
        return count;
    }

    static reverseLines(lines: string[][]): string[][] {
        return lines.map(l => l.reverse());
    }


}
