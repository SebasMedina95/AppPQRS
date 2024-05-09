import { Router } from 'express';
import { envs } from '../../config/envs';
import { UserService } from '../services/users.service';
import { UserController } from '../controllers/users.controller';
import { EmailService } from '../services/email.service';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { PqrsService } from '../services/pqrs.service';
import { PqrsController } from '../controllers/pqrs.controller';


export class PqrsRoutes {

    static get routes(): Router {

        const router = Router();
        const emailService = new EmailService(
            envs.MAILER_SERVICE,
            envs.MAILER_EMAIL,
            envs.MAILER_SECRET_KEY,
            envs.SEND_EMAIL,
        );

        const pqrsService = new PqrsService( emailService );
        const pqrsController = new PqrsController( pqrsService );

        router.post('/register', pqrsController.registerUser );
        router.put('/update', [ AuthMiddleware.ValidateJwt ], pqrsController.updateUser );
        router.patch('/delete/:id', [ AuthMiddleware.ValidateJwt ], pqrsController.deleteUser );
        router.get('/search/:id', [ AuthMiddleware.ValidateJwt ], pqrsController.searchById );
        router.get('/search-user/:id', [ AuthMiddleware.ValidateJwt ], pqrsController.searchByUser );
        router.get('/list', [ AuthMiddleware.ValidateJwt ], pqrsController.list );
        router.get('/list-status/:status', [ AuthMiddleware.ValidateJwt ], pqrsController.listStatus );

        return router;

    }

}
