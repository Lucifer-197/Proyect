// Paquete donde se encuentra esta clase dentro de la estructura del proyecto
package com.example.springboot_login.config;

// Importación de clases necesarias para filtros de servlet y manejo HTTP
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import java.io.IOException;

// Anotación que indica que esta clase es un componente gestionado por Spring
@Component
public class NoCacheFilter implements Filter { // Se implementa la interfaz Filter para definir un filtro personalizado

    // Método que intercepta todas las peticiones entrantes para modificar la respuesta
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        // Convertimos la respuesta genérica en una HttpServletResponse para poder modificar cabeceras HTTP
        HttpServletResponse res = (HttpServletResponse) response;

        // Establece cabeceras para desactivar el caché en los navegadores modernos (HTTP 1.1)
        res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");

        // Para compatibilidad con navegadores antiguos que usan HTTP 1.0
        res.setHeader("Pragma", "no-cache");

        // Establece la fecha de expiración como 0, lo que significa que el contenido ya está expirado
        res.setDateHeader("Expires", 0);

        // Continúa con el siguiente filtro en la cadena o con el recurso solicitado
        chain.doFilter(request, response);
    }
}
