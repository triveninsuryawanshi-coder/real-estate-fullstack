package com.example.RealEstate.Dto;

import lombok.Data;

@Data
public class EnquiryRequestDTO {
    private Long propertyId;
    private String buyerName;
    private String buyerEmail;
    private String buyerPhone;
    private String message;
}
