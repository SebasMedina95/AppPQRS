import { BcryptAdapter } from "../../config/bcryptjs.adapter";
import { JwtAdapter } from "../../config/jwt.adapter";
import { prisma } from "../../db/postgres";

import { ChangePasswordUserDto } from "../../domain/dtos/auth/change-pass-dto";
import { ChangeRolesUserDto } from "../../domain/dtos/auth/change-roles.dto";
import { LoginUserDto } from "../../domain/dtos/auth/login-user-dto";
import { RecoverPasswordUserDto } from "../../domain/dtos/auth/recover-pass.dto";
import { UserEntity } from "../../domain/entities/user.entity";
import { CustomError } from "../../domain/errors/custom.error";

import { IUser } from "../../interfaces/users.interface";

import { EmailService } from "./email.service";

export class AuthService {

    constructor(
        private readonly emailService: EmailService,
    ){}

    //* ************************************************************* *//
    //* **************** LOGIN DE USUARIO AL SISTEMA **************** *//
    //* ************************************************************* *//
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

    //* ****************************************************** *//
    //* **************** CAMBIO DE CONTRASEÑA **************** *//
    //* ****************************************************** *//
    changePassword = async( changePasswordUserDto: ChangePasswordUserDto, user: IUser ): Promise<IUser | CustomError> => {

        const { id,
                currentPassword,
                newPassword,
                confirmNewPassword } = changePasswordUserDto;

        const existUserId = await prisma.uSER_USERS.findFirst({
            where: { id }
        });

        if( existUserId == null ) return CustomError.badRequestError("El usuario a actualizar no pudo ser hallado");

        //Filtro para que solo pueda editar su propia contraseña o el admin
        if( user.roles.includes("USER")){
            if( existUserId.id != user.id && !user.roles.includes("ADMIN") ){
                return CustomError.badRequestError("No puede actualizar la contraseña de un usuario diferente");
            }
        }else{
            if( !user.roles.includes("ADMIN") ){
                return CustomError.unAuthorizedError("No tiene permisos para realizar esta acción");
            }
        }

        //La contraseña anterior debe coincidir
        const bcryptAdapter = new BcryptAdapter;
        const passwordValid: boolean =  bcryptAdapter.compare(currentPassword, existUserId.password);
        if( !passwordValid ) return CustomError.badRequestError("No coincide la contraseña original para el cambio");

        //Nuevo password y confirmación deben coincidir
        if( newPassword != confirmNewPassword ) return CustomError.badRequestError("La nueva contraseña no coincide con la confirmación de la nueva contraseña");

        try {

            const bcrypt = new BcryptAdapter();

            const updatePassword = await prisma.uSER_USERS.update({
                where: { id },
                data: {
                    password: bcrypt.hash(confirmNewPassword),
                }
            });

            const { password, ...userEntity } = UserEntity.fromObject(updatePassword);

            return {
                id: userEntity.id,
                typeDocument: userEntity.typeDocument,
                document: userEntity.document,
                fullName: userEntity.fullName,
                email: userEntity.email,
                emailValidated: userEntity.emailValidated,
                roles: userEntity.roles,
                img: userEntity.img,
                address: userEntity.address,
                phone: userEntity.phone,
                cellPhone: userEntity.cellPhone,
                description: userEntity.description
            }
            
        } catch( error ){

            throw CustomError.internalServerError(`${error}`);

        } finally {

            await prisma.$disconnect();

        }
        
    }

    //* *********************************************************** *//
    //* **************** CAMBIO DE ROLES DE ACCESO **************** *//
    //* *********************************************************** *//
    changeRoles = async( changeRolesUserDto: ChangeRolesUserDto, user: IUser ): Promise<IUser | CustomError> => {

        const { id, roles } = changeRolesUserDto;

        const existUserId = await prisma.uSER_USERS.findFirst({
            where: { id }
        });

        if( existUserId == null ) return CustomError.badRequestError("El usuario a actualizar no pudo ser hallado");

        //Solo el administrador puede hacer este ajuste
        if( !user.roles.includes("ADMIN") ){
            return CustomError.unAuthorizedError("No tiene permisos para realizar esta acción");
        }

        try {

            const updateRoles = await prisma.uSER_USERS.update({
                where: { id },
                data: { roles }
            });

            const { password, ...userEntity } = UserEntity.fromObject(updateRoles);

            return {
                id: userEntity.id,
                typeDocument: userEntity.typeDocument,
                document: userEntity.document,
                fullName: userEntity.fullName,
                email: userEntity.email,
                emailValidated: userEntity.emailValidated,
                roles: userEntity.roles,
                img: userEntity.img,
                address: userEntity.address,
                phone: userEntity.phone,
                cellPhone: userEntity.cellPhone,
                description: userEntity.description
            }
            
        } catch( error ){

            throw CustomError.internalServerError(`${error}`);

        } finally {

            await prisma.$disconnect();

        }

    }

    //* ************************************************************ *//
    //* **************** RECUPERACIÓN DE CONTRASEÑA **************** *//
    //* ************************************************************ *//
    recoverPassword = async( recoverPasswordUserDto: RecoverPasswordUserDto ): Promise<boolean | CustomError> => {

        const { email } = recoverPasswordUserDto;

        try {

            const existEmail = await prisma.uSER_USERS.findMany({
                where: { email }
            });

            if( !existEmail || 
                existEmail == null || 
                existEmail == undefined || 
                existEmail.length == 0 ) return false;

            //Vamos a generar una contraseña aleatoria y la encriptamos.
            const originalString: string = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            const largeString: number = 15;
            const generateAuxPassword: string = this.generateRandomString(originalString, largeString);

            //Actualizamos la contraseña para el re ingreso
            const bcrypt = new BcryptAdapter();
            await prisma.uSER_USERS.update({
                where: { email },
                data: {
                    password: bcrypt.hash(generateAuxPassword)
                }
            });

            //Ahora enviamos el email al cliente:
            await this.emailService.sendEmailWithRecover(email, generateAuxPassword);

            return true;
            
        } catch( error ){

            throw CustomError.internalServerError(`${error}`);

        } finally {

            await prisma.$disconnect();

        }


    }

    generateRandomString = (originalString: string, largeString: number): string => {

        let stringRandom: string = "";
        const originalLength: number = originalString.length;

        for (let i = 0; i < largeString; i++){
            const randomIndex = Math.floor(Math.random() * originalLength);
            stringRandom += originalString.charAt(randomIndex);
        }

        return stringRandom;

    }

}
