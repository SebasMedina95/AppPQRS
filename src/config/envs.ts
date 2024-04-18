import 'dotenv/config';
import { get } from 'env-var';


export const envs = {

  PORT: get('PORT').required().asPortNumber(),
  DB_USER: get('DB_USER').required().asString(),
  DB_NAME: get('DB_NAME').required().asString(),
  DB_PASSWORD: get('DB_PASSWORD').required().asString(),
  BD_PORT: get('BD_PORT').required().asInt(),

  MAILER_SERVICE: get('MAILER_SERVICE').required().asString(),
  MAILER_EMAIL: get('MAILER_EMAIL').required().asString(),
  MAILER_SECRET_KEY: get('MAILER_SECRET_KEY').required().asString(),

  WEB_SERVICE_URL: get('WEB_SERVICE_URL').required().asString(),
  SEND_EMAIL: get('SEND_EMAIL').default('false').asBool(),

}