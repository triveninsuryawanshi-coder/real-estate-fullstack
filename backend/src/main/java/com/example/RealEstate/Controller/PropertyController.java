package com.example.RealEstate.Controller;

import com.example.RealEstate.Dto.PropertyDTO;
import com.example.RealEstate.Dto.PropertyImageDTO;
import com.example.RealEstate.Dto.PropertyResponseDTO;
import com.example.RealEstate.Model.Property;
import com.example.RealEstate.Model.User;
import com.example.RealEstate.Service.PropertyImageService;
import com.example.RealEstate.Service.PropertyService;
import com.example.RealEstate.Service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/properties")
@RequiredArgsConstructor
public class PropertyController {

    private final PropertyService propertyService;
    private final PropertyImageService propertyImageService;
    private final UserService userService;

    @GetMapping
    public ResponseEntity<List<PropertyResponseDTO>> getAll() {
        return ResponseEntity.ok(propertyService.getAllProperties());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PropertyResponseDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(propertyService.getPropertyById(id));
    }

    @PostMapping
    public ResponseEntity<PropertyResponseDTO> create(@RequestBody PropertyDTO dto) {
        return ResponseEntity.ok(propertyService.createProperty(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PropertyResponseDTO> update(
            @PathVariable Long id,
            @RequestBody PropertyDTO dto
    ) {
        return ResponseEntity.ok(propertyService.updateProperty(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        propertyService.deleteProperty(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<PropertyResponseDTO> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body
    ) {
        String status = body.get("status");
        return ResponseEntity.ok(propertyService.updateStatus(id, status));
    }

    @PostMapping("/{propertyId}/images")
    public ResponseEntity<List<PropertyImageDTO>> uploadPropertyImages(
            @PathVariable Long propertyId,
            @RequestParam("files") MultipartFile[] files
    ) {
        Property property = propertyService.getPropertyEntityById(propertyId);
        User authenticatedUser = getAuthenticatedUser();

        return ResponseEntity.ok(
                propertyImageService.uploadPropertyImages(property, authenticatedUser, files)
        );
    }

    @DeleteMapping("/{propertyId}/images/{imageId}")
    public ResponseEntity<String> deletePropertyImage(
            @PathVariable Long propertyId,
            @PathVariable Long imageId
    ) {
        Property property = propertyService.getPropertyEntityById(propertyId);
        User authenticatedUser = getAuthenticatedUser();

        propertyImageService.deletePropertyImage(property, authenticatedUser, imageId);
        return ResponseEntity.ok("Property image deleted successfully");
    }

    private User getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return userService.getUserByEmail(authentication.getName());
    }
    @GetMapping("/owner/{ownerId}")
    public ResponseEntity<List<PropertyResponseDTO>> getByOwner(
            @PathVariable Long ownerId
    ) {
        return ResponseEntity.ok(propertyService.getPropertiesByOwner(ownerId));
    }
}