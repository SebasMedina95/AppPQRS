
# Aplicación basada en Node y TS:

Descripción de la aplicación: *** Molde de trabajo para aplicaciones APIRESTfull NodeJS ***.\
``Desarrollador: Juan Sebastian Medina Toro``

Esta aplicación viene con las preconfiguraciones necesarias para el modelo de trabajo requerido. La aplicación se encuentra desarrollada en NodeJS usando TypeScript y como base de datos estamos usando ::::::: con una imagen de Docker para el manejo de contenedores. Para el manejo de las sentencias SQL en el sistema, usaremos el ORM de :::::::: y su estructura de configuración de modelos para las tablas de la BD.

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
   ```
   docker-compose up -d
   ```
6. Ejecutar para levantar el proyecto en modo desarrollo:
   ```
   npm run dev
   ```

## Consideraciones de trabajo:
- Creación y ejecución de migraciones para la base de datos:
  - Para crear una migración debemos usar:
    ```
    //Comando//
    ```
  - Para ejecutar una migración usamos:
    ```
    //Comando//
    ```
  - Visualización de documentación Swagger:
    ```
    //Comando//
    ```

## Definición básica de lógica de negocio:
- Implementación
  