# Explicación del proyecto Spring Boot

Este documento proporciona una eplicación de la arquitectura y componentes del proyecto, que const de un backend con Spring Boot y en el front con Angular.

- angular_login: Contiene codigo fuente de la aplicación desarrollada con Angular.

- springboot_login: Contiene codigo fuente de la aplicación backend desarrollada con sprinboot.

# Estructura General

Proyecto de practica login con spring-boot(backend) y angular(frontend),
donde verifica desde el backend el usuario y la contraseña del usuario dodne aprece un menaje de exito si el usuario se loguea correctamente.

# Tecnologias Usadas

- Java 17.0.15
- Spring Boot 3.5.3
- PostgreSQL 17.5
- Maven 3.9.10
- Hibernate 6.6.18

# Datos iniciales 

Cuando se inicia el proyecto se insertan los datos iniciales desde src/main/resources/data.sql

# Backend - Spring Boot

Se encarga de la lógica de negocio, la gestión de los usuarios, la autenticación y la comunicación con la base de datos. Utiliza Maven como herramienta de contrucción.

# Dependencias clave (pom.xml)

- spring-boot-starter-data-jpa: Para la persistencia de datos y la interacción con la base de datos utilizando JPA (Java Persistence API).

- spring-boot-starter-web: Para construir aplicaciones web y RESTful APIs.
spring-boot-starter-security: Para la seguridad de la aplicación, incluyendo autenticación y autorización.

- postgresql: Driver para la base de datos PostgreSQL.

- jjwt-api, jjwt-impl, jjwt-jackson: Librerías para la implementación de JSON Web Tokens (JWT), utilizados para la autenticación sin estado.

- spring-boot-devtools: Herramientas de desarrollo para mejorar la productividad (recarga en caliente, etc.).

- spring-boot-starter-test: Dependencias para pruebas unitarias y de integración.

# Componentes Principales

La estructura del paquete com.example.springboot_login sigue un patrón MVC (Model-View-Controller) o una arquitectura por capas:

- Controller/ :Contienen los controladores REST que exponen los endpoints de la API.

    - ControllerLogin.java: Maneja las solicitudes de inicio de sesión (/login). Recibe un LoginRequest y, si las credenciales son válidas, devuelve un LoginResponse que contiene un JWT.

- service/ : Cotiene la lógica de negocio.

    - ServiceUsuario.java: Contiene la lógica para validar usuarios, generar JWTs y migrar contraseñas a BCrypt. Utiliza RepositoryUsuario para acceder a los datos de usuario y JwtUtil para la generación de tokens. Implementa CommandLineRunner para ejecutar la migración de contraseñas al inicio de la aplicación.

- repository/ : Contiene las interfaces de repositorio para la interacción con la base de datos.

    - RepositoryUsuario.java: Probablemente una interfaz que extiende JpaRepository para realizar operaciones CRUD sobre la entidad ModelUsuario.

- Model/ : Cotiene las entidades de datos

    - ModelUsuario.java: Representa la entidad de usuario en la base de datos, incluyendo campos como nombre de usuario, contraseña y rol.

- dto/ : Contiene los objetos de transferencia de datos (Data Transfer  Objects)

    - LoginRequest.java: Objeto para encapsular las credenciales de inicio de sesión (nombre de usuario y clave).

    - LoginResponse.java: Objeto para encapsular el token JWT devuelto tras un inicio de sesión exitoso.

- security/ : Contiene clases relacionada con la seguridad y JWT

    - JwtFilter.java: Un filtro de seguridad que intercepta las solicitudes HTTP para validar los JWTs presentes en las cabeceras de autorización.

    - JwtUtil.java: Utilidad para generar, validar y extraer información de los JWTs.

config/ :  Contiene las configuraciones de la aplicación.
SecurityConfig.java: Configuración principal de Spring Security. Define:

    - BCryptPasswordEncoder: Para codificar y verificar contraseñas de forma segura.

    - SecurityFilterChain: Configura las reglas de autorización (por ejemplo, /login es público, /api/admin/** requiere rol ADMIN, /api/user/** requiere rol USER).

    - SessionCreationPolicy.STATELESS: Indica que la aplicación no mantendrá el estado de la sesión, lo cual es típico en arquitecturas basadas en JWT.

    - Añade JwtFilter antes del filtro de autenticación de usuario y contraseña de Spring Security.

    - NoCacheFilter.java: Probablemente un filtro para deshabilitar el caché en las respuestas HTTP.

    - webConfig.java: Posiblemente configuración de CORS o de otros aspectos web.

exception/ : Contiene clases de excepciones personalizadas.

    - UsuarioNoEncontrado.java, ClaveIncorrecta.java: Excepciones personalizadas para errores de autenticación.

    - GlobalExceptionHandler.java: Un controlador de excepciones global que maneja las excepciones lanzadas por la aplicación y las convierte en respuestas HTTP adecuadas (por ejemplo, JSON de error).


# Fronted - Angular

 Se encarga de la interfaz de usuario, la interacción con el usuario y la comunicación con el backend a través de las APIs REST.

# Estructura

- src/: Contiene el código fuente de la aplicación.

- app/: Contiene los componentes principales de la aplicación.

- components/: Contiene los componentes visuales de la aplicación.

    - login/login.ts: Componente para la interfaz de inicio de sesión. Maneja la entrada de credenciales y envía la solicitud al backend.

    - home/home.ts: Componente para la página de inicio a la que se accede después de un inicio de sesión exitoso.

- services/: Contiene los servicios que interactúan con el backend.

- models/: Contiene las interfaces o clases para los modelos de datos del frontend (por ejemplo, User, LoginRequest, LoginResponse).


- interceptor.ts: Un interceptor HTTP de Angular que probablemente añade el JWT a las cabeceras de las solicitudes salientes al backend, asegurando que las solicitudes autenticadas incluyan el token.

- app.routes.ts: Define las rutas de la aplicación Angular.


# Flujo Frontend

1.
El usuario introduce sus credenciales en el componente Login.

2.
El componente Login envía estas credenciales a un servicio de autenticación.

3.
El servicio de autenticación realiza una solicitud HTTP POST al endpoint /login del backend.

4.
Si la autenticación es exitosa, el backend devuelve un JWT.

5.
El servicio de autenticación del frontend almacena este JWT (por ejemplo, en localStorage o sessionStorage).

6.
El interceptor HTTP adjunta automáticamente este JWT a las cabeceras de autorización de todas las solicitudes subsiguientes al backend.

7.
Si el usuario intenta acceder a una ruta protegida (como /home), AuthGuard verifica la presencia y validez del JWT antes de permitir el acceso.


# Interacción entre el Front y el Back

La comunicación entre el frontend de Angular y el backend de Spring Boot se realiza a través de llamadas a la API REST. El backend expone los endpoints necesarios para la autenticación y la gestión de usuarios, mientras que el frontend consume estos endpoints para proporcionar la interfaz de usuario y la experiencia de usuario.

- Autenticación Basada en JWT: El sistema utiliza JWTs para la autenticación. Una vez que el usuario inicia sesión, el backend emite un token que el frontend almacena y envía en cada solicitud subsiguiente para acceder a recursos protegidos.

- CORS (Cross-Origin Resource Sharing): Dado que el frontend (Angular) y el backend (Spring Boot) probablemente se ejecutan en diferentes puertos o dominios durante el desarrollo y la producción, es crucial que el backend esté configurado para permitir solicitudes CORS desde el origen del frontend. La presencia de webConfig.class en el backend sugiere que esta configuración está siendo manejada.

