
export class CloudinaryAdapter {

    urlCloudinaryExc = () => {

        //TODO: Revisar una mejor manera de hacerlo, con imports no funcionó :'( ...
        const cloudinary = require('cloudinary').v2;
        cloudinary.config( process.env.CLOUDINARY_URL );
        return cloudinary;

    }

}
