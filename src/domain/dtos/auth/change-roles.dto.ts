import { ERoles, ERolesArray } from "../../../constants/roles";

export class ChangeRolesUserDto {

    private constructor(
        public readonly id: number,
        public readonly roles: string[]
    ){}

    static changeRolesUser( object: { [key:string]: any } ): [string?, ChangeRolesUserDto?] {

        const { id, 
                roles  } = object;

        const rolesValid: string[] = roles;
        let bandControl: boolean = false;

        //Id de actualización
        if( !id ) return ['Identificación de Usuario es Requerida', undefined];

        //Roles de usuario
        if( !rolesValid ) return [`Los roles son requeridos`];

        //Los roles deben venir como un String[] y con palabras válidas
        if( rolesValid.length == 0 ) return [`Debe tener asignado al menos un rol`];
        for (const i of rolesValid) {
            if( !ERolesArray.includes(i) ) bandControl = true;
        }

        if( bandControl ) return [`Rol inválido se está intentando asignar`];

        return [undefined, new ChangeRolesUserDto(id, 
                                                  roles)]

    }

}
