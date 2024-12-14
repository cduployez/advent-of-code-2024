import {Input} from '../input';
import {Position} from '../position';

class Room {
    width: number;
    height: number;
    robots: Robot[];

    constructor(width: number, height: number, robots: Robot[]) {
        this.width = width;
        this.height = height;
        this.robots = robots;
    }

    displayRoom(nbSeconds: number, onlyIfRobotsClose: boolean): void {
        if (onlyIfRobotsClose) {
            this.displayRoomIfManyRobotsClose(nbSeconds);
            return;
        }
        console.log(`After ${nbSeconds} seconds:`);
        for (let y = 0; y < this.height; y++) {
            let line = '';
            for (let x = 0; x < this.width; x++) {
                const nbRobots = this.robots.filter(robot => robot.position.x === x && robot.position.y === y).length;
                line += nbRobots === 0 ? '.' : nbRobots;
            }
            console.log(line);
        }
    }

    /**
     * We want a square of 5x5 with at least 1 robot in each cell
     */
    displayRoomIfManyRobotsClose(nbSeconds: number): void {
        const lines: string[] = [];
        for (let y = 0; y < this.height; y++) {
            let line = '';
            for (let x = 0; x < this.width; x++) {
                const nbRobots = this.robots.filter(robot => robot.position.x === x && robot.position.y === y).length;
                line += nbRobots === 0 ? '.' : nbRobots;
            }
            lines.push(line);
        }

        const filteredLines = lines.filter((line, index) => {
            return (line.match(/[^.]{5}/g)?.length || 0) > 0;
        });

        if (filteredLines.length > 0) {
            console.log(`After ${nbSeconds} seconds:`);
            lines.forEach(line => console.log(line));
        }
    }

    moveRobots(): void {
        this.robots.forEach(robot => this.move(robot));
    }

    moveNbSeconds(nbSeconds: number, displayOnlyIfRobotsClose: boolean): void {
        for (let i = 0; i < nbSeconds; i++) {
            this.moveRobots();
            this.displayRoom(i, displayOnlyIfRobotsClose);
        }
    }

    move(robot: Robot): void {
        robot.position.x = (robot.position.x + robot.velocity.x) % this.width;
        if (robot.position.x < 0) {
            robot.position.x += this.width;
        }
        robot.position.y = (robot.position.y + robot.velocity.y) % this.height;
        if (robot.position.y < 0) {
            robot.position.y += this.height;
        }
    }

    findAt(x: number, y: number): Robot[] {
        return this.robots.filter(robot => robot.position.x === x && robot.position.y === y);
    }

    /** Split the grid into 4 quadrants of the same size. The middle line if odd is ignored. */
    toQuadrants(): [Robot[], Robot[], Robot[], Robot[]] {
        const quadrants: [Robot[], Robot[], Robot[], Robot[]] = [[], [], [], []];
        const middleX = Math.floor(this.width / 2);
        const middleY = Math.floor(this.height / 2);
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const robots = this.findAt(x, y);
                if (robots.length === 0) {
                    continue;
                }
                if (x < middleX && y < middleY) {
                    quadrants[0].push(...robots);
                } else if (x > middleX && y < middleY) {
                    quadrants[1].push(...robots);
                } else if (x < middleX && y > middleY) {
                    quadrants[2].push(...robots);
                } else if (x > middleX && y > middleY) {
                    quadrants[3].push(...robots);
                }
            }
        }
        return quadrants;
    }

    multiplyNbRobotsOfQuadrants(): number {
        const quadrants = this.toQuadrants();
        return quadrants[0].length * quadrants[1].length * quadrants[2].length * quadrants[3].length;
    }
}

class Robot {
    position: Position;
    velocity: Position;

    constructor(position: Position, velocity: Position) {
        this.position = position;
        this.velocity = velocity;
    }
}

class RobotsInput extends Input<Robot[]> {
    parse(): Robot[] {
        const lines = this.toText().split('\n').filter(line => line.length > 0);
        // p=0,4 v=3,-3
        const robots: Robot[] = [];
        for (const line of lines) {
            const matches = line.matchAll(/p=(.+),(.+) v=(.+),(.+)/g);
            Array.from(matches).map(match => {
                robots.push(new Robot(new Position(parseInt(match[1], 10), parseInt(match[2], 10)), new Position(parseInt(match[3], 10), parseInt(match[4], 10))));
            });
        }
        return robots;
    }
}

class Day14 {
    static part1(inputFilePath: string, width: number, height: number, nbSeconds: number): number {
        const robots = new RobotsInput(inputFilePath).parse();
        const room = new Room(width, height, robots);
        room.displayRoom(0, false);
        room.moveNbSeconds(nbSeconds, false);
        return room.multiplyNbRobotsOfQuadrants();
    }

    static part2(inputFilePath: string, width: number, height: number, nbSeconds: number): number {
        const robots = new RobotsInput(inputFilePath).parse();
        const room = new Room(width, height, robots);
        room.displayRoom(0, false);
        console.log('Moving...');
        room.moveNbSeconds(nbSeconds, true);
        return room.multiplyNbRobotsOfQuadrants();
    }
}

const startTime = performance.now();
// console.log('Part 1 - Example: ', Day14.part1('simple-input.txt', 11, 7, 10));
// console.log('Part 1 - Example: ', Day14.part1('example-input.txt', 11, 7, 100)); // 12
// console.log('Part 1 - Input: ', Day14.part1('puzzle-input.txt', 101, 103, 100)); // 230900224
console.log('Part 2 - Input: ', Day14.part2('puzzle-input.txt', 101, 103, 6531)); // 6532
const endTime = performance.now();
console.log(`Call to method took ${endTime - startTime} milliseconds`);

