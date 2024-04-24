
export class SearchUserDto {

    private constructor(
        public readonly id: number
    ){}

    static searchUser( id: number ): [string?, SearchUserDto?] {

        //Id
        if( !id ) return ['El Id es requerido para la busqueda', undefined];
        if( isNaN(Number(id)) ) return ['Id de busqueda inválido', undefined];

        return [undefined, new SearchUserDto( id )];

    }

}
