import {DirectionEnum} from './direction-enum';
import {RouteEnum} from './route-enum';

export class Board {
    static directions: DirectionEnum[] = [DirectionEnum.TOP, DirectionEnum.RIGHT, DirectionEnum.BOTTOM, DirectionEnum.LEFT];

    position: { rowIndex: number, columnIndex: number };
    direction: DirectionEnum;
    routes: RouteEnum[][];

    constructor(initialPosition: {
        rowIndex: number;
        columnIndex: number
    }, direction: DirectionEnum, routes: RouteEnum[][]) {
        this.position = initialPosition;
        this.direction = direction;
        this.routes = routes;
    }

    isWall(rowIndex: number, columnIndex: number): boolean {
        return this.routes?.[rowIndex]?.[columnIndex] === RouteEnum.WALL;
    }

    isOutOfBounds(rowIndex: number, columnIndex: number): boolean {
        return rowIndex < 0 || rowIndex >= this.routes.length || columnIndex < 0 || columnIndex >= this.routes[0].length;
    }

    moveForward(): RouteEnum {
        switch (this.direction) {
            case DirectionEnum.TOP:
                if (this.isWall(this.position.rowIndex - 1, this.position.columnIndex)) {
                    return RouteEnum.WALL;
                }
                this.position.rowIndex--;
                break;
            case DirectionEnum.RIGHT:
                if (this.isWall(this.position.rowIndex, this.position.columnIndex + 1)) {
                    return RouteEnum.WALL;
                }
                this.position.columnIndex++;
                break;
            case DirectionEnum.BOTTOM:
                if (this.isWall(this.position.rowIndex + 1, this.position.columnIndex)) {
                    return RouteEnum.WALL;
                }
                this.position.rowIndex++;
                break;
            case DirectionEnum.LEFT:
                if (this.isWall(this.position.rowIndex, this.position.columnIndex - 1)) {
                    return RouteEnum.WALL;
                }
                this.position.columnIndex--;
                break;
        }
        // Check if position is out of bounds
        if (this.isOutOfBounds(this.position.rowIndex, this.position.columnIndex)) {
            return RouteEnum.OUT_OF_BOUNDS;
        }
        this.routes[this.position.rowIndex][this.position.columnIndex] = RouteEnum.VISITED;
        return RouteEnum.VISITED;
    }

    turn(): void {
        // Turn 90°
        this.direction = Board.directions[(Board.directions.indexOf(this.direction) + 1) % Board.directions.length];
    }

    play(): void {
        let moveResult: RouteEnum;
        do {
            moveResult = this.moveForward();
            while (moveResult === RouteEnum.WALL) {
                this.turn();
                moveResult = this.moveForward();
            }
        } while (moveResult !== RouteEnum.OUT_OF_BOUNDS);

    }

    countVisited(): number {
        return this.routes.reduce((acc: number, row: RouteEnum[]) => acc + row.filter((route: RouteEnum) => route === RouteEnum.VISITED).length, 0);
    }

    logBoard(): void {
        console.log('\nBoard:\n');
        this.routes.forEach((route, rowIndex) => {
            const loggedRoutes: string[] = [...route];
            if (this.position.rowIndex === rowIndex) {
                loggedRoutes[this.position.columnIndex] = this.direction;
            }
            console.log(loggedRoutes.join(''));
        });
        console.log('\n');
    }
}
