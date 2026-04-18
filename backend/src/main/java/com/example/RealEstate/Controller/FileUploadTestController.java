package com.example.RealEstate.Controller;

import com.example.RealEstate.Service.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/test-upload")
@RequiredArgsConstructor
public class FileUploadTestController {

    private final FileStorageService fileStorageService;
    private static final Logger logger = LoggerFactory.getLogger(FileUploadTestController.class);

    // ✅ Single file upload
    @PostMapping("/single")
    public ResponseEntity<String> uploadSingle(@RequestParam("file") MultipartFile file) {
        try {
            String fileUrl = fileStorageService.storePropertyImage(file);
            return ResponseEntity.ok("File stored at: " + fileUrl);
        } catch (Exception e) {
            logger.error("File upload failed", e);// See console for errors
            return ResponseEntity.status(500).body("Upload failed: " + e.getMessage());
        }
    }

    // ✅ Multiple files upload
    @PostMapping("/multiple")
    public ResponseEntity<String> uploadMultiple(@RequestParam("files") MultipartFile[] files) {
        try {
            StringBuilder sb = new StringBuilder();
            for (MultipartFile file : files) {
                String fileUrl = fileStorageService.storePropertyImage(file);
                sb.append(fileUrl).append("\n");
            }
            return ResponseEntity.ok("Files stored at:\n" + sb);
        } catch (Exception e) {
            logger.error("File upload failed", e);// See console for errors
            return ResponseEntity.status(500).body("Upload failed: " + e.getMessage());
        }
    }
}