import {RouteEnum} from './route-enum';

export class Cell {
    routes: RouteEnum[];

    constructor(routes: RouteEnum[]) {
        this.routes = routes;
    }

    isAnyVisited(): boolean {
        return this.routes.some(r => this.isVisited(r));
    }

    isVisitedInTheSameDirectionTwice(): boolean {
        return this.routes.filter(r => r === RouteEnum.VISITED_LEFT).length > 1
            || this.routes.filter(r => r === RouteEnum.VISITED_RIGHT).length > 1
            || this.routes.filter(r => r === RouteEnum.VISITED_TOP).length > 1
            || this.routes.filter(r => r === RouteEnum.VISITED_BOTTOM).length > 1;
    }

    isAnyWallOrObstacle(): boolean {
        return this.routes.some(r => this.isWallOrObstacle(r));
    }

    isWallOrObstacle(route: RouteEnum): boolean {
        return route === RouteEnum.WALL || route === RouteEnum.OBSTACLE;
    }

    private isVisited(moveResult: RouteEnum): boolean {
        return moveResult === RouteEnum.VISITED_TOP || moveResult === RouteEnum.VISITED_RIGHT || moveResult === RouteEnum.VISITED_BOTTOM || moveResult === RouteEnum.VISITED_LEFT;
    }
}
