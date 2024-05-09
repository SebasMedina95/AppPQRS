import { PqrsService } from "../services/pqrs.service";


export class PqrsController {

    constructor(
        public readonly pqrsService: PqrsService
    ){}

    registerUser = async() => {
        console.log("registerUser");
    }

    updateUser = async() => {
        console.log("updateUser");
    }

    deleteUser = async() => {
        console.log("deleteUser");
    }

    searchById = async() => {
        console.log("searchById");
    }

    searchByUser = async() => {
        console.log("searchByUser");
    }

    list = async() => {
        console.log("list");
    }

    listStatus = async() => {
        console.log("listStatus");
    }


}
