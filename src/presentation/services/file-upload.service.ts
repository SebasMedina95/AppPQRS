import { UploadedFile } from "express-fileupload";
import path from 'path';
import fs from 'fs';
import { UuidAdapter } from "../../config/uuid.adapter";
import { CustomError } from "../../domain/errors/custom.error";
import { CloudinaryAdapter } from "../../config/cloudinary.adapter";
import { IUser } from "../../interfaces/users.interface";
import { prisma } from "../../db/postgres";
import { UserEntity } from "../../domain/entities/user.entity";

// const cloudinary = require('cloudinary').v2
// cloudinary.config( process.env.CLOUDINARY_URL ); //Configuramos con mi cuenta de Cloudinary

export class FileUploadsService {

    constructor(){}

    private checkFolderServer( folderPath: string ): boolean {
        
        if( !fs.existsSync(folderPath) ){
            fs.mkdirSync( folderPath );
        }

        return true;
        
    }

    updateImageUser = async( 
        file: UploadedFile,
        user: IUser,
        folder: string = 'uploads', 
        validExt: string[] = ['png', 'jpg', 'jpeg']
    ): Promise<IUser | string | CustomError> => {

        try {

            const fileExtension = file.mimetype.split('/').at(1) ?? '';

            //Validación extensión
            if( !validExt.includes( fileExtension ) ) return "error1";

            const destination = path.resolve( __dirname, "../../../", folder );
            this.checkFolderServer( destination ); //Comprobamos el folder

            //Uuid
            const uuid = new UuidAdapter();
            const fileName: string = `${ uuid.uuidGenerate() }.${ fileExtension }`;
            console.log(fileName);

            //Cloudinary
            const cloudinaryAdp = new CloudinaryAdapter();
            const cloudinary = cloudinaryAdp.urlCloudinaryExc();

            //Extracción del usuario
            //Eliminación de imagen para actualizar
            const { img } = user;
            if( img || img != null ){

                const arrayName = img.split('/'); //La url completa separa por /
                const getName = arrayName[arrayName.length - 1]; //Al final tenemos la imagen con su extension
                const [ name , ext ] = getName.split('.'); //Separo la extensión de la imagen y lo que me queda es el nombre de la 
                                                           //imagen, el cual, viene siendo en últimas el mismo id que asigna cloudinary

                //Borramos con una función propia de cloudinary
                await cloudinary.uploader.destroy(name);

            }

            const { tempFilePath } = file;
            const res = await cloudinary.uploader.upload( tempFilePath );
            const urlForSave: string = res.secure_url;

            console.log("voy por este lado")

            //Actualizamos el usuario logeado
            const updateImgUser = await prisma.uSER_USERS.update({
                where: { id: user.id },
                data: {
                    img : urlForSave
                }
            });

            const { password, ...userEntity } = UserEntity.fromObject(updateImgUser);

            // file.mv( `${ destination }/${ fileName }` );
            return userEntity;
            
        } catch (error) {

            throw CustomError.internalServerError("Error Interno del Servidor");
            
        }

    }

    uploadFilePQRS = async(
        file: any, 
        folder: string, 
        validExt: string[] = ['pdf', 'xlsx', 'docx']
    ) => {

    }

    uploadMultipleFilePQRS = async(
        file: any[], 
        folder: string, 
        validExt: string[] = ['pdf', 'xlsx', 'docx']
    ) => {

    }

}
