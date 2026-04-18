package com.example.RealEstate.Service;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import java.nio.file.Paths;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
@Getter
public class FileStorageService {

    private final Path uploadRoot;
    public FileStorageService() throws IOException {

        this.uploadRoot = Paths.get(System.getProperty("user.dir"), "uploads")
                .toAbsolutePath()
                .normalize();

        Files.createDirectories(this.uploadRoot);
        System.out.println("UPLOAD PATH = " + uploadRoot);
    }



    public String storePropertyImage(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Image file is required");
        }

        String originalFilename = StringUtils.cleanPath(
                file.getOriginalFilename() != null ? file.getOriginalFilename() : ""
        );

        String extension = "";
        int lastDotIndex = originalFilename.lastIndexOf('.');
        if (lastDotIndex >= 0) {
            extension = originalFilename.substring(lastDotIndex);
        }

        String storedFilename = UUID.randomUUID() + extension;
        Path destination = uploadRoot.resolve(storedFilename);

        try (InputStream inputStream = file.getInputStream()) {
            Files.copy(inputStream, destination, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException ex) {
            throw new IllegalStateException("Failed to store image file", ex);
        }

        return "/uploads/" + storedFilename;
    }

    public void deleteFile(String fileUrl) {
        if (fileUrl == null || fileUrl.isBlank() || !fileUrl.startsWith("/uploads/")) {
            return;
        }

        String filename = fileUrl.substring("/uploads/".length());
        Path filePath = uploadRoot.resolve(filename).normalize();

        try {
            Files.deleteIfExists(filePath);
        } catch (IOException ex) {
            throw new IllegalStateException("Failed to delete image file", ex);
        }
    }
}