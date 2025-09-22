package com.example.springboot_login.controller;

import com.example.springboot_login.model.ModelHerramienta;
import com.example.springboot_login.repository.RepositoryHerramienta;
import com.example.springboot_login.service.ServiceHerramienta;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.IIOImage;
import javax.imageio.ImageIO;
import javax.imageio.ImageWriteParam;
import javax.imageio.ImageWriter;
import javax.imageio.stream.ImageOutputStream;

import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController // Clase manejara peticiones HTTP
@RequestMapping("/api/herramientas") //Define las ruta
public class ControllerHerramienta {

    @Autowired
    private RepositoryHerramienta herramientaRepository;

    @Autowired
    private ServiceHerramienta serviceHerramienta;

    private static final String UPLOAD_DIR = System.getProperty("user.dir") + File.separator + "uploads";

    // Listar herramientas
    @GetMapping
    public List<ModelHerramienta> listar() {
        return serviceHerramienta.listar();
    }

    // Crear herramienta con imagen opcional
    @PostMapping
    @Transactional
    public ResponseEntity<?> crearHerramienta(
            @RequestParam("maquina") String maquina,
            @RequestParam("categoria") String categoria,
            @RequestParam(value = "modelo", required = false) String modelo,
            @RequestParam(value = "serie", required = false) String serie,
            @RequestParam(value = "marca", required = false) String marca,
            @RequestParam(value = "color", required = false) String color,
            @RequestParam(value = "ubicacion", required = false) String ubicacion,
            @RequestParam("codigo") String codigo,
            @RequestParam(value = "imagen", required = false) MultipartFile imagen) {

        try {
            String nombreImagen = null;

            // Guardar imagen si viene en la request
            if (imagen != null && !imagen.isEmpty()) {
                File uploadDir = new File(UPLOAD_DIR);
                if (!uploadDir.exists()) uploadDir.mkdirs();

                BufferedImage bufferedImage = ImageIO.read(imagen.getInputStream());
                if (bufferedImage == null) {
                    return ResponseEntity.badRequest().body("Formato de imagen no válido o no soportado.");
                }

                nombreImagen = UUID.randomUUID().toString() + ".webp";
                File destino = new File(uploadDir, nombreImagen);

                Iterator<ImageWriter> writers = ImageIO.getImageWritersByFormatName("webp");
                if (!writers.hasNext()) {
                    return ResponseEntity.internalServerError()
                            .body("No hay soporte para WebP. Verifica dependencias.");
                }

                ImageWriter writer = writers.next();
                try (FileOutputStream fos = new FileOutputStream(destino);
                     ImageOutputStream ios = ImageIO.createImageOutputStream(fos)) {

                    writer.setOutput(ios);
                    ImageWriteParam param = writer.getDefaultWriteParam();
                    if (param.canWriteCompressed()) {
                        param.setCompressionMode(ImageWriteParam.MODE_EXPLICIT);
                        param.setCompressionType("Lossy");
                        param.setCompressionQuality(0.85f);
                    }
                    writer.write(null, new IIOImage(bufferedImage, null, null), param);
                } finally {
                    writer.dispose();
                }
            }

            // Crear objeto y asignar valores
            ModelHerramienta herramienta = new ModelHerramienta();
            herramienta.setMaquina(maquina);
            herramienta.setCategoria(categoria);
            herramienta.setModelo(modelo);
            herramienta.setSerie(serie);
            herramienta.setMarca(marca);
            herramienta.setColor(color);
            herramienta.setUbicacion(ubicacion);
            herramienta.setCodigo(codigo);
            herramienta.setImagen(nombreImagen);

            herramientaRepository.save(herramienta);

            return ResponseEntity.ok().body(Map.of("mensaje", "Herramienta creada correctamente."));
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error al procesar la imagen: " + e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error al guardar la herramienta: " + e.getMessage());
        }
    }

    // Actualizar herramienta
    @PutMapping("/{id}")
    public ResponseEntity<ModelHerramienta> actualizar(
            @PathVariable Long id,
            @RequestBody ModelHerramienta herramienta) {

        ModelHerramienta existente = serviceHerramienta.obtenerPorId(id);
        if (existente == null) {
            return ResponseEntity.notFound().build();
        }

        existente.setMaquina(herramienta.getMaquina());
        existente.setCategoria(herramienta.getCategoria());
        existente.setModelo(herramienta.getModelo());
        existente.setSerie(herramienta.getSerie());
        existente.setMarca(herramienta.getMarca());
        existente.setColor(herramienta.getColor());
        existente.setUbicacion(herramienta.getUbicacion());
        existente.setCodigo(herramienta.getCodigo());
        existente.setImagen(herramienta.getImagen());

        ModelHerramienta actualizada = serviceHerramienta.guardar(existente);
        return ResponseEntity.ok(actualizada);
    }

    // Eliminar herramienta
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        serviceHerramienta.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    // Generar código dinámico seguro con manejo de errores
    @GetMapping("/generar-codigo")
    public ResponseEntity<String> generarCodigo(
            @RequestParam("nombre") String nombre,
            @RequestParam("categoria") String categoria) {

        try {
            System.out.println("Request /generar-codigo recibido:");
            System.out.println("Nombre: '" + nombre + "'");
            System.out.println("Categoria: '" + categoria + "'");

            if (nombre == null || nombre.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Nombre es obligatorio");
            }
            if (categoria == null || categoria.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Categoria es obligatoria");
            }

            long total;
            try {
                total = herramientaRepository.count() + 1;
                System.out.println("Total de herramientas en BD: " + total);
            } catch (Exception e) {
                e.printStackTrace();
                return ResponseEntity.internalServerError().body("Error accediendo a la base de datos: " + e.getMessage());
            }

            String prefijoNombre = nombre.length() >= 3 ? nombre.substring(0, 3).toUpperCase() : nombre.toUpperCase();
            String prefijoCategoria = categoria.length() >= 3 ? categoria.substring(0, 3).toUpperCase() : categoria.toUpperCase();

            String consecutivo = String.format("%03d", total);
            String codigo = prefijoNombre + "-" + prefijoCategoria + "-" + consecutivo;

            System.out.println("Codigo generado: " + codigo);
            return ResponseEntity.ok(codigo);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error generando código: " + e.getMessage());
        }
    }

    // Ver imagen
    @GetMapping("/uploads/{filename:.+}")
    public ResponseEntity<?> verImagen(@PathVariable String filename) {
        try {
            File file = new File(UPLOAD_DIR, filename);

            if (!file.exists()) {
                return ResponseEntity.notFound().build();
            }

            String contentType = Files.probeContentType(file.toPath());

            return ResponseEntity.ok()
                    .header("Content-Type", contentType != null ? contentType : "application/octet-stream")
                    .body(new InputStreamResource(new FileInputStream(file)));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error al cargar la imagen");
        }
    }
}
