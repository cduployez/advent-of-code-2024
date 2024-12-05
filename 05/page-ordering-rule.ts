export class PageOrderingRule {
    pageNumber: number;
    nextPageOrderingRules: PageOrderingRule[] = [];

    constructor(value: number, nextOrders: PageOrderingRule[] = []) {
        this.pageNumber = value;
        this.nextPageOrderingRules = nextOrders;
    }
}
