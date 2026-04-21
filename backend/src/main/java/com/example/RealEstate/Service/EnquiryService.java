package com.example.RealEstate.Service;

import com.example.RealEstate.Dto.EnquiryRequestDTO;
import com.example.RealEstate.Dto.EnquiryResponseDTO;
import com.example.RealEstate.Enum.EnquiryStatus;
import com.example.RealEstate.Exceptions.ResourceNotFoundException;
import com.example.RealEstate.Model.Enquiry;
import com.example.RealEstate.Model.Property;
import com.example.RealEstate.Model.User;
import com.example.RealEstate.Repository.EnquiryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EnquiryService {

    private final EnquiryRepository enquiryRepository;
    private final PropertyService propertyService;
    private final EmailService emailService;

    public EnquiryResponseDTO createEnquiry(EnquiryRequestDTO dto, User buyer) {
        if (dto.getPropertyId() == null) {
            throw new IllegalArgumentException("Property id is required");
        }
        if (dto.getMessage() == null || dto.getMessage().isBlank()) {
            throw new IllegalArgumentException("Message is required");
        }

        Property property = propertyService.getPropertyEntityById(dto.getPropertyId());
        User owner = property.getOwner();

        Enquiry enquiry = new Enquiry();
        enquiry.setProperty(property);
        enquiry.setBuyer(buyer);
        enquiry.setOwner(owner);
        enquiry.setBuyerName(hasText(dto.getBuyerName()) ? dto.getBuyerName().trim() : buyer.getFullName());
        enquiry.setBuyerEmail(hasText(dto.getBuyerEmail()) ? dto.getBuyerEmail().trim().toLowerCase() : buyer.getEmail());
        enquiry.setBuyerPhone(hasText(dto.getBuyerPhone()) ? dto.getBuyerPhone().trim() : buyer.getPhone());
        enquiry.setOwnerEmail(owner.getEmail());
        enquiry.setPropertyTitle(property.getTitle());
        enquiry.setMessage(dto.getMessage().trim());
        enquiry.setStatus(EnquiryStatus.NEW);

        Enquiry savedEnquiry = enquiryRepository.save(enquiry);

        try {
            emailService.sendEnquiryToOwner(savedEnquiry);
        } catch (Exception ex) {
            System.err.println("Failed to send enquiry email: " + ex.getMessage());
        }

        return toResponseDto(savedEnquiry);
    }

    public List<EnquiryResponseDTO> getAllEnquiries() {
        return enquiryRepository.findAll()
                .stream()
                .map(this::toResponseDto)
                .toList();
    }

    public EnquiryResponseDTO updateStatus(Long enquiryId, String status) {
        Enquiry enquiry = getEnquiryEntityById(enquiryId);
        enquiry.setStatus(parseStatus(status));
        return toResponseDto(enquiryRepository.save(enquiry));
    }

    public void deleteEnquiry(Long enquiryId) {
        Enquiry enquiry = getEnquiryEntityById(enquiryId);
        enquiryRepository.delete(enquiry);
    }

    private Enquiry getEnquiryEntityById(Long enquiryId) {
        return enquiryRepository.findById(enquiryId)
                .orElseThrow(() -> new ResourceNotFoundException("Enquiry not found with id: " + enquiryId));
    }

    private EnquiryStatus parseStatus(String status) {
        try {
            return EnquiryStatus.valueOf(status.toUpperCase());
        } catch (Exception ex) {
            throw new IllegalArgumentException("Invalid enquiry status: " + status);
        }
    }

    private EnquiryResponseDTO toResponseDto(Enquiry enquiry) {
        EnquiryResponseDTO dto = new EnquiryResponseDTO();
        dto.setEnquiryId(enquiry.getEnquiryId());
        dto.setPropertyId(enquiry.getProperty().getPropertyId());
        dto.setPropertyTitle(enquiry.getPropertyTitle());
        dto.setBuyerId(enquiry.getBuyer().getUserId());
        dto.setBuyerName(enquiry.getBuyerName());
        dto.setBuyerEmail(enquiry.getBuyerEmail());
        dto.setBuyerPhone(enquiry.getBuyerPhone());
        dto.setOwnerId(enquiry.getOwner().getUserId());
        dto.setOwnerEmail(enquiry.getOwnerEmail());
        dto.setMessage(enquiry.getMessage());
        dto.setStatus(enquiry.getStatus());
        dto.setCreatedAt(enquiry.getCreatedAt());
        return dto;
    }

    private boolean hasText(String value) {
        return value != null && !value.isBlank();
    }
}
