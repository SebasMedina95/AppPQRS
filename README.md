
# Aplicación basada en Node y TS:

Descripción de la aplicación: *** Aplicación de PQRS ***.\
``Desarrollador: Juan Sebastian Medina Toro``

Esta aplicación viene con las preconfiguraciones necesarias para el modelo de trabajo requerido. La aplicación se encuentra desarrollada en NodeJS usando TypeScript y como base de datos estamos usando PostgreSQL con una imagen de Docker para el manejo de contenedores. Para el manejo de las sentencias SQL en el sistema, usaremos el ORM de Prisma y su estructura de configuración de modelos para las tablas de la BD.

Para comenzar a trabajar, por favor siga los siguientes pasos para las instalaciones necesarias así como configuraciones:

## Inicialización e Instalación:
1. Clonar proyecto.
2. Clonar el archivo .env.template a .env y configurar las variables de entorno
   1. ``Nota 1:``Algunas variables de entorno se dejarán dispuestas para las pruebas.
   2. ``Nota 2:``Las variables de entorno que no se dispondrán será por temas de seguridad (Especialmente las del correo)
   3. ``Nota 3:``Si requiere las variables de entorno, debe ponerse en contacto con del desarrollador del sistema.
   4. ``Nota 4:``Revisar las definiciones estáticas de nombramiento
3. Clonar **.env.template a .env** y configurar las variables de entorno
4. Ejecutar para instalar las dependencias de Node:
   ```
   npm install
   ```
5. En caso de necesitar base de datos, configurar el docker-compose.yml y ejecutar para levantar los servicios deseados:
   **NOTA:** Se recomienda ejecutar como Administrador.
   ```
   docker-compose up -d
   ```
6. Ejecutamos las migraciones (Asegurese que las migraciones estén generadas):
   **NOTA:** Se recomienda ejecutar como Administrador.
   ```
   npx prisma generate
   ``` 
7. Ejecutar para levantar el proyecto en modo desarrollo:
   ```
   npm run dev
   ```
8. Puede ver la URL principal ejecutando: ``http://localhost:4695/``
9. Para llenar la base de datos con información inicial, ejecute el comando:
   ```
   npm run seed 
   ```

## Consideraciones de trabajo:
- Creación y ejecución de migraciones para la base de datos:
  - Para crear una migración debemos usar:
    **NOTA 1:** Se recomienda ejecutar como Administrador.
    **NOTA 2:** Cambie el DEFINA-NOMBRE-MIGRACION por el nombre que desea dar a la migración.
    ```
    npx prisma migrate dev --name DEFINA-NOMBRE-MIGRACION
    ```
  - Para ejecutar una migración usamos:
    **NOTA:** Se recomienda ejecutar como Administrador.
    ```
    npx prisma generate
    ```
  - Visualización de documentación Swagger:
    ```
    //Comando// :::Pendiente:::
    ```

## Definición básica de lógica de negocio:
- ``Autenticación y Autorización``:
  - Se genera un sistema de login de usuario en paralelo a la administración misma de usuarios en el sistema si se trata de tu propio usuario, o bien, si es el administrador quien realiza esta gestión, por ende, se tiene una gestión completa para este tema en específico (dejando por fuera la gestión de roles porque está es independiente). Al crear un usuario, se envía un correo de validación para el tema, por lo que el correo además de existir, las variables de entorno deben tener la variable de envío activa para el tema, lo mismo para el tema de recuperación de la contraseña, esto permitirá manejar un sistema de envío de emails para la gestión de la aplicación.
- ``Sistema de PQRS``:
  - El manejo de PQRS comprenderá un sistema bastante simple pero cuya funcionalidad es contener la administración de las mismas por cada usuario, pero considerando en todo momento que habrá un "empleado" que gestionará la PQRS y le hará un seguimiento respecto al tema. El usuario logeado al sistema podrá consultar sus PQRS dado el usuario logeado y correctamente verificado. El objetivo será que depende de la PQRS un administrador podría comprender otro segmento sistémico si se requiere una administración de fondos presupuestales, pero esto implicará un módulo a posterirí, pero en el momento tendremos esta estructura
  