import { Router } from 'express';
import { AuthService } from '../services/auth.service';
import { EmailService } from '../services/email.service';
import { AuthController } from '../controllers/auth.controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { envs } from '../../config/envs';

export class AuthRoutes {

    static get routes(): Router {

        const router = Router();
        const emailService = new EmailService(
            envs.MAILER_SERVICE,
            envs.MAILER_EMAIL,
            envs.MAILER_SECRET_KEY,
            envs.SEND_EMAIL,
        );

        const authService = new AuthService( emailService );
        const authController = new AuthController( authService );

        router.post('/login', authController.loginUser );
        router.put('/recover-password', authController.recoverPassword );
        
        router.put('/change-password', [ AuthMiddleware.ValidateJwt ], authController.changePassword );
        router.put('/change-roles', [ AuthMiddleware.ValidateJwt ], authController.changeRoles );

        return router;

    }

}
