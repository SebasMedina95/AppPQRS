import { regularExps } from "../../validations/regular-exp";

export class ChangePasswordUserDto {

    private constructor(
        public readonly id: number,
        public readonly currentPassword: string,
        public readonly newPassword: string,
        public readonly confirmNewPassword: string,
    ){}

    static changePasswordUser( object: { [key:string]: any } ): [string?, ChangePasswordUserDto?] {

        const { id, 
                currentPassword, 
                newPassword, 
                confirmNewPassword } = object;

        //Id de actualización
        if( !id ) return ['Identificación de Usuario es Requerida', undefined];

        //Contraseña Actual
        if( !currentPassword ) return [`Password es requerido`];
        if( !regularExps.password.test(currentPassword) ) return [`Password debe tener al menos 6 caracteres, contener una mayúscula, una minúscula y un caracter esopecial [!@#$%^&*._]`];

        //Contraseña Nueva
        if( !newPassword ) return [`Nuevo Password es requerido`];
        if( !regularExps.password.test(newPassword) ) return [`Nuevo Password debe tener al menos 6 caracteres, contener una mayúscula, una minúscula y un caracter esopecial [!@#$%^&*._]`];

        //Confirmación de Contraseña Nueva
        if( !confirmNewPassword ) return [`Confirmación Nuevo Password es requerido`];
        if( !regularExps.password.test(confirmNewPassword) ) return [`Confirmación Nuevo Password debe tener al menos 6 caracteres, contener una mayúscula, una minúscula y un caracter esopecial [!@#$%^&*._]`];

        return [undefined, new ChangePasswordUserDto(id, 
                                                     currentPassword, 
                                                     newPassword, 
                                                     confirmNewPassword)]

    }

}