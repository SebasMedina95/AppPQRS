
export class UserEntity {

    constructor(
        public readonly id: number,
        public readonly typeDocument: string,
        public readonly document: string,
        public readonly fullName: string,
        public readonly email: string,
        public readonly emailValidated: boolean,
        public readonly password: string,
        public readonly img?: string,
        public readonly address?: string,
        public readonly phone?: string,
        public readonly cellPhone?: string,
        public readonly description?: string,
        public readonly createDateAt?: Date,
    ){}

    static fromObject( object: { [key : string]: any } ){

        const {
            id,
            typeDocument,
            document,
            fullName,
            email,
            emailValidated,
            password, //No mostrar el password
            img,
            address,
            phone,
            cellPhone,
            description,
            createDateAt,
        } = object;

        return new UserEntity( 
            id,
            typeDocument,
            document,
            fullName,
            email,
            emailValidated,
            password, //No mostrar el password
            img,
            address,
            phone,
            cellPhone,
            description,
            createDateAt,
         )

    }

}