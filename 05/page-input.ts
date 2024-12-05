import {Input} from '../input';
import {InputResult} from './input-result';
import {PageOrderingRule} from './page-ordering-rule';

export class PageInput extends Input<InputResult> {

    constructor(inputFilePath: string) {
        super(inputFilePath);
    }

    parse(): InputResult {
        const lines: string[] = this.toText().split('\n');
        const pageOrderingRuleMap: Record<number, PageOrderingRule> = {};
        const updatePageNumbers: number[][] = [];

        let isPageOrderingRules = true;
        lines.forEach(line => {
            if (line === '') {
                isPageOrderingRules = false;
            } else if (isPageOrderingRules) {
                this.addPageOrderingRule(line, pageOrderingRuleMap);
            } else {
                updatePageNumbers.push(line.split(',').map(num => parseInt(num)));
            }
        });
        return {pageOrderingRuleMap, updatePageNumbers};
    }

    private addPageOrderingRule(line: string, pageOrderingRuleMap: Record<number, PageOrderingRule>): void {
        const parts: string[] = line.split('|');
        const pageNumber: number = parseInt(parts[0]);
        const nextPageNumber: number = parseInt(parts[1]);
        if (pageOrderingRuleMap[pageNumber] === undefined) {
            pageOrderingRuleMap[pageNumber] = new PageOrderingRule(pageNumber);
        }
        if (pageOrderingRuleMap[nextPageNumber] === undefined) {
            pageOrderingRuleMap[nextPageNumber] = new PageOrderingRule(nextPageNumber);
        }
        pageOrderingRuleMap[pageNumber].nextPageOrderingRules.push(pageOrderingRuleMap[nextPageNumber]);
    }
}
