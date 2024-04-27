
export class LoginUserDto {

    private constructor(
        public readonly email: string,
        public readonly password: string,
    ){}

    static loginUser( object: { [key:string]: any } ): [string?, LoginUserDto?] {

        const { email, password } = object;

        //Email
        if( !email ) return ['Email requerido', undefined];

        //Password
        if( !password ) return [`Password requerido`];

        return [undefined, new LoginUserDto(email, password)]

    }

}