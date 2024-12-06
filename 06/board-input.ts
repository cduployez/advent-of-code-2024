import {Input} from '../input';
import {Board} from './board';
import {DirectionEnum} from './direction-enum';
import {RouteEnum} from './route-enum';
import {Cell} from './cell';

export class BoardInput extends Input<Board> {

    constructor(inputFilePath: string) {
        super(inputFilePath);
    }

    parse(): Board {
        const initialPosition: { rowIndex: number, columnIndex: number } = {rowIndex: 0, columnIndex: 0};
        let direction: DirectionEnum = DirectionEnum.TOP;
        const cells: Cell[][] = this.toText().split('\n').filter(line => line.length > 0).map((line: string, lineIndex: number) => line.split('').map((char: RouteEnum | DirectionEnum, columnIndex: number) => {
            switch (char) {
                case RouteEnum.WALL:
                    return new Cell([RouteEnum.WALL]);
                case RouteEnum.EMPTY:
                    return new Cell([RouteEnum.EMPTY]);
                case DirectionEnum.TOP:
                    initialPosition.rowIndex = lineIndex;
                    initialPosition.columnIndex = columnIndex;
                    direction = DirectionEnum.TOP;
                    return new Cell([RouteEnum.VISITED_TOP]);
                case DirectionEnum.RIGHT:
                    initialPosition.rowIndex = lineIndex;
                    initialPosition.columnIndex = columnIndex;
                    direction = DirectionEnum.RIGHT;
                    return new Cell([RouteEnum.VISITED_RIGHT]);
                case DirectionEnum.BOTTOM:
                    initialPosition.rowIndex = lineIndex;
                    initialPosition.columnIndex = columnIndex;
                    direction = DirectionEnum.BOTTOM;
                    return new Cell([RouteEnum.VISITED_BOTTOM]);
                case DirectionEnum.LEFT:
                    initialPosition.rowIndex = lineIndex;
                    initialPosition.columnIndex = columnIndex;
                    direction = DirectionEnum.LEFT;
                    return new Cell([RouteEnum.VISITED_LEFT]);
                default:
                    throw new Error('Invalid character: ' + char);
            }
        }));
        return new Board(initialPosition, direction, cells);
    }
}
