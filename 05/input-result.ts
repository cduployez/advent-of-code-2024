import {PageOrderingRule} from './page-ordering-rule';

export interface InputResult {
    pageOrderingRuleMap: Record<number, PageOrderingRule>;
    updatePageNumbers: number[][];
}
