import { BcryptAdapter } from "../../config/bcryptjs.adapter";
import { JwtAdapter } from "../../config/jwt.adapter";
import { prisma } from "../../db/postgres";
import { LoginUserDto } from "../../domain/dtos/auth/login-user-dto";
import { CustomError } from "../../domain/errors/custom.error";
import { IUser } from "../../interfaces/users.interface";

export class AuthService {

    loginUser = async( loginUserDto: LoginUserDto ): Promise<IUser | CustomError> => {

        const emailValid: string = loginUserDto.email;

        const getUser = await prisma.uSER_USERS.findFirst({
            where: {
                AND: [
                    { email: emailValid },
                    // { emailValidated: true }
                ]
            }
        });

        //El email fue encontrado
        if( !getUser ) return CustomError.badRequestError("El email no fue encontrado");

        //Debemos validar que el correo esté verificado //Por aparte.
        if( !getUser.emailValidated ) return CustomError.badRequestError("El email no ha sido verificado");

        //Validamos la contraseña
        const bcryptAdapter = new BcryptAdapter;
        const passwordValid: boolean =  bcryptAdapter.compare(loginUserDto.password, getUser.password);
        if( !passwordValid ) return CustomError.badRequestError("Usuario y/o contraseña incorrectos");

        const objResult: IUser = { ...getUser };
        const { password, ...userEntityFilter } = objResult;

        //Generar jwt
        const jwtAdapter = new JwtAdapter();
        const token: any = await jwtAdapter.generateToken({ id: objResult.id });
        if( !token ) throw CustomError.internalServerError("Error generando el JWT")

        return {
            ...userEntityFilter,
            token: token
        };

    }

}
