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
                if( user instanceof CustomError ){
                    return res.status(user.statusCode).json(
                        new ApiResponse({error: user.message}, EResponseCodes.FAIL, "Ocurrió un error al intentar registrar un usuario"))
                }

                return res.status(201).json(new ApiResponse(user, EResponseCodes.OK, "Usuario Registrado"));

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

    validateEmailUser = async( req: Request, res: Response ): Promise<ApiResponse<boolean> | any> => {
        
        const { token } = req.params; 

        this.userService.validateEmailUser( token )
            .then( ( valid ) => {
                return res.status(200).json(
                    new ApiResponse(valid, EResponseCodes.OK, "Validación de email exitosa"))
            })
            .catch( (error) => {
                return res.status(400).json(
                    new ApiResponse(error, EResponseCodes.FAIL, "Ocurrió un error al intentar verificar el email"))
            })
        
    }

}
