import { Request, Response } from 'express';
import { UserService } from "../services/users.service"

import { ApiResponse } from '../../domain/utils/api-response';
import { FileUploadsService } from '../services/file-upload.service';
import { EResponseCodes } from '../../constants/api-codes';
import { UploadedFile } from 'express-fileupload';


export class FileUploadsController {

    constructor(
        private readonly fileUploadsService: FileUploadsService
    ){}


    //* ********************************************************* *//
    //* **************** SUBIR IMAGEN DE USUARIO **************** *//
    //* ********************************************************* *//
    updateImageUser = async( req: Request, res: Response ): Promise<ApiResponse<boolean> | any> => {

        const file = req.files!.file as UploadedFile;
        const { userValidated } = req.body; //La sesión del usuario

        this.fileUploadsService.updateImageUser( file, userValidated )
            .then( uploadedFile => {

                if( uploadedFile == "error1" ){
                    return res.status(400).json(
                        new ApiResponse(null, EResponseCodes.FAIL, "No se pudo subir el archivo, solo se permite JPG, JPEG o PNG"));
                }

                return res.status(201).json(
                    new ApiResponse(uploadedFile, EResponseCodes.OK, "Subida imagen al perfil de usuario correcta"));
                
            })
            .catch( (error) => {
                return res.status(400).json(
                    new ApiResponse(error, EResponseCodes.FAIL, "Ocurrió un error al intentar cargar archivo"))
            })
        

    }

    //* ****************************************************************** *//
    //* **************** SUBIR ADJUNTO DE PQRS (UNO SOLO) **************** *//
    //* ****************************************************************** *//
    uploadFilePQRS = async( req: Request, res: Response ): Promise<ApiResponse<boolean> | any> => {

        console.log("uploadFilePQRS")

    }

    //* ******************************************************************* *//
    //* **************** SUBIR ADJUNTO DE PQRS (MULTIPLES) **************** *//
    //* ******************************************************************* *//
    uploadMultipleFilePQRS = async( req: Request, res: Response ): Promise<ApiResponse<boolean> | any> => {

        console.log("uploadMultipleFilePQRS")

    }

}
