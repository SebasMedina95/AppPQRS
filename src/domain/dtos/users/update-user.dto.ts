import { regularExps } from "../../validations/regular-exp";

export class UpdateUserDto {

    private constructor(
        public readonly id: number,
        public readonly typeDocument: string,
        public readonly document: string,
        public readonly fullName: string,
        public readonly email: string,
        public readonly img?: string,
        public readonly address?: string,
        public readonly phone?: string,
        public readonly cellPhone?: string,
        public readonly description?: string,
        public readonly createDateAt?: Date,
    ){}

    static updateUser( object: { [key:string]: any } ): [string?, UpdateUserDto?] {

        const {
            id,
            typeDocument,
            document,
            fullName,
            img,
            address,
            phone,
            cellPhone,
            description,
            createDateAt,
        } = object;

        //Id
        if( !id ) return ['El ID a actualizar es Requerido', undefined];

        //Nombre
        if( !typeDocument ) return ['Tipo de Documento es Requerido', undefined];

        //Documento
        if( !document ) return [`Número de Documento es requerido`];
        if( !regularExps.document.test(document) ) return [`Número de documento no es valido`];

        //Nombre Completo
        if( !fullName ) return [`Nombre Completo es requerido`];
        if( !regularExps.names.test(fullName) ) return [`Nombre Completo no es valido`];

        return [undefined, new UpdateUserDto(
            id,
            typeDocument,
            document,
            fullName,
            img,
            address,
            phone,
            cellPhone,
            description,
            createDateAt,
        )];

    }

}
