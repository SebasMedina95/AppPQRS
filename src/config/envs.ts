import 'dotenv/config';
import { get } from 'env-var';


export const envs = {

  PORT: get('PORT').required().asPortNumber(),
  DB_USER: get('DB_USER').required().asString(),
  DB_NAME: get('DB_NAME').required().asString(),
  DB_PASSWORD: get('DB_PASSWORD').required().asString(),
  BD_PORT: get('BD_PORT').required().asInt(),
}