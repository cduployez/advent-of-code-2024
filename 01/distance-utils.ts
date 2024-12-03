import {Pair} from './pair';

export class DistanceUtils {
    static distanceSum = (leftList: number[], rightList: number[]): number => {
        const sortedLeftList = leftList.sort();
        const sortedRightList = rightList.sort();
        const pairs = sortedLeftList.map((leftValue, index) => new Pair(leftValue, sortedRightList[index]));
        console.log(pairs.map(p => p.distance()));
        return pairs.reduce((acc, pair) => acc + pair.distance(), 0);
    };
}
