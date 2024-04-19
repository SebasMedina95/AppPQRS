import { BcryptAdapter } from "../../config/bcryptjs.adapter";
import { JwtAdapter } from "../../config/jwt.adapter";
import { prisma } from "../../db/postgres";
import { RegisterUserDto } from "../../domain/dtos/users/register-user.dto"
import { UserEntity } from "../../domain/entities/user.entity";
import { CustomError } from "../../domain/errors/custom.error"
import { IUser } from "../../interfaces/users.interface"
import { EmailService } from "./email.service";

export class UserService {

    constructor(
        private readonly emailService: EmailService,
    ){}

    registerUser = async( registerUserDto: RegisterUserDto ): Promise<IUser | CustomError> => {

        const emailValid: string = registerUserDto.email;
        const documentValid: string = registerUserDto.document;
        const existUser = await prisma.uSER_USERS.findMany({
            where: {
                OR: [
                    { email: emailValid },
                    { document: documentValid },
                ]
            }
        });

        if( existUser.length > 0 ) return CustomError.badRequestError("Ya existe el email o el documento");

        try{

            const bcrypt = new BcryptAdapter();

            const newUser = await prisma.uSER_USERS.create({
                data: {
                    typeDocument: registerUserDto.typeDocument,
                    document: registerUserDto.document,
                    fullName: registerUserDto.fullName,
                    email: registerUserDto.email,
                    password:  bcrypt.hash(registerUserDto.password),
                    address: registerUserDto.address,
                    phone: registerUserDto.phone,
                    cellPhone: registerUserDto.cellPhone,
                    description: registerUserDto.description,
                }
            })

            const { password, ...userEntity } = UserEntity.fromObject(newUser)

            //Generación del JWT
            const jwtAdapter = new JwtAdapter();
            const token: any = await jwtAdapter.generateToken({ id: userEntity.id });
            if( !token ) throw CustomError.internalServerError("Error generando el Json Web Token");

            //Envío del Email para Confirmación
            await this.emailService.sendEmailValidacionLink(userEntity.email);

            return {
                id: userEntity.id,
                typeDocument: userEntity.typeDocument,
                document: userEntity.document,
                fullName: userEntity.fullName,
                email: userEntity.email,
                emailValidated: userEntity.emailValidated,
                img: userEntity.img,
                address: userEntity.address,
                phone: userEntity.phone,
                cellPhone: userEntity.cellPhone,
                description: userEntity.description,
                token,
            }

        } catch( error ){

            throw CustomError.internalServerError(`${error}`);

        } finally {

            await prisma.$disconnect();

        }

    }

    updateUser = async() => {

    }

    deleteUser = async() => {

    }

    searchById = async() => {

    }

    list = async() => {

    }

    validateEmailUser = async( token: string ) => {

        const jwtAdapter = new JwtAdapter();
        const payload = await jwtAdapter.validateToken( token );
        if( !payload ) throw CustomError.unAuthorizedError("El token no es válido");

        const { email } = payload as { email: string };
        if( !email ) throw CustomError.internalServerError("No se encontró email en Token");

        const user = await prisma.uSER_USERS.findFirst({
            where: { email }
        });

        if( !user ) throw CustomError.internalServerError("No se encontró el email");

        await prisma.uSER_USERS.update({
            where: { email },
            data: {
                emailValidated: true
            }
        });
        
        return true;

    }

}
