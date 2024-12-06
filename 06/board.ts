import {DirectionEnum} from './direction-enum';
import {RouteEnum} from './route-enum';
import {Cell} from './cell';

export class Board {

    static directions: DirectionEnum[] = [DirectionEnum.TOP, DirectionEnum.RIGHT, DirectionEnum.BOTTOM, DirectionEnum.LEFT];

    position: { rowIndex: number, columnIndex: number };
    direction: DirectionEnum;
    cells: Cell[][];

    constructor(initialPosition: {
        rowIndex: number;
        columnIndex: number
    }, direction: DirectionEnum, cells: Cell[][]) {
        this.position = initialPosition;
        this.direction = direction;
        this.cells = cells;
    }

    get currentCell(): Cell | null {
        return this.cells?.[this.position.rowIndex]?.[this.position.columnIndex] || null;
    }

    static findInfiniteLoopsTestAllCells(board: Board): number {
        let nbInfiniteLoops: number = 0;
        for (let rowIndex = 0; rowIndex < board.cells.length; rowIndex++) {
            for (let columnIndex = 0; columnIndex < board.cells[rowIndex].length; columnIndex++) {
                const copy: Board = board.copy();
                if (copy.addObstacleAt(rowIndex, columnIndex) && !copy.play()) {
                    // console.log(`Found infinite loop at (${rowIndex}, ${columnIndex})`);
                    // copy.logBoard();
                    nbInfiniteLoops += 1;
                }
            }
        }
        return nbInfiniteLoops;
    }

    isAnyWallOrObstacleAt(rowIndex: number, columnIndex: number): boolean {
        return this.cells?.[rowIndex]?.[columnIndex]?.isAnyWallOrObstacle();
    }

    isOutOfBounds(rowIndex: number, columnIndex: number): boolean {
        return rowIndex < 0 || rowIndex >= this.cells.length || columnIndex < 0 || columnIndex >= this.cells[0].length;
    }

    toVisited(directionEnum: DirectionEnum): RouteEnum {
        switch (directionEnum) {
            case DirectionEnum.TOP:
                return RouteEnum.VISITED_TOP;
            case DirectionEnum.RIGHT:
                return RouteEnum.VISITED_RIGHT;
            case DirectionEnum.BOTTOM:
                return RouteEnum.VISITED_BOTTOM;
            case DirectionEnum.LEFT:
                return RouteEnum.VISITED_LEFT;
        }
    }

    canMoveForward(): boolean {
        switch (this.direction) {
            case DirectionEnum.TOP:
                return !this.isAnyWallOrObstacleAt(this.position.rowIndex - 1, this.position.columnIndex);
            case DirectionEnum.RIGHT:
                return !this.isAnyWallOrObstacleAt(this.position.rowIndex, this.position.columnIndex + 1);
            case DirectionEnum.BOTTOM:
                return !this.isAnyWallOrObstacleAt(this.position.rowIndex + 1, this.position.columnIndex);
            case DirectionEnum.LEFT:
                return !this.isAnyWallOrObstacleAt(this.position.rowIndex, this.position.columnIndex - 1);
        }
    }

    getNextCell(): Cell {
        switch (this.direction) {
            case DirectionEnum.TOP:
                return this.cells[this.position.rowIndex - 1][this.position.columnIndex];
            case DirectionEnum.RIGHT:
                return this.cells[this.position.rowIndex][this.position.columnIndex + 1];
            case DirectionEnum.BOTTOM:
                return this.cells[this.position.rowIndex + 1][this.position.columnIndex];
            case DirectionEnum.LEFT:
                return this.cells[this.position.rowIndex][this.position.columnIndex - 1];
        }
    }

    moveForward(): RouteEnum {
        switch (this.direction) {
            case DirectionEnum.TOP:
                if (this.isAnyWallOrObstacleAt(this.position.rowIndex - 1, this.position.columnIndex)) {
                    return RouteEnum.WALL;
                }
                this.position.rowIndex--;
                break;
            case DirectionEnum.RIGHT:
                if (this.isAnyWallOrObstacleAt(this.position.rowIndex, this.position.columnIndex + 1)) {
                    return RouteEnum.WALL;
                }
                this.position.columnIndex++;
                break;
            case DirectionEnum.BOTTOM:
                if (this.isAnyWallOrObstacleAt(this.position.rowIndex + 1, this.position.columnIndex)) {
                    return RouteEnum.WALL;
                }
                this.position.rowIndex++;
                break;
            case DirectionEnum.LEFT:
                if (this.isAnyWallOrObstacleAt(this.position.rowIndex, this.position.columnIndex - 1)) {
                    return RouteEnum.WALL;
                }
                this.position.columnIndex--;
                break;
        }
        // Check if position is out of bounds
        if (this.isOutOfBounds(this.position.rowIndex, this.position.columnIndex)) {
            return RouteEnum.OUT_OF_BOUNDS;
        }
        const moveResult: RouteEnum = this.toVisited(this.direction);
        this.cells[this.position.rowIndex][this.position.columnIndex].routes.push(moveResult);
        return moveResult;
    }

    addObstacleAt(rowIndex: number, columnIndex: number): boolean {
        if (this.isEmptyCell(rowIndex, columnIndex)) {
            this.cells[rowIndex][columnIndex].routes.push(RouteEnum.OBSTACLE);
            return true;
        }
        return false;
    }

    turn(): void {
        // Turn 90°
        this.direction = Board.directions[(Board.directions.indexOf(this.direction) + 1) % Board.directions.length];
    }

    play(): boolean {
        let moveResult: RouteEnum;
        do {
            while (!this.canMoveForward()) {
                let nextCell: Cell = this.getNextCell();
                if (nextCell.isAnyWallOrObstacle()) {
                    this.turn();
                }
            }
            moveResult = this.moveForward();
        } while (moveResult !== RouteEnum.OUT_OF_BOUNDS && !this.currentCell.isVisitedInTheSameDirectionTwice());
        return moveResult === RouteEnum.OUT_OF_BOUNDS;
    }

    copyCells(): Cell[][] {
        return this.cells.map(row => row.map(cell => (new Cell([...cell.routes]))));
    }

    copy(): Board {
        return new Board({
            rowIndex: this.position.rowIndex,
            columnIndex: this.position.columnIndex
        }, this.direction, this.copyCells());
    }

    countVisited(): number {
        return this.cells.reduce((acc: number, row: Cell[]) => acc + row.filter((cell: Cell) => cell.isAnyVisited()).length, 0);
    }

    logBoard(): void {
        console.log('\nBoard:\n');
        this.cells.forEach((cells, rowIndex) => {
            const loggedRoutes: string[][] = [...cells.map(c => c.routes)];
            if (this.position.rowIndex === rowIndex) {
                loggedRoutes[this.position.columnIndex] = [this.direction];
            }
            console.log(loggedRoutes.map(routes => {
                if (routes.some(r => r === RouteEnum.VISITED_BOTTOM || r === RouteEnum.VISITED_TOP) && routes.some(r => r === RouteEnum.VISITED_LEFT || r === RouteEnum.VISITED_RIGHT)) {
                    return '+';
                }
                switch (routes[routes.length - 1]) {
                    case RouteEnum.WALL:
                        return '#';
                    case RouteEnum.OBSTACLE:
                        return 'O';
                    case RouteEnum.EMPTY:
                        return '.';
                    case RouteEnum.VISITED_TOP:
                    case RouteEnum.VISITED_BOTTOM:
                        return '|';
                    case RouteEnum.VISITED_RIGHT:
                    case RouteEnum.VISITED_LEFT:
                        return '—';
                    case RouteEnum.OUT_OF_BOUNDS:
                        return '%';
                    case DirectionEnum.TOP:
                        return '^';
                    case DirectionEnum.RIGHT:
                        return '>';
                    case DirectionEnum.BOTTOM:
                        return 'v';
                    case DirectionEnum.LEFT:
                        return '<';
                }
            }).join(''));
        });
        console.log('\n');
    }

    private isEmptyCell(rowIndex: number, columnIndex: number): boolean {
        return this.cells[rowIndex][columnIndex].routes.length === 1 && this.cells[rowIndex][columnIndex].routes[0] === RouteEnum.EMPTY &&
            // Position is not the initial position
            !(this.position.rowIndex === rowIndex && this.position.columnIndex === columnIndex);
    }
}
