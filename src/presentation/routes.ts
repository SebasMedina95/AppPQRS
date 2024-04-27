import { Router } from "express";
import { UserRoutes } from "./routes/user.routes";
import { AuthRoutes } from "./routes/auth.routes";

export class AppRoutes {

  static get routes(): Router {

    const router = Router();

    /** Definición de rutas */
    router.use('/api/users', UserRoutes.routes );
    router.use('/api/auth', AuthRoutes.routes );

    return router;

  }
  
}
