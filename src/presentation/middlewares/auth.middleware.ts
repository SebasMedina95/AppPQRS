import { NextFunction, Request, Response } from "express";
import { JwtAdapter } from "../../config/jwt.adapter";
import { prisma } from "../../db/postgres";
import { IUser } from "../../interfaces/users.interface";

export class AuthMiddleware {

    static async ValidateJwt( req: Request, res: Response, next: NextFunction ) {

        const authorization = req.header("Authorization");
        if( !authorization ) return res.status(401).json({error : "Acceso Denegado"});
        if( !authorization.startsWith("Bearer ") ) return res.status(401).json({error : "Acceso Denegado - Bearer Token Inválido"});

        const token = authorization.split(" ").at(1) || '';

        try {

            const jwtAdapter = new JwtAdapter();
            const payload = await jwtAdapter.validateToken<{ id: string }>(token);
            if( !payload ) return res.status(401).json({ error : "Token Inválido" });

            const user = await prisma.uSER_USERS.findFirst({
                where: {
                    id : Number(payload.id)
                }
            });

            if( !user ) return res.status(500).json({ error : "Error Interno del Servidor - Usuario no Encontrado" });
            if( !user.emailValidated ) return res.status(500).json({ error : "Error Interno del Servidor - Correo no Verificado" });

            //Lo asigno y lo genero como una instancia del Usuario
            const { password, ...restResponse } = user as IUser;
            req.body.userValidated = restResponse;

            next();
            
        } catch (error) {
            console.log(error);
            res.status(500).json("Error interno del servidor")
        }

    }

}