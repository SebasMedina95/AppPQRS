import { Router } from 'express';
import { envs } from '../../config/envs';
import { UserService } from '../services/users.service';
import { UserController } from '../controllers/users.controller';


export class UserRoutes {

    static get routes(): Router {

        const router = Router();
        // const emailService = new EmailService(
        //     envs.MAILER_SERVICE,
        //     envs.MAILER_EMAIL,
        //     envs.MAILER_SECRET_KEY,
        //     envs.SEND_EMAIL
        // );

        const userService = new UserService( /*emailService*/ );
        const userController = new UserController( userService );

        router.post('/register', userController.registerUser );
        router.post('/update', userController.updateUser );
        router.post('/delete', userController.deleteUser );
        router.get('/search/:id', userController.searchById );
        router.get('/list', userController.list );
        router.get('/validate-email/:token', userController.validateEmailUser );

        return router;

    }

}