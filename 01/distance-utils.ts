import {Pair} from './pair';

export class DistanceUtils {
    static distanceSum = (leftList: number[], rightList: number[]): number => {
        const sortedLeftList = leftList.sort();
        const sortedRightList = rightList.sort();
        const pairs = sortedLeftList.map((leftValue, index) => new Pair(leftValue, sortedRightList[index]));
        return pairs.reduce((acc, pair) => acc + pair.distance(), 0);
    };

    static similarityScore(leftList: number[], rightList: number[]): number {
        let score = 0;
        leftList.forEach(leftValue => {
            let nbRightOccurrences = rightList.filter(rightValue => rightValue === leftValue).length;
            score += leftValue * nbRightOccurrences;
        });
        return score;
    }
}
