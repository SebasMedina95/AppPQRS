import { Router } from 'express';
import { AuthService } from '../services/auth.service';
import { AuthController } from '../controllers/auth.controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';

export class AuthRoutes {

    static get routes(): Router {

        const router = Router();

        const authService = new AuthService();
        const authController = new AuthController( authService );

        router.post('/login', authController.loginUser );
        router.put('/recover-password', authController.recoverPassword );
        
        router.put('/change-password', [ AuthMiddleware.ValidateJwt ], authController.changePassword );
        router.put('/change-roles', [ AuthMiddleware.ValidateJwt ], authController.changeRoles );

        return router;

    }

}
