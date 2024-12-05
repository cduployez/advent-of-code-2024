import {PageOrderingRule} from './page-ordering-rule';

export class UpdatePageNumberUtils {

    static containsNextPageNumber(pageNumber: number, nextPageNumber: number, pageOrderingRuleMap: Record<number, PageOrderingRule>): boolean {
        return pageOrderingRuleMap[pageNumber].nextPageOrderingRules.some(rule => rule.pageNumber === nextPageNumber);
    }

    static verify(updatePageNumbers: number[], pageOrderingRuleMap: Record<number, PageOrderingRule>): boolean {
        let pageNumber: number;
        let nextPageNumber: number;
        for (let i = 1; i < updatePageNumbers.length; i++) {
            pageNumber = updatePageNumbers[i - 1];
            nextPageNumber = updatePageNumbers[i];
            if (!UpdatePageNumberUtils.containsNextPageNumber(pageNumber, nextPageNumber, pageOrderingRuleMap)) {
                return false;
            }
        }
        return true;
    }

    static addVerifiedMiddlePageNumbers(updatePageNumbers: number[][], pageOrderingRuleMap: Record<number, PageOrderingRule>): number {
        const middleNumbers: number[] = [];
        updatePageNumbers.forEach(update => {
            let verified: boolean = UpdatePageNumberUtils.verify(update, pageOrderingRuleMap);
            console.log(`${update.join(',')}:`, verified ? 'Ok' : 'Not ok');
            if (verified) {
                middleNumbers.push(update[(update.length - 1) / 2]);
            }
        });
        console.log('Middle numbers:', middleNumbers);
        // Addition of middle numbers
        return middleNumbers.reduce((acc, num) => acc + num, 0);
    }

    static addUnverifiedFixedMiddlePageNumbers(updatePageNumbers: number[][], pageOrderingRuleMap: Record<number, PageOrderingRule>): number {
        const unverifiedUpdatePageNumbers: number[][] = updatePageNumbers.filter(update => !UpdatePageNumberUtils.verify(update, pageOrderingRuleMap));
        const middleNumbers: number[] = [];
        unverifiedUpdatePageNumbers.forEach(update => {
            const fixedUnverifiedUpdatePageNumbers: number[] = UpdatePageNumberUtils.fixUnverifiedUpdatePageNumbers(update, pageOrderingRuleMap);
            middleNumbers.push(fixedUnverifiedUpdatePageNumbers[(fixedUnverifiedUpdatePageNumbers.length - 1) / 2]);
        });
        console.log('Middle numbers:', middleNumbers);
        // Addition of middle numbers
        return middleNumbers.reduce((acc, num) => acc + num, 0);
    }

    private static fixUnverifiedUpdatePageNumbers(update: number[], pageOrderingRuleMap: Record<number, PageOrderingRule>, level: number = 0): number[] {
        const remainingNumbers = [...update];
        let fixedUpdatePageNumbers: number[] = [remainingNumbers.shift()];
        while (remainingNumbers.length > 0) {
            for (let i = 0; i < remainingNumbers.length; i++) {
                if (UpdatePageNumberUtils.containsNextPageNumber(fixedUpdatePageNumbers[fixedUpdatePageNumbers.length - 1], remainingNumbers[i], pageOrderingRuleMap)) {
                    fixedUpdatePageNumbers.push(remainingNumbers.splice(i, 1)[0]);
                    break;
                } else if (UpdatePageNumberUtils.containsNextPageNumber(remainingNumbers[i], fixedUpdatePageNumbers[fixedUpdatePageNumbers.length - 1], pageOrderingRuleMap)) {
                    fixedUpdatePageNumbers.unshift(remainingNumbers.splice(i, 1)[0]);
                    break;
                }
            }
        }
        while (!UpdatePageNumberUtils.verify(fixedUpdatePageNumbers, pageOrderingRuleMap)) {
            fixedUpdatePageNumbers = UpdatePageNumberUtils.fixUnverifiedUpdatePageNumbers(fixedUpdatePageNumbers, pageOrderingRuleMap, level + 1);
        }
        if (level === 0) {
            console.log('Fixed update:', fixedUpdatePageNumbers, this.verify(fixedUpdatePageNumbers, pageOrderingRuleMap));
        }
        return fixedUpdatePageNumbers;
    }
}
