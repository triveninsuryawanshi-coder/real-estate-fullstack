package com.example.RealEstate.Dto;

import com.example.RealEstate.Enum.EnquiryStatus;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class EnquiryResponseDTO {
    private Long enquiryId;
    private Long propertyId;
    private String propertyTitle;
    private Long buyerId;
    private String buyerName;
    private String buyerEmail;
    private String buyerPhone;
    private Long ownerId;
    private String ownerEmail;
    private String message;
    private EnquiryStatus status;
    private LocalDateTime createdAt;
}
