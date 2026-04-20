package com.example.RealEstate.Service;

import com.example.RealEstate.Dto.PropertyDTO;
import com.example.RealEstate.Dto.PropertyResponseDTO;
import com.example.RealEstate.Enum.ListingType;
import com.example.RealEstate.Enum.PropertyStatus;
import com.example.RealEstate.Enum.PropertyType;
import com.example.RealEstate.Enum.Role;
import com.example.RealEstate.Exceptions.ResourceNotFoundException;
import com.example.RealEstate.Model.Property;
import com.example.RealEstate.Model.User;
import com.example.RealEstate.Repository.PropertyRepository;
import com.example.RealEstate.Specification.PropertySpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PropertyService {

    private final PropertyRepository propertyRepository;
    private final UserService userService;
    private final PropertyImageService propertyImageService;

    public Page<Property> searchProperties(
            String city,
            ListingType listingType,
            PropertyType type,
            Integer bhk,
            Integer bathrooms,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            Double minArea,
            Double maxArea,
            String furnishing,
            String parking,
            String sortBy,
            String sortDir,
            int page,
            int size
    ) {
        Sort sort = "desc".equalsIgnoreCase(sortDir)
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);

        return propertyRepository.findAll(
                PropertySpecification.filterProperties(
                        city,
                        listingType,
                        type,
                        bhk,
                        bathrooms,
                        minPrice,
                        maxPrice,
                        minArea,
                        maxArea,
                        furnishing,
                        parking
                ),
                pageable
        );
    }

    public Page<Property> searchByListingType(String city, ListingType listingType, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return propertyRepository.findByCityIgnoreCaseAndListingType(city, listingType, pageable);
    }

    public List<PropertyResponseDTO> getAllProperties() {
        return propertyRepository.findAll()
                .stream()
                .map(this::toResponseDto)
                .toList();
    }

    public PropertyResponseDTO getPropertyById(Long id) {
        return toResponseDto(getPropertyEntityById(id));
    }

    public Property getPropertyEntityById(Long id) {
        return propertyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Property not found with id: " + id));
    }

    public List<PropertyResponseDTO> getPropertiesByOwner(Long ownerId) {
        userService.getUserById(ownerId);
        return propertyRepository.findByOwner_UserId(ownerId)
                .stream()
                .map(this::toResponseDto)
                .toList();
    }

    @Transactional
    public PropertyResponseDTO createProperty(PropertyDTO dto) {
        User authenticatedUser = getAuthenticatedUser();
        validateOwnerAccess(dto.getOwnerId(), authenticatedUser, false);

        User owner = userService.getUserById(dto.getOwnerId());

        Property property = new Property();
        mapToEntity(dto, property, owner);

        if (property.getStatus() == null) {
            property.setStatus(PropertyStatus.PENDING);
        }

        Property savedProperty = propertyRepository.save(property);
        propertyImageService.syncPropertyImages(savedProperty, dto.getImageUrls());

        return toResponseDto(savedProperty);
    }

    @Transactional
    public PropertyResponseDTO updateProperty(Long id, PropertyDTO dto) {
        Property existingProperty = getPropertyEntityById(id);
        User authenticatedUser = getAuthenticatedUser();

        validateOwnerAccess(existingProperty.getOwner().getUserId(), authenticatedUser, true);

        User owner = userService.getUserById(dto.getOwnerId());
        validateOwnerAssignment(existingProperty.getOwner().getUserId(), owner.getUserId(), authenticatedUser);

        mapToEntity(dto, existingProperty, owner);

        Property savedProperty = propertyRepository.save(existingProperty);
        propertyImageService.syncPropertyImages(savedProperty, dto.getImageUrls());

        return toResponseDto(savedProperty);
    }

    @Transactional
    public PropertyResponseDTO updateStatus(Long id, String status) {
        Property property = getPropertyEntityById(id);
        property.setStatus(parseStatus(status));
        return toResponseDto(propertyRepository.save(property));
    }

    @Transactional
    public void deleteProperty(Long id) {
        Property property = getPropertyEntityById(id);
        User authenticatedUser = getAuthenticatedUser();

        validateOwnerAccess(property.getOwner().getUserId(), authenticatedUser, true);
        propertyImageService.deletePropertyImages(property);
        propertyRepository.delete(property);
    }

    private void mapToEntity(PropertyDTO dto, Property property, User owner) {
        property.setOwner(owner);
        property.setTitle(dto.getTitle());
        property.setDescription(dto.getDescription());
        property.setType(dto.getType());
        property.setStatus(dto.getStatus());
        property.setPrice(dto.getPrice());
        property.setAreaSqft(dto.getAreaSqft());
        property.setBedrooms(dto.getBedrooms());
        property.setBathrooms(dto.getBathrooms());
        property.setAddress(dto.getAddress());
        property.setCity(dto.getCity());
        property.setState(dto.getState());
        property.setCountry(dto.getCountry());
        property.setLatitude(dto.getLatitude());
        property.setLongitude(dto.getLongitude());
        property.setFurnishing(dto.getFurnishing());
        property.setParking(dto.getParking());
        property.setListingType(dto.getListingType());
    }

    private PropertyStatus parseStatus(String status) {
        try {
            return PropertyStatus.valueOf(status.toUpperCase());
        } catch (Exception ex) {
            throw new IllegalArgumentException("Invalid status: " + status);
        }
    }

    private PropertyResponseDTO toResponseDto(Property property) {
        PropertyResponseDTO response = new PropertyResponseDTO();
        response.setPropertyId(property.getPropertyId());
        response.setOwnerId(property.getOwner().getUserId());
        response.setOwnerName(property.getOwner().getFullName());
        response.setOwnerEmail(property.getOwner().getEmail());
        response.setOwnerPhone(property.getOwner().getPhone());
        response.setTitle(property.getTitle());
        response.setDescription(property.getDescription());
        response.setType(property.getType());
        response.setStatus(property.getStatus());
        response.setPrice(property.getPrice());
        response.setAreaSqft(property.getAreaSqft());
        response.setBedrooms(property.getBedrooms());
        response.setBathrooms(property.getBathrooms());
        response.setAddress(property.getAddress());
        response.setCity(property.getCity());
        response.setState(property.getState());
        response.setCountry(property.getCountry());
        response.setLatitude(property.getLatitude());
        response.setLongitude(property.getLongitude());
        response.setCreatedAt(property.getCreatedAt());
        response.setFurnishing(property.getFurnishing());
        response.setParking(property.getParking());
        response.setListingType(property.getListingType());
        response.setContactName(property.getContactName());
        response.setContactNumber(property.getContactNumber());
        response.setContactEmail(property.getContactEmail());
        response.setImages(propertyImageService.getPropertyImages(property.getPropertyId()));
        return response;
    }

    private User getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new AccessDeniedException("Authentication is required");
        }
        return userService.getUserByEmail(authentication.getName());
    }

    private void validateOwnerAccess(Long ownerId, User authenticatedUser, boolean existingListing) {
        if (authenticatedUser.getRole() == Role.ADMIN) {
            return;
        }

        if (!authenticatedUser.getUserId().equals(ownerId)) {
            throw new AccessDeniedException(
                    existingListing
                            ? "You can only modify listings for your own account"
                            : "You can only create listings for your own account"
            );
        }
    }

    private void validateOwnerAssignment(Long currentOwnerId, Long requestedOwnerId, User authenticatedUser) {
        if (authenticatedUser.getRole() == Role.ADMIN) {
            return;
        }

        if (!currentOwnerId.equals(requestedOwnerId)) {
            throw new AccessDeniedException("You cannot transfer a property listing to another owner");
        }
    }
}
