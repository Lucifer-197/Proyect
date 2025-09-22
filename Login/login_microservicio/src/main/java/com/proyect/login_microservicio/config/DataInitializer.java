package com.proyect.login_microservicio.config;



import com.proyect.login_microservicio.model.RolesModel;
import com.proyect.login_microservicio.model.UsuariosModel;
import com.proyect.login_microservicio.repository.RolesRepository;
import com.proyect.login_microservicio.repository.UsuariosRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

// Clase de configuración que inicializa datos al arrancar la aplicación.

@Configuration
public class DataInitializer {

    // Inyectamos desde application.properties la clave del superadmin:
    // superadmin.password=miclavesupersegura
    @Value("${superadmin.password}")
    private String superAdminPassword;

    // Bean que se ejecuta automáticamente al arrancar Spring Boot.
    // Se encarga de crear el rol SUPER_ADMIN y el usuario superadmin si no existen.

    @Bean
    CommandLineRunner initData(
            RolesRepository RepositoryRol, // Repositorio para roles
            UsuariosRepository RepositoryUsuario, // Repositorio para usuarios
            PasswordEncoder passwordEncoder) { // Codificador de contraseñas
        return args -> {
            // Buscar si ya existe el rol SuperAdmin en la base de datos
            RolesModel superAdminRol = RepositoryRol.findByNombreRol("SUPER_ADMIN").orElse(null);

            // Si no existe, lo creamos
            if (superAdminRol == null) {
                superAdminRol = new RolesModel();
                superAdminRol.setNombreRol("SUPER_ADMIN");
                superAdminRol.setDescripcion("Super administrador del sistema");

                RepositoryRol.save(superAdminRol); // Guardamos en la base de datos
                System.out.println("Rol SUPER_ADMIN creado correctamente.");
            } else {
                System.out.println("ℹ Rol SUPER_ADMIN ya existe.");
            }

            // Buscar si existe un usuario con nombre de usuario "superadmin"
            if (RepositoryUsuario.findByNombreUsuario("superadmin").isEmpty()) {
                // Si no existe, primero verificamos que la clave del superadmin esté definida
                if (superAdminPassword == null || superAdminPassword.isEmpty()) {
                    throw new IllegalStateException("Variable de entorno SUPERADMIN_PASSWORD no definida.");
                }

                // Creamos el usuario superadmin
                UsuariosModel superAdmin = new UsuariosModel();
                superAdmin.setNombreUsuario("superadmin");
                // Codificamos la clave para guardarla segura en la base de datos
                superAdmin.setClave(passwordEncoder.encode(superAdminPassword));
                // Asignamos el rol previamente creado
                superAdmin.setRolesModel(superAdminRol);

                // Guardamos el nuevo usuario en la base de datos
                RepositoryUsuario.save(superAdmin);
                System.out.println("Usuario superadmin creado correctamente.");
            } else {
                System.out.println("ℹ Usuario superadmin ya existe.");
            }
        };
    }
}
