package com.example.RealEstate.Controller;

import com.example.RealEstate.Dto.EnquiryRequestDTO;
import com.example.RealEstate.Dto.EnquiryResponseDTO;
import com.example.RealEstate.Model.User;
import com.example.RealEstate.Service.EnquiryService;
import com.example.RealEstate.Service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/inquiries")
@RequiredArgsConstructor
public class EnquiryController {

    private final EnquiryService enquiryService;
    private final UserService userService;

    @PostMapping
    public ResponseEntity<EnquiryResponseDTO> createEnquiry(@RequestBody EnquiryRequestDTO dto) {
        return ResponseEntity.ok(enquiryService.createEnquiry(dto, getAuthenticatedUser()));
    }

    private User getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return userService.getUserByEmail(authentication.getName());
    }
}
