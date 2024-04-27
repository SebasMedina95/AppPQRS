import { BcryptAdapter } from "../../config/bcryptjs.adapter";
import { JwtAdapter } from "../../config/jwt.adapter";
import { MomentAdapter } from "../../config/moment-timezone.adapter";

import { prisma } from "../../db/postgres";

import { PaginationDto } from "../../domain/common/pagination.dto";
import { RegisterUserDto } from "../../domain/dtos/users/register-user.dto"
import { SearchUserDto } from "../../domain/dtos/users/search-user.dto";
import { UserEntity } from "../../domain/entities/user.entity";
import { CustomError } from "../../domain/errors/custom.error"
import { ExecuteMetadataPagination } from "../../domain/utils/pagination.response";
import { UpdateUserDto } from '../../domain/dtos/users/update-user.dto';

import { IUser, IUserPaginated } from "../../interfaces/users.interface"
import { EmailService } from "./email.service";

export class UserService {

    constructor(
        private readonly emailService: EmailService,
    ){}

    //* ************************************************************ *//
    //* **************** REGISTRAR UN NUEVO USUARIO **************** *//
    //* ************************************************************ *//
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
            const myMoment = new MomentAdapter();

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
                    createDateAt: myMoment.getDateColombian(),
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
                roles: userEntity.roles,
                img: userEntity.img,
                address: userEntity.address,
                phone: userEntity.phone,
                cellPhone: userEntity.cellPhone,
                description: userEntity.description,
                createDateAt: userEntity.createDateAt,
                token,
            }

        } catch( error ){

            throw CustomError.internalServerError(`${error}`);

        } finally {

            await prisma.$disconnect();

        }

    }

    //* *************************************************************** *//
    //* **************** ACTUALIZAR USUARIO REGISTRADO **************** *//
    //* *************************************************************** *//
    updateUser = async( updateUserDto: UpdateUserDto, user: IUser ): Promise<IUser | CustomError | null> => {

        const idValid: number = updateUserDto.id;
        const documentValid: string = updateUserDto.document;

        //Filtro de roles
        if( !user ){
            return CustomError.unAuthorizedError("No se ha identificado una sesión válida");
        }

        const existUser = await prisma.uSER_USERS.findFirst({
            where: { document: documentValid }
        });

        if( existUser != null ) {
            if( existUser.id != idValid ){
                return CustomError.badRequestError("Ya existe el email o el documento");
            }
        }

        const existUserId = await prisma.uSER_USERS.findFirst({
            where: { id: Number(idValid) }
        });

        if( existUserId == null ) return null;

        //Filtro para que solo pueda editar su propia información o el admin
        if( user.roles.includes("USER")){
            if( existUserId.id != user.id && !user.roles.includes("ADMIN") ){
                return CustomError.badRequestError("No puede editar la información de un usuario diferente");
            }
        }else{
            if( !user.roles.includes("ADMIN") ){
                return CustomError.badRequestError("No tiene permisos para realizar esta acción");
            }
        }

        try {

            const updateUser = await prisma.uSER_USERS.update({
                where: { id: Number(updateUserDto.id) },
                data: {
                    typeDocument: updateUserDto.typeDocument,
                    document: updateUserDto.document,
                    fullName: updateUserDto.fullName,
                    address: updateUserDto.address,
                    phone: updateUserDto.phone,
                    cellPhone: updateUserDto.cellPhone,
                    description: updateUserDto.description,
                }
            });

            const { password, ...userEntity } = UserEntity.fromObject(updateUser);

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
                description: userEntity.description,
            }
            
        } catch( error ){

            throw CustomError.internalServerError(`${error}`);

        } finally {

            await prisma.$disconnect();

        }

    }

    //* ************************************************************* *//
    //* **************** ELIMINADO LÓGICO DE USUARIO **************** *//
    //* ************************************************************* *//
    deleteUser = async( searchDto: SearchUserDto, user: IUser ): Promise<IUser | CustomError | string> => {

        const { id } = searchDto;

        if( !user.roles.includes("ADMIN") ){
            return "error1";
        }

        try {

            const getUserId = await prisma.uSER_USERS.findFirst({
                where: { id }
            });


            if( !getUserId || getUserId == null ) 
                return "error2";

            const deleteLogicUser = await prisma.uSER_USERS.update({
                where: { id },
                data: {
                    status: false
                }
            });

            const { password, ...userEntity } = UserEntity.fromObject(getUserId);
            return userEntity;
            
        } catch (error) {

            throw CustomError.internalServerError("Error Interno del Servidor");

        } finally {

            await prisma.$disconnect();
            
        } 

    }

    //* ******************************************************* *//
    //* **************** BUSCAR USUARIO POR ID **************** *//
    //* ******************************************************* *//
    searchById = async( searchDto: SearchUserDto, user: IUser ): Promise<IUser | CustomError | string> => {

        const { id } = searchDto;

        //Filtro de roles
        if( !user ){
            return CustomError.unAuthorizedError("No se ha identificado una sesión válida");
        }

        try {

            const existUserId = await prisma.uSER_USERS.findFirst({
                where: {
                    AND: [
                        { id: Number(searchDto.id) },
                        { status: true }
                    ]
                }
            });
    
            if( existUserId == null ) return "error1";
    
            //Filtro para que solo pueda editar su propia información o el admin
            if( user.roles.includes("USER")){
                if( existUserId.id != user.id && !user.roles.includes("ADMIN") ){
                    return "error2";
                }
            }else{
                if( !user.roles.includes("ADMIN") ){
                    return CustomError.badRequestError("No tiene permisos para realizar esta acción");
                }
            }

            const { password, ...userEntity } = UserEntity.fromObject(existUserId);
            return userEntity;
            
        } catch (error) {

            throw CustomError.internalServerError("Error Interno del Servidor");

        } finally {

            await prisma.$disconnect();
            
        } 

    }

    //* ************************************************************************* *//
    //* **************** LISTAR USUARIOS CON FILTRO Y PAGINACIÓN **************** *//
    //* ************************************************************************* *//
    list = async( paginationDto: PaginationDto, user: IUser ): Promise<IUserPaginated | CustomError | null> => {

        const { page, limit, search } = paginationDto;
        let getUsers: IUser[] = [];
        let getUsersCore: IUser[] = [];
        let countData: number;

        if( !user.roles.includes("ADMIN") ){
            return null;
        }

        try {

            if( search && search !== "" && search !== null && search !== undefined  ){

                const searchFilter: string = search.trim();

                getUsers = await prisma.uSER_USERS.findMany({
                    take: limit,
                    skip: Number(page - 1) * limit,
                    where: {
                        OR: [
                            { fullName: { contains: searchFilter, mode: 'insensitive' } },
                            { document: { contains: searchFilter, mode: 'insensitive' } },
                            { email: { contains: searchFilter, mode: 'insensitive' } },
                            { address: { contains: searchFilter, mode: 'insensitive' } },
                            { phone: { contains: searchFilter, mode: 'insensitive' } },
                            { cellPhone: { contains: searchFilter, mode: 'insensitive' } },
                            { description: { contains: searchFilter, mode: 'insensitive' } },
                        ],
                        AND: [
                            { status: true }
                        ]
                    },
                    select: {
                        id: true,
                        typeDocument: true,
                        document: true,
                        fullName: true,
                        email: true,
                        emailValidated: true,
                        roles: true,
                        status: true,
                        img: true,
                        address: true,
                        phone: true,
                        cellPhone: true,
                        description: true,
                    }
                });

                getUsersCore = getUsers as IUser[]
                countData = await prisma.uSER_USERS.count({
                    where: {
                        OR: [
                            { fullName: { contains: searchFilter, mode: 'insensitive' } },
                            { document: { contains: searchFilter, mode: 'insensitive' } },
                            { email: { contains: searchFilter, mode: 'insensitive' } },
                            { address: { contains: searchFilter, mode: 'insensitive' } },
                            { phone: { contains: searchFilter, mode: 'insensitive' } },
                            { cellPhone: { contains: searchFilter, mode: 'insensitive' } },
                            { description: { contains: searchFilter, mode: 'insensitive' } },
                        ],
                        AND: [
                            { status: true }
                        ]
                    }
                });

            }else{

                getUsers = await prisma.uSER_USERS.findMany({
                    take: limit,
                    skip: Number(page - 1) * limit,
                    where: { status: true },
                    select: {
                        id: true,
                        typeDocument: true,
                        document: true,
                        fullName: true,
                        email: true,
                        emailValidated: true,
                        roles: true,
                        status: true,
                        img: true,
                        address: true,
                        phone: true,
                        cellPhone: true,
                        description: true,
                    }
                });

                getUsersCore = getUsers as IUser[]
                countData = await prisma.uSER_USERS.count();

            }

            const metadata = ExecuteMetadataPagination( countData, page, limit );

            return {
                users: getUsersCore,
                metadata
            }
            
        } catch (error) {

            throw CustomError.internalServerError("Error Interno del Servidor");

        } finally {

            await prisma.$disconnect();
            
        } 

    }

    //* **************************************************************** *//
    //* **************** VALIDACIÓN DE EMAIL REGISTRADO **************** *//
    //* **************************************************************** *//
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
