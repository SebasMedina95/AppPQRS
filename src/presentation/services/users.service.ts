import { BcryptAdapter } from "../../config/bcryptjs.adapter";
import { prisma } from "../../db/postgres";
import { RegisterUserDto } from "../../domain/dtos/users/register-user.dto"
import { CustomError } from "../../domain/errors/custom.error"
import { IUser } from "../../interfaces/users.interface"

export class UserService {

    constructor(
        
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

            const objResult: IUser = {
                ...newUser
            }

            //TODO: Generar JWT

            //TODO: Enviar Email para Confirmar

            return {
                ...objResult,
                token: "ABC123"
            }

        } catch( error ){

        } finally {

        }

        return registerUserDto;

    }

    updateUser = async() => {

    }

    deleteUser = async() => {

    }

    searchById = async() => {

    }

    list = async() => {

    }

    validateEmailUser = async() => {

    }

}
