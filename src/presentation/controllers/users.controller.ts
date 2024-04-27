import { Request, Response } from 'express';
import { UserService } from "../services/users.service"
import { IUser, IUserPaginated } from '../../interfaces/users.interface';
import { EResponseCodes } from '../../constants/api-codes';

import { ApiResponse } from '../../domain/utils/api-response';
import { RegisterUserDto } from '../../domain/dtos/users/register-user.dto';
import { CustomError } from '../../domain/errors/custom.error';
import { handleError } from '../../domain/errors/handler.error';
import { PaginationDto } from '../../domain/common/pagination.dto';
import { SearchUserDto } from '../../domain/dtos/users/search-user.dto';
import { UpdateUserDto } from '../../domain/dtos/users/update-user.dto';


export class UserController {

    constructor(
        public readonly userService: UserService
    ){}

    //* ************************************************************ *//
    //* **************** REGISTRAR UN NUEVO USUARIO **************** *//
    //* ************************************************************ *//
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

    //* *************************************************************** *//
    //* **************** ACTUALIZAR USUARIO REGISTRADO **************** *//
    //* *************************************************************** *//
    updateUser = async( req: Request, res: Response ): Promise<ApiResponse<IUser> | undefined> => {
        
        const [error, updateDto] = UpdateUserDto.updateUser(req.body);
        const { userValidated } = req.body; //La sesión del usuario

        if( error ){
            res.status(400).json(
                new ApiResponse({error}, EResponseCodes.FAIL, "Ocurrió un error al intentar registrar un usuario")
            )
            return;
        }

        this.userService.updateUser( updateDto!, userValidated )
            .then( (user) => {

                if( user instanceof CustomError ){
                    return res.status(user.statusCode).json(
                        new ApiResponse({error: user.message}, EResponseCodes.FAIL, "Ocurrió un error al intentar actualizar un usuario"))
                }

                if( user == null )
                    return res.status(404).json(
                        new ApiResponse(null, EResponseCodes.FAIL, `No se encontró información con el ID ${updateDto!.id}`))

                return res.status(200).json(new ApiResponse(user, EResponseCodes.OK, "Usuario Actualizado"));

            }).catch( (error) => {
                return handleError( error, res )
            })
        
    }

    //* ************************************************************* *//
    //* **************** ELIMINADO LÓGICO DE USUARIO **************** *//
    //* ************************************************************* *//
    deleteUser = async( req: Request, res: Response ): Promise<ApiResponse<IUser> | undefined> => {
        
        const { id } = req.params;
        const { userValidated } = req.body; //La sesión del usuario

        const [error, searchDto] = SearchUserDto.searchUser( Number(id) );

        if( error ){
            res.status(400).json(
                new ApiResponse({error}, EResponseCodes.FAIL, "Ocurrió un error al intentar encontrar el ID")
            )
            return;
        }

        this.userService.deleteUser( searchDto!, userValidated )
            .then( (logicDeleteById) => {

                if( logicDeleteById instanceof CustomError ) return handleError(logicDeleteById.message, res);
                if( logicDeleteById == "error2" )
                    return res.status(404).json(
                        new ApiResponse(null, EResponseCodes.FAIL, `No se encontró información con el ID ${id}`))

                if( logicDeleteById == "error1" )
                    return res.status(401).json(
                        new ApiResponse(null, EResponseCodes.FAIL, `Usted no se encuentra autorizado para realizar esta acción`))

                return res.status(200).json(
                    new ApiResponse(logicDeleteById, EResponseCodes.OK, "Eliminación lógica de usuario por ID"))

            })
            .catch( error => handleError(error, res))

        return;

        
    }

    //* ******************************************************* *//
    //* **************** BUSCAR USUARIO POR ID **************** *//
    //* ******************************************************* *//
    searchById = async( req: Request, res: Response ): Promise<ApiResponse<IUser> | undefined> => {
        
        const { id } = req.params;

        const [error, searchDto] = SearchUserDto.searchUser( Number(id) );

        if( error ){
            res.status(400).json(
                new ApiResponse({error}, EResponseCodes.FAIL, "Ocurrió un error al intentar encontrar el ID")
            )
            return;
        }

        this.userService.searchById( searchDto! )
            .then( (getById) => {

                if( getById instanceof CustomError ) return handleError(getById.message, res);
                if( getById == null )
                    return res.status(404).json(
                        new ApiResponse(null, EResponseCodes.FAIL, `No se encontró información con el ID ${id}`))

                return res.status(200).json(
                    new ApiResponse(getById, EResponseCodes.OK, "Obteniendo usuario por ID"))

            })
            .catch( error => handleError(error, res))

        return;
        
    }

    //* ************************************************************************* *//
    //* **************** LISTAR USUARIOS CON FILTRO Y PAGINACIÓN **************** *//
    //* ************************************************************************* *//
    list = async( req: Request, res: Response ): Promise<ApiResponse<IUserPaginated> | undefined> => {
        
        const { page , limit , search = "" } = req.body;
        const [error, paginationDto] = PaginationDto.pagination( Number(page), Number(limit), search.toString() ); 

        if( error ){
            res.status(400).json(
                new ApiResponse({error}, EResponseCodes.FAIL, "Ocurrió un error al intentar paginar los usuarios")
            )
            return;
        }

        this.userService.list( paginationDto! )
            .then( (userResp) => {

                if( userResp instanceof CustomError ) return handleError(userResp.message, res)
                return res.status(200).json(
                    new ApiResponse(userResp, EResponseCodes.OK, "Obteniendo usuarios"))

            })
            .catch( error => handleError(error, res))

        return;

    }

    //* **************************************************************** *//
    //* **************** VALIDACIÓN DE EMAIL REGISTRADO **************** *//
    //* **************************************************************** *//
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
