
import nodemailer, { Transporter } from 'nodemailer';
import { JwtAdapter } from '../../config/jwt.adapter';
import { CustomError } from '../../domain/errors/custom.error';
import { envs } from '../../config/envs';

interface SendMailOptions {
  to: string | string[];
  subject: string;
  htmlBody: string;
  attachements?: Attachement[];
}

interface Attachement {
  filename: string;
  path: string;
}

export class EmailService {

    private transporter: Transporter
  
    constructor(
        mailerService: string,
        mailerEmail: string,
        mailerSecretKey: string,
        private readonly postToProvider: boolean
    ) {
        this.transporter = nodemailer.createTransport( {
            service: mailerService,
            auth: {
            user: mailerEmail,
            pass: mailerSecretKey,
            }
        });
    }

    async sendEmail( options: SendMailOptions ): Promise<boolean> {

        const { to, subject, htmlBody, attachements = [] } = options;

        try {

            if( !this.postToProvider ) return true;

            await this.transporter.sendMail({
                to: to,
                subject: subject,
                html: htmlBody,
                attachments: attachements,
            });

            return true;

        } catch ( error ) {

            return false;

        }

    }

    async sendEmailValidacionLink( email: string ) {

        const jwtAdapter = new JwtAdapter();
        const token = await jwtAdapter.generateToken({ email });
        if( !token ) throw CustomError.internalServerError("Error al obtener el token");

        const link = `${ envs.WEB_SERVICE_URL }/users/validate-email/${ token }`;

        const html = `

            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <title>Verificación de Correo Electrónico</title>
            </head>
            <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
                <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border-collapse: collapse;">
                    <tr>
                        <td align="center" bgcolor="#ffffff" style="padding: 40px 0;">
                            <img src="https://png.pngtree.com/png-vector/20190927/ourmid/pngtree-email-icon-png-image_1757854.jpg" alt="Email Icon" width="80" style="display: block;"/>
                        </td>
                    </tr>
                    <tr>
                        <td bgcolor="#ffffff" style="padding: 20px;">
                            <h1 style="color: #333333; margin-top: 0;">Verificación de Correo Electrónico</h1>
                            <p style="color: #666666;">
                                Para completar el proceso de verificación y poder empezar a enviar y gestionar sus PQRS en el sistema, 
                                por favor haz clic en el botón de abajo.
                            </p>
                            <a href="${ link }" 
                               style="background-color: #007bff; color: #ffffff; padding: 10px 20px; text-decoration: none; 
                               border-radius: 4px; display: inline-block;">
                                Verificar Correo Electrónico
                            </a>
                            <p style="color: #666666; margin-top: 20px;">Si no puedes hacer clic en el botón, copia y pega la siguiente URL en tu navegador:</p>
                            <p style="color: #007bff; margin-top: 10px;"><a href="${ link }" style="color: #007bff; text-decoration: underline;">${ link }</a></p>
                        </td>
                    </tr>
                    <tr>
                        <td bgcolor="#f4f4f4" style="padding: 20px; text-align: center;">
                            <p style="color: #666666; margin: 0;">
                                Este correo electrónico fue enviado desde la aplicación de PQRS.
                                Confirmación del correo electrónico: ${ email }
                                <b>Si se trata de un error por favor ignore este correo</b>
                            </p>

                        </td>
                    </tr>
                </table>
            </body>
            </html>

        `;

        const options = {
            to: email,
            subject: "Validación de Email",
            htmlBody: html
        }

        const isSent = await this.sendEmail( options );
        if( !isSent ) throw CustomError.internalServerError("No pudo ser enviado el email de verificación");

        return true;

    }

}