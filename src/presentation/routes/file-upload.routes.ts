import { Router } from 'express';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { FileUploadsController } from '../controllers/file-upload.controller';
import { FileUploadsService } from '../services/file-upload.service';
import { FileUploadMiddleware } from '../middlewares/file-upload.middleware';

export class FileUploadRoutes {

    static get routes(): Router {

        const router = Router();

        const uploadsService = new FileUploadsService();
        const uploadsController = new FileUploadsController( uploadsService );

        router.use( FileUploadMiddleware.containFiles ); //* SE LO APLICAMOS A TODAS LAS RUTAS!
        
        router.post('/users', [ AuthMiddleware.ValidateJwt ], uploadsController.updateImageUser );
        router.post('/single/:type', [ AuthMiddleware.ValidateJwt ], uploadsController.uploadFilePQRS );
        router.post('/multiple/:type', [ AuthMiddleware.ValidateJwt ], uploadsController.uploadMultipleFilePQRS );

        return router;

    }

}