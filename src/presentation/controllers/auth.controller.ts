import { Request, Response } from 'express';

import { LoginUserDto } from "../../domain/dtos/auth/login-user-dto";
import { ChangePasswordUserDto } from '../../domain/dtos/auth/change-pass-dto';
import { CustomError } from "../../domain/errors/custom.error";
import { ChangeRolesUserDto } from '../../domain/dtos/auth/change-roles.dto';
import { RecoverPasswordUserDto } from '../../domain/dtos/auth/recover-pass.dto';
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
    changePassword = async(req: Request, res: Response): Promise<ApiResponse<IUser> | undefined> => {

        const [error, changePasswordUserDto] = ChangePasswordUserDto.changePasswordUser(req.body);
        const { userValidated } = req.body; //La sesión del usuario

        if( error ){
            res.status(400).json(
                new ApiResponse({error}, EResponseCodes.FAIL, "Ocurrió un error al intentar cambiar la contraseña")
            )
            return;
        }

        this.authService.changePassword(changePasswordUserDto!, userValidated)
            .then( (userChange) => {
                if( userChange instanceof CustomError ){
                    return res.status(userChange.statusCode).json(
                        new ApiResponse({error: userChange.message}, EResponseCodes.FAIL, "Ocurrió un error al intentar cambiar la contraseña"))
                }

                return res.status(200).json(
                    new ApiResponse(userChange, EResponseCodes.OK, "Actualización de Contraseña Exitosa"))
            })
            .catch( (error) => {
                return res.status(400).json(
                    new ApiResponse(error, EResponseCodes.FAIL, "Ocurrió un error al intentar Actualizar la Contraseña"))
            })

    }

    //* ************************************************************ *//
    //* **************** RECUPERACIÓN DE CONTRASEÑA **************** *//
    //* ************************************************************ *//
    recoverPassword = async(req: Request, res: Response): Promise<ApiResponse<boolean> | undefined> => {

        const [error, recoverPasswordUserDto] = RecoverPasswordUserDto.recoverUser(req.body);

        if( error ){
            res.status(400).json(
                new ApiResponse({error}, EResponseCodes.FAIL, "Ocurrió un error al intentar recuperar la contraseña")
            )
            return;
        }

        this.authService.recoverPassword(recoverPasswordUserDto!)
            .then( (recoverPassword) => {
                if( recoverPassword instanceof CustomError ){
                    return res.status(recoverPassword.statusCode).json(
                        new ApiResponse({error: recoverPassword.message}, EResponseCodes.FAIL, "Ocurrió un error al intentar recuperar la contraseña"))
                }

                if( !recoverPassword ){
                    return res.status(400).json(
                        new ApiResponse(false, EResponseCodes.FAIL, "Error, no pudo ser hallado el email para la recuperación"))
                }

                return res.status(200).json(
                    new ApiResponse(recoverPassword, EResponseCodes.OK, "Recuperación de Contraseña Exitosa - Revise Correo"))
            })
            .catch( (error) => {
                return res.status(400).json(
                    new ApiResponse(error, EResponseCodes.FAIL, "Ocurrió un error al intentar Recuperar la Contraseña"))
            })

    }

    //* *********************************************************** *//
    //* **************** CAMBIO DE ROLES DE ACCESO **************** *//
    //* *********************************************************** *//
    changeRoles = async(req: Request, res: Response): Promise<ApiResponse<IUser> | undefined> => {

        const [error, changeRolesUserDto] = ChangeRolesUserDto.changeRolesUser(req.body);
        const { userValidated } = req.body; //La sesión del usuario

        if( error ){
            res.status(400).json(
                new ApiResponse({error}, EResponseCodes.FAIL, "Ocurrió un error al intentar actualizar los roles")
            )
            return;
        }

        this.authService.changeRoles(changeRolesUserDto!, userValidated)
            .then( (userChange) => {
                if( userChange instanceof CustomError ){
                    return res.status(userChange.statusCode).json(
                        new ApiResponse({error: userChange.message}, EResponseCodes.FAIL, "Ocurrió un error al intentar cambiar los Roles"))
                }

                return res.status(200).json(
                    new ApiResponse(userChange, EResponseCodes.OK, "Actualización de Roles Exitosa"))
            })
            .catch( (error) => {
                return res.status(400).json(
                    new ApiResponse(error, EResponseCodes.FAIL, "Ocurrió un error al intentar Actualizar los Roles"))
            })

    }

}
