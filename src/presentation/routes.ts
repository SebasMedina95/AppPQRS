import { Router } from "express";
import { UserRoutes } from "./routes/user.routes";
import { AuthRoutes } from "./routes/auth.routes";
import { FileUploadRoutes } from "./routes/file-upload.routes";
import { PqrsRoutes } from "./routes/pqrs.routes";

export class AppRoutes {

  static get routes(): Router {

    const router = Router();

    /** Definición de rutas */
    router.use('/api/users', UserRoutes.routes );
    router.use('/api/auth', AuthRoutes.routes );
    router.use('/api/uploads', FileUploadRoutes.routes );
    router.use('/api/pqrs', PqrsRoutes.routes );

    return router;

  }
  
}
