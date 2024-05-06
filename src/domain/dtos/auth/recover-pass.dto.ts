
export class RecoverPasswordUserDto {

    private constructor(
        public readonly email: string,
    ){}

    static recoverUser( object: { [key:string]: any } ): [string?, RecoverPasswordUserDto?] {

        const { email, password } = object;

        //Email
        if( !email ) return ['Email requerido', undefined];

        return [undefined, new RecoverPasswordUserDto(email)]

    }

}
