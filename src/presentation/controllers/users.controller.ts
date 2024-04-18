import { Request, Response } from 'express';
import { UserService } from "../services/users.service"
import { IUser } from '../../interfaces/users.interface';
import { EResponseCodes } from '../../constants/api-codes';

import { ApiResponse } from '../../domain/utils/api-response';
import { RegisterUserDto } from '../../domain/dtos/users/register-user.dto';
import { CustomError } from '../../domain/errors/custom.error';
import { handleError } from '../../domain/errors/handler.error';


export class UserController {

    constructor(
        public readonly userService: UserService
    ){}

    registerUser = async( req: Request, res: Response ): Promise<ApiResponse<IUser> | undefined> => {
        
        const [error, registerDto] = RegisterUserDto.registerUser(req.body);

        if( error ){
            res.status(400).json(
                new ApiResponse({error}, EResponseCodes.FAIL, "Ocurrió un error al intentar registrar un usuario")
            )
            return;
        }

        this.userService.registerUser( registerDto! )
            .then( (user) => {
                if( user instanceof CustomError ) return handleError("Ocurrió un error al intentar registrar un usuario", res);
                return res.status(201).json(new ApiResponse(user, EResponseCodes.OK, "Usuario Registrado"))
            }).catch( (error) => {
                return handleError( error, res )
            })
        
    }

    updateUser = async( req: Request, res: Response ) => {
        res.json("Hola desde updateUser");
    }

    deleteUser = async( req: Request, res: Response ) => {
        res.json("Hola desde deleteUser");
    }

    searchById = async( req: Request, res: Response ) => {
        res.json("Hola desde searchById");
    }

    list = async( req: Request, res: Response ) => {
        res.json("Hola desde list");
    }

    validateEmailUser = async( req: Request, res: Response ) => {
        res.json("Hola desde validateEmailUser");
    }

}
