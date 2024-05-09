import { Router } from 'express';
import { envs } from '../../config/envs';
import { UserService } from '../services/users.service';
import { UserController } from '../controllers/users.controller';
import { EmailService } from '../services/email.service';
import { AuthMiddleware } from '../middlewares/auth.middleware';


export class UserRoutes {

    static get routes(): Router {

        const router = Router();
        const emailService = new EmailService(
            envs.MAILER_SERVICE,
            envs.MAILER_EMAIL,
            envs.MAILER_SECRET_KEY,
            envs.SEND_EMAIL,
        );

        const userService = new UserService( emailService );
        const userController = new UserController( userService );

        router.post('/register', userController.registerUser );
        router.get('/validate-email/:token', userController.validateEmailUser );

        router.put('/update', [ AuthMiddleware.ValidateJwt ], userController.updateUser );
        router.patch('/delete/:id', [ AuthMiddleware.ValidateJwt ], userController.deleteUser );
        router.get('/search/:id', [ AuthMiddleware.ValidateJwt ], userController.searchById );
        router.get('/list', [ AuthMiddleware.ValidateJwt ], userController.list );
        router.post('/update-image/:id', [ AuthMiddleware.ValidateJwt ], userController.updateImageUser );

        return router;

    }

}
