import { BcryptAdapter } from "../../config/bcryptjs.adapter";
import { JwtAdapter } from "../../config/jwt.adapter";
import { MomentAdapter } from "../../config/moment-timezone.adapter";
import { prisma } from "../../db/postgres";
import { PaginationDto } from "../../domain/common/pagination.dto";
import { RegisterUserDto } from "../../domain/dtos/users/register-user.dto"
import { UserEntity } from "../../domain/entities/user.entity";
import { CustomError } from "../../domain/errors/custom.error"
import { ExecuteMetadataPagination } from "../../domain/utils/pagination.response";
import { IUser, IUserPaginated } from "../../interfaces/users.interface"
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

    updateUser = async() => {

    }

    deleteUser = async() => {

    }

    searchById = async() => {

    }

    list = async( paginationDto: PaginationDto ): Promise<IUserPaginated | CustomError> => {

        const { page, limit, search } = paginationDto;
        let getUsers: IUser[] = [];
        let getUsersCore: IUser[] = [];
        let countData: number;

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
                        ]
                    },
                    select: {
                        id: true,
                        typeDocument: true,
                        document: true,
                        fullName: true,
                        email: true,
                        emailValidated: true,
                        role: true,
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
                        ]
                    }
                });

            }else{

                getUsers = await prisma.uSER_USERS.findMany({
                    take: limit,
                    skip: Number(page - 1) * limit,
                    select: {
                        id: true,
                        typeDocument: true,
                        document: true,
                        fullName: true,
                        email: true,
                        emailValidated: true,
                        role: true,
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
