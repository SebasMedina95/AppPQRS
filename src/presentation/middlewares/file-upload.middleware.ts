import { NextFunction, Request, Response } from "express";
import { ApiResponse } from "../../domain/utils/api-response";
import { EResponseCodes } from "../../constants/api-codes";

export class FileUploadMiddleware {

    static containFiles( req: Request, res: Response, next: NextFunction ){

        if( !req.files || Object.keys(req.files).length === 0 ){
            return res.status(400).json(
                new ApiResponse(false, EResponseCodes.FAIL, "No se ha proporcionado un adjunto"));
        }

        //Para manejar como arreglos
        if( !Array.isArray( req.files.file ) ){
            
            req.body.files = [ req.files.file ]; //No olvidar que file es el nombre que le dimos. x1

            if(req.body.files[0].size > 2000000){
                return res.status(400).json(
                    new ApiResponse(false, EResponseCodes.FAIL, "El adjunto no puede pesar más de 2MB"));
            }

        }else{
            req.body.files = req.files.file; //No olvidar que file es el nombre que le dimos. xN

            for (let i = 0; i < req.body.files.length; i++) {
                if( req.body.files[i].size > 2000000 ){
                    return res.status(400).json(
                        new ApiResponse(false, EResponseCodes.FAIL, "Hay alguno de los adjuntos que pesa más de 2MB"));
                }
            }

        }

        next();

    }

}
