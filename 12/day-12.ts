import {Input} from '../input';

class Position {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

class Plant {
    static globalId: number = 0;
    readonly id: number = Plant.globalId++;
    plantType: string;
    position: Position;
    region: Region | null = null;

    constructor(plantType: string, position: Position) {
        this.plantType = plantType;
        this.position = position;
    }
}

class Region {
    static globalId: number = 0;
    readonly id: number = Region.globalId++;
    unorderedPlants: Set<Plant> = new Set<Plant>();
    plantMap: (Plant | null)[][] = [];

    constructor(unorderedPlants: Set<Plant> = new Set<Plant>()) {
        this.unorderedPlants = unorderedPlants;
    }

    addUnorderedPlant(plant: Plant): void {
        if (plant.region !== null && plant.region !== this) {
            this.mergeOtherRegionIntoThis(plant.region);
        }
        this.unorderedPlants.add(plant);
        plant.region = this;
    }

    mergeOtherRegionIntoThis(region: Region): void {
        region.unorderedPlants.forEach(plant => {
            plant.region = this;
            region.unorderedPlants.delete(plant);
            this.addUnorderedPlant(plant);
        });
    }

    generatePlantMap(): void {
        const minimumX = Math.min(...Array.from(this.unorderedPlants).map(p => p.position.x));
        const maximumX = Math.max(...Array.from(this.unorderedPlants).map(p => p.position.x));
        const minimumY = Math.min(...Array.from(this.unorderedPlants).map(p => p.position.y));
        const maximumY = Math.max(...Array.from(this.unorderedPlants).map(p => p.position.y));
        this.plantMap = new Array(maximumY - minimumY + 1).fill(null);
        for (let i = 0; i < this.plantMap.length; i++) {
            this.plantMap[i] = new Array(maximumX - minimumX + 1).fill(null);
        }
        this.unorderedPlants.forEach(plant => {
            const x = plant.position.x - minimumX;
            const y = plant.position.y - minimumY;
            if (!this.plantMap[y]) {
                this.plantMap[y] = [];
            }
            this.plantMap[y][x] = plant;
        });
    }

    /**
     * Add at the right position in the array
     */

    /*    add(plant: Plant): void {
            const x = plant.position.x - this.startPosition.x;
            const y = plant.position.y - this.startPosition.y;
            while (y >= this.plants.length) {
                this.plants.push([]);
            }

            while (x >= this.plants[y].length) {
                this.plants[y].push(null);
            }

            this.plants[y][x] = plant;
        }*/

    getTopPlant(x: number, y: number): Plant | null {
        if (y > 0) {
            return this.plantMap[y - 1][x];
        }
        return null;
    }

    getBottomPlant(x: number, y: number): Plant | null {
        if (y < this.plantMap.length - 1) {
            return this.plantMap[y + 1][x];
        }
        return null;
    }

    getLeftPlant(x: number, y: number): Plant | null {
        if (x > 0) {
            return this.plantMap[y][x - 1];
        }
        return null;
    }

    getRightPlant(x: number, y: number): Plant | null {
        if (x < this.plantMap[y].length - 1) {
            return this.plantMap[y][x + 1];
        }
        return null;
    }

    display(): void {
        this.plantMap.forEach(row => {
            console.log(row.map(p => p?.plantType || '.').join(''));
        })
        console.log(`A region of ${this.unorderedPlants.values().next().value?.plantType} plants with price ${this.area()} * ${this.perimeter()} = ${this.price()}.`);
    }

    price(): number {
        return this.perimeter() * this.area();
    }

    area(): number {
        return this.unorderedPlants.size;
    }

    perimeter(): number {
        let count = 0;
        this.plantMap.forEach((row, y) => {
            row.forEach((plant, x) => {
                if (plant) {
                    if (!this.getTopPlant(x, y)) {
                        count++;
                    }
                    if (!this.getBottomPlant(x, y)) {
                        count++;
                    }
                    if (!this.getLeftPlant(x, y)) {
                        count++;
                    }
                    if (!this.getRightPlant(x, y)) {
                        count++;
                    }
                }
            });
        });
        return count;
    }
}

class GardenPlotMap {
    plants: Plant[][];
    regions: Region[];

    constructor(plants: Plant[][]) {
        this.plants = plants;
        this.regions = this.toRegions();
    }

    getTopPlant(plant: Plant): Plant | null {
        if (plant.position.y > 0) {
            return this.plants[plant.position.y - 1][plant.position.x];
        }
        return null
    }

    getLeftPlant(plant: Plant): Plant | null {
        if (plant.position.x > 0) {
            return this.plants[plant.position.y][plant.position.x - 1];
        }
        return null;
    }

    getRightPlant(plant: Plant): Plant | null {
        if (plant.position.x < this.plants[plant.position.y].length - 1) {
            return this.plants[plant.position.y][plant.position.x + 1];
        }
        return null;
    }

    getBottomPlant(plant: Plant): Plant | null {
        if (plant.position.y < this.plants.length - 1) {
            return this.plants[plant.position.y + 1][plant.position.x];
        }
        return null;
    }

    toRegions(): Region[] {
        const regionRecord: Record<number, Region> = {};
        for (let y = 0; y < this.plants.length; y++) {
            for (let x = 0; x < this.plants[y].length; x++) {
                const plant: Plant = this.plants[y][x];
                if (!plant.region) {
                    this.addToRegion(plant, plant.region, regionRecord);
                }
                const topPlant = this.getTopPlant(plant);
                if (topPlant?.plantType === plant.plantType) {
                    this.addToRegion(topPlant, plant.region, regionRecord);
                }
                const leftPlant = this.getLeftPlant(plant);
                if (leftPlant?.plantType === plant.plantType) {
                    this.addToRegion(leftPlant, plant.region, regionRecord);
                }
                const rightPlant = this.getRightPlant(plant);
                if (rightPlant?.plantType === plant.plantType) {
                    this.addToRegion(rightPlant, plant.region, regionRecord);
                }
                const bottomPlant = this.getBottomPlant(plant);
                if (bottomPlant?.plantType === plant.plantType) {
                    this.addToRegion(bottomPlant, plant.region, regionRecord);
                }
            }
        }
        const regions = Object.values(regionRecord).filter(r => r.unorderedPlants.size > 0);
        regions.forEach(r => r.generatePlantMap());
        return regions;
    }

    /**
     * Display with format:
     * +-+-+-+-+
     * |A A A A|
     * +-+-+-+-+     +-+
     *               |D|
     * +-+-+   +-+   +-+
     * |B B|   |C|
     * +   +   + +-+
     * |B B|   |C C|
     * +-+-+   +-+ +
     *           |C|
     * +-+-+-+   +-+
     * |E E E|
     * +-+-+-+
     */
    displayRegions(): void {
        this.regions.forEach(region => {
            region.display();
        });
    }

    private addToRegion(plant: Plant, region: Region | null, regions: Record<number, Region>): Region {
        region = region || new Region();
        region.addUnorderedPlant(plant);
        regions[region.id] = region;
        return region;
    }

    totalPrice(): number {
        return this.regions.reduce((acc, region) => acc + region.price(), 0);
    }
}

class GardenPlotMapInput extends Input<GardenPlotMap> {
    parse(): GardenPlotMap {
        const lines = this.toText().split('\n').filter(l => l.length > 0);
        const plants: Plant[][] = [];
        for (let y = 0; y < lines.length; y++) {
            const line = lines[y];
            const row: Plant[] = [];
            for (let x = 0; x < line.length; x++) {
                const plantType = line[x];
                if (plantType) {
                    row.push(new Plant(plantType, new Position(x, y)));
                }
            }
            plants.push(row);
        }
        return new GardenPlotMap(plants);
    }


}

class Day12 {
    static part1(inputFilePath: string): number {
        const gardenPlotMap = new GardenPlotMapInput(inputFilePath).parse();
        gardenPlotMap.displayRegions();
        return gardenPlotMap.totalPrice();
    }

    static part2(inputFilePath: string): number {
        return 0;
    }
}

const startTime = performance.now();
// console.log('Part 1 - Example: ', Day12.part1('example-input.txt')); // 140
// console.log('Part 1 - Example: ', Day12.part1('example-input2.txt')); // 772
console.log('Part 1 - Example: ', Day12.part1('example-input3.txt')); //

const endTime = performance.now();
console.log(`Call to method took ${endTime - startTime} milliseconds`);

