import { Request, Response } from 'express';

import { LoginUserDto } from "../../domain/dtos/auth/login-user-dto";
import { CustomError } from "../../domain/errors/custom.error";
import { ApiResponse } from "../../domain/utils/api-response";

import { IUser } from "../../interfaces/users.interface";
import { EResponseCodes } from '../../constants/api-codes';

import { AuthService } from '../services/auth.service';

export class AuthController {

    constructor(
        public readonly authService: AuthService
    ){}

    //* ************************************************************* *//
    //* **************** LOGIN DE USUARIO AL SISTEMA **************** *//
    //* ************************************************************* *//
    loginUser = async(req: Request, res: Response): Promise<ApiResponse<IUser> | undefined> => {

        const [error, loginDto] = LoginUserDto.loginUser(req.body);

        if( error ){
            res.status(400).json(
                new ApiResponse({error}, EResponseCodes.FAIL, "Ocurrió un error al intentar logearse")
            )
            return;
        }

        this.authService.loginUser(loginDto!)
            .then( (user) => {
                if( user instanceof CustomError ){
                    return res.status(user.statusCode).json(
                        new ApiResponse({error: user.message}, EResponseCodes.FAIL, "Ocurrió un error al intentar logearse"))
                }

                return res.status(200).json(
                    new ApiResponse(user, EResponseCodes.OK, "Login Exitoso"))
            })
            .catch( (error) => {
                return res.status(400).json(
                    new ApiResponse(error, EResponseCodes.FAIL, "Ocurrió un error al intentar Logearse"))
            })

    }

    //* ****************************************************** *//
    //* **************** CAMBIO DE CONTRASEÑA **************** *//
    //* ****************************************************** *//
    changePassword = async(): Promise<ApiResponse<any> | undefined> => {

        throw CustomError.notFoundError("Pendiente de Implementación")

    }

    //* ************************************************************ *//
    //* **************** RECUPERACIÓN DE CONTRASEÑA **************** *//
    //* ************************************************************ *//
    recoverPassword = async(): Promise<ApiResponse<any> | undefined> => {

        throw CustomError.notFoundError("Pendiente de Implementación")

    }

    //* *********************************************************** *//
    //* **************** CAMBIO DE ROLES DE ACCESO **************** *//
    //* *********************************************************** *//
    changeRoles = async(): Promise<ApiResponse<any> | undefined> => {

        throw CustomError.notFoundError("Pendiente de Implementación")

    }

}
