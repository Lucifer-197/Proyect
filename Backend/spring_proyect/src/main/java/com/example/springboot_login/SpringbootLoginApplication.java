package com.example.springboot_login;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.boot.autoconfigure.domain.EntityScan;

@SpringBootApplication
@EnableJpaRepositories(basePackages = "com.example.springboot_login.repository")
@EntityScan(basePackages = "com.example.springboot_login.model") // Asegura que las entidades en el paquete se escaneen
public class SpringbootLoginApplication {
    public static void main(String[] args) {
        SpringApplication.run(SpringbootLoginApplication.class, args);
    }
}
