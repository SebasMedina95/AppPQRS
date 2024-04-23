
export class PaginationDto {

    private constructor(
        public readonly page: number,
        public readonly limit: number,
        public readonly search: string,
    ){}

    static pagination( page: number = 1, limit: number = 10, search: string = "" ): [string?, PaginationDto?] {

        if( isNaN(page) || isNaN(limit) )
            return ["Página y/o Límite de página no son números válidos"];

        if( page <= 0 )
            return ["El valor de página no puede ser menor o igual a 0"];
        
        if( limit <= 0 )
            return ["El valor de límite no puede ser menor o igual a 0"];

        return [ undefined, new PaginationDto(page, limit, search) ];

    }

}

