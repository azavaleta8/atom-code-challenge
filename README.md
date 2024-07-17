Abel Zavaleta

Atom Code Challenge - Backend y Frontend

Este proyecto incluye tanto el backend como el frontend para el Atom Code Challenge.

Backend
Arquitectura
El backend sigue una arquitectura de capas (onion), que incluye:

Controladores (por ejemplo, userController.ts, taskController.ts)
Enrutadores (por ejemplo, userRouter.ts, taskRouter.ts)
Servicios (por ejemplo, userService.ts, taskService.ts)

Esta estructura permite una mejor organización del código y facilita las pruebas de componentes individuales.

Características

Gestión de usuarios (crear, leer, eliminar, iniciar sesión)
Gestión de tareas (crear, leer, actualizar, eliminar)
Autenticación JWT
Manejo de errores y códigos de estado HTTP apropiados

Pruebas
Se han implementado pruebas para todos los endpoints para garantizar el correcto funcionamiento.

Documentación
La documentación de la API está disponible a través de Swagger en:

Backend API: https://atom-code-challenge-api.onrender.com/api

Documentacion: https://atom-code-challenge-api.onrender.com/api-docs/

El frontend está desarrollado en Angular y sigue una arquitectura de componentes. Los principales componentes incluyen:

DashboardComponent: Muestra las tareas del usuario y permite su gestión.
LoginComponent: Maneja el inicio de sesión y registro de usuarios.
NavbarComponent: Proporciona navegación en la aplicación.

Características

Inicio de sesión y registro de usuarios
Visualización y gestión de tareas (crear, editar, eliminar)
Interfaz de usuario responsive
Manejo de estados y comunicación con el backend mediante servicios

Local:
Backend: http://localhost:3000/api-docs
Frontend: http://localhost:4200/

Tecnologías Utilizadas:
Backend

Node.js
Express.js
TypeScript
Firebase (para almacenamiento de datos)
Jest (para pruebas)
Swagger (para documentación de la API)

Frontend

Angular
TypeScript
Angular Material

Comenzando
Para ejecutar el proyecto localmente:

Clona los repositorios de backend y frontend
Sigue las instrucciones de configuración en cada repositorio
Ejecutar "docker-compose up" dentro de la raiz del proyecto

Adicionalmente envio un video-demo de la aplicacion:
https://youtu.be/1LvqaWY5Q5s

Estoy atento a cualquier duda que se le genere, gracias!
