import {PageOrderingRule} from './page-ordering-rule';

export class UpdatePageNumberUtils {

    static verify(updatePageNumbers: number[], pageOrderingRuleMap: Record<number, PageOrderingRule>): boolean {
        let pageNumber: number;
        let nextPageNumber: number;
        for (let i = 1; i < updatePageNumbers.length; i++) {
            pageNumber = updatePageNumbers[i - 1];
            nextPageNumber = updatePageNumbers[i];
            if (!pageOrderingRuleMap[pageNumber].nextPageOrderingRules.some(rule => rule.pageNumber === nextPageNumber)) {
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

}
