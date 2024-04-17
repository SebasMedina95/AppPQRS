import { envs } from '../config/envs';
import { prisma } from '../db/postgres';
import { AppRoutes } from '../presentation/routes';
import { Server } from '../presentation/server';

(async()=> {
  main();
})();

async function main() {

  try {

    await prisma.$connect();
    console.log("Conexión establecida PostgreSQL + Prisma ORM")

    const server = new Server({
      port: envs.PORT,
      routes: AppRoutes.routes,
    });
  
    server.start();
    
  } catch (error) {

    console.error('Error al conectar a la base de datos:', error);
    await prisma.$disconnect();

  }

  
}