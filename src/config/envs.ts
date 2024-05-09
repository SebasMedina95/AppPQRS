import 'dotenv/config';
import { get } from 'env-var';


export const envs = {

  PORT: get('PORT').required().asPortNumber(),
  DB_USER: get('DB_USER').required().asString(),
  DB_NAME: get('DB_NAME').required().asString(),
  DB_PASSWORD: get('DB_PASSWORD').required().asString(),
  BD_PORT: get('BD_PORT').required().asInt(),

  JWT_SEED: get('JWT_SEED').required().asString(),

  MAILER_SERVICE: get('MAILER_SERVICE').required().asString(),
  MAILER_EMAIL: get('MAILER_EMAIL').required().asString(),
  MAILER_SECRET_KEY: get('MAILER_SECRET_KEY').required().asString(),
  SEND_EMAIL: get('SEND_EMAIL').required().asBool(),

  WEB_SERVICE_URL: get('WEB_SERVICE_URL').required().asString(),

  CLOUDINARY_URL: get('CLOUDINARY_URL').required().asString(),
  CLOUDINARY_APINAME: get('CLOUDINARY_APINAME').required().asString(),
  CLOUDINARY_APIKEY: get('CLOUDINARY_APIKEY').required().asString(),
  CLOUDINARY_APISECRET: get('CLOUDINARY_APISECRET').required().asString(),

}