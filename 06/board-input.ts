import {Input} from '../input';
import {Board} from './board';
import {DirectionEnum} from './direction-enum';
import {RouteEnum} from './route-enum';

export class BoardInput extends Input<Board> {

    constructor(inputFilePath: string) {
        super(inputFilePath);
    }

    parse(): Board {
        const initialPosition: { rowIndex: number, columnIndex: number } = {rowIndex: 0, columnIndex: 0};
        let direction: DirectionEnum = DirectionEnum.TOP;
        const routes: RouteEnum[][] = this.toText().split('\n').filter(line => line.length > 0).map((line: string, lineIndex: number) => line.split('').map((char: RouteEnum | DirectionEnum, columnIndex: number) => {
            switch (char) {
                case RouteEnum.WALL:
                    return RouteEnum.WALL;
                case RouteEnum.EMPTY:
                    return RouteEnum.EMPTY;
                case RouteEnum.VISITED:
                    return RouteEnum.VISITED;
                case DirectionEnum.TOP:
                    initialPosition.rowIndex = lineIndex;
                    initialPosition.columnIndex = columnIndex;
                    direction = DirectionEnum.TOP;
                    return RouteEnum.VISITED;
                case DirectionEnum.RIGHT:
                    initialPosition.rowIndex = lineIndex;
                    initialPosition.columnIndex = columnIndex;
                    direction = DirectionEnum.RIGHT;
                    return RouteEnum.VISITED;
                case DirectionEnum.BOTTOM:
                    initialPosition.rowIndex = lineIndex;
                    initialPosition.columnIndex = columnIndex;
                    direction = DirectionEnum.BOTTOM;
                    return RouteEnum.VISITED;
                case DirectionEnum.LEFT:
                    initialPosition.rowIndex = lineIndex;
                    initialPosition.columnIndex = columnIndex;
                    direction = DirectionEnum.LEFT;
                    return RouteEnum.VISITED;
                default:
                    throw new Error('Invalid character: ' + char);
            }
        }));
        return new Board(initialPosition, direction, routes);
    }
}
