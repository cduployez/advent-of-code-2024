import {OperationEnum} from './operation-enum';

export class Configuration {
    static allowedOperations: OperationEnum[] = [OperationEnum.ADD, OperationEnum.MULTIPLY, OperationEnum.CONCAT];
}
