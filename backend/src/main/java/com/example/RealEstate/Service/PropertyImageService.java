package com.example.RealEstate.Service;

import com.example.RealEstate.Dto.PropertyImageDTO;
import com.example.RealEstate.Exceptions.ResourceNotFoundException;
import com.example.RealEstate.Model.Property;
import com.example.RealEstate.Model.PropertyImage;
import com.example.RealEstate.Model.User;
import com.example.RealEstate.Repository.PropertyImageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PropertyImageService {

    private final PropertyImageRepository propertyImageRepository;
    private final FileStorageService fileStorageService;

    @Transactional
    public List<PropertyImageDTO> uploadPropertyImages(Property property, User authenticatedUser, MultipartFile[] files) {
        validateOwnerAccess(property, authenticatedUser);

        if (files == null || files.length == 0) {
            throw new IllegalArgumentException("At least one image file is required");
        }

        boolean hasPrimaryImage = propertyImageRepository.findByPropertyPropertyId(property.getPropertyId())
                .stream()
                .anyMatch(image -> Boolean.TRUE.equals(image.getIsPrimary()));

        List<PropertyImage> savedImages = new ArrayList<>();

        for (MultipartFile file : files) {
            String imageUrl = fileStorageService.storePropertyImage(file);

            PropertyImage image = new PropertyImage();
            image.setProperty(property);
            image.setImageUrl(imageUrl);
            image.setIsPrimary(!hasPrimaryImage && savedImages.isEmpty());

            savedImages.add(propertyImageRepository.save(image));
        }

        return savedImages.stream()
                .map(this::toDto)
                .toList();
    }

    @Transactional
    public void deletePropertyImage(Property property, User authenticatedUser, Long imageId) {
        validateOwnerAccess(property, authenticatedUser);

        PropertyImage image = propertyImageRepository.findById(imageId)
                .orElseThrow(() -> new ResourceNotFoundException("Property image not found with id: " + imageId));

        if (!image.getProperty().getPropertyId().equals(property.getPropertyId())) {
            throw new IllegalArgumentException("Image does not belong to the specified property");
        }

        fileStorageService.deleteFile(image.getImageUrl());
        propertyImageRepository.delete(image);

        List<PropertyImage> remainingImages = propertyImageRepository.findByPropertyPropertyId(property.getPropertyId());
        if (!remainingImages.isEmpty() && remainingImages.stream().noneMatch(img -> Boolean.TRUE.equals(img.getIsPrimary()))) {
            PropertyImage firstImage = remainingImages.get(0);
            firstImage.setIsPrimary(true);
            propertyImageRepository.save(firstImage);
        }
    }

    @Transactional
    public void syncPropertyImages(Property property, List<String> imageUrls) {
        deletePropertyImages(property);

        if (imageUrls == null || imageUrls.isEmpty()) {
            return;
        }

        List<PropertyImage> images = new ArrayList<>();
        for (int index = 0; index < imageUrls.size(); index++) {
            String imageUrl = imageUrls.get(index);
            if (imageUrl == null || imageUrl.isBlank()) {
                continue;
            }

            PropertyImage image = new PropertyImage();
            image.setProperty(property);
            image.setImageUrl(imageUrl);
            image.setIsPrimary(index == 0);
            images.add(image);
        }

        if (!images.isEmpty()) {
            propertyImageRepository.saveAll(images);
        }
    }

    @Transactional
    public void deletePropertyImages(Property property) {
        List<PropertyImage> existingImages = propertyImageRepository.findByPropertyPropertyId(property.getPropertyId());
        for (PropertyImage image : existingImages) {
            fileStorageService.deleteFile(image.getImageUrl());
        }
        propertyImageRepository.deleteByProperty(property);
    }

    public List<PropertyImageDTO> getPropertyImages(Long propertyId) {
        return propertyImageRepository.findByPropertyPropertyId(propertyId)
                .stream()
                .map(this::toDto)
                .toList();
    }

    private PropertyImageDTO toDto(PropertyImage image) {
        return new PropertyImageDTO(
                image.getImageId(),
                image.getImageUrl(),
                image.getIsPrimary()
        );
    }

    private void validateOwnerAccess(Property property, User authenticatedUser) {
        if ("ADMIN".equals(authenticatedUser.getRole().name())) {
            return;
        }

        if (!property.getOwner().getUserId().equals(authenticatedUser.getUserId())) {
            throw new AccessDeniedException("You can only modify images for your own property");
        }
    }
}
