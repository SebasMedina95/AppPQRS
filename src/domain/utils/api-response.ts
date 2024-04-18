import { EResponseCodes } from "../../constants/api-codes";

interface IOperation {
    code: EResponseCodes;
    message?: string;
}

export class ApiResponse<T> {
    data: T;
    operation: IOperation;
  
    constructor(data: T, code: EResponseCodes, message?: string) {
      this.data = data;
      this.operation = { code, message };
    }
}