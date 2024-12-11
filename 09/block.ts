export class Block {
    id: number | null | undefined;
    length: number;


    constructor(id: number | null | undefined, length: number) {
        this.id = id;
        this.length = length;
    }

    toIndividualBlocks(): (number | null)[] {
        return new Array<number | null>(this.length).fill(this.id !== undefined ? this.id : null);
    }

    copy(): Block {
        return new Block(this.id, this.length);
    }
}
