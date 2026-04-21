package com.example.RealEstate.Controller;

import com.example.RealEstate.Dto.AuthResponse;
import com.example.RealEstate.Dto.EnquiryResponseDTO;
import com.example.RealEstate.Dto.RegisterRequest;
import com.example.RealEstate.Dto.PropertyResponseDTO;
import com.example.RealEstate.Model.User;
import com.example.RealEstate.Service.AdminService;
import com.example.RealEstate.Service.EnquiryService;
import com.example.RealEstate.Service.UserService;
import com.example.RealEstate.Service.PropertyService;   // ✅ ADDED
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;
    private final UserService userService;
    private final PropertyService propertyService;   // ✅ ADDED
    private final EnquiryService enquiryService;

    // =========================
    // CREATE USER
    // =========================
    @PostMapping("/users")
    public ResponseEntity<AuthResponse> createUser(@RequestBody RegisterRequest request) {

        User savedUser = adminService.createUser(request);

        AuthResponse response = new AuthResponse(
                "User created successfully",
                savedUser.getUserId(),
                savedUser.getEmail(),
                savedUser.getRole().name(),
                null
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // =========================
    // GET ALL USERS
    // =========================
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    // =========================
    // DELETE USER
    // =========================
    @DeleteMapping("/users/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok("User deleted successfully");
    }

    // =========================
    // UPDATE ROLE
    // =========================
    @PutMapping("/users/{id}/role")
    public ResponseEntity<User> updateRole(
            @PathVariable Long id,
            @RequestBody Map<String, String> body
    ) {
        String role = body.get("role");
        User updatedUser = userService.updateUserRole(id, role);

        return ResponseEntity.ok(updatedUser);
    }

    // =========================
    // ✅ FIX ADDED: GET ALL PROPERTIES
    // =========================
    @GetMapping("/properties")
    public ResponseEntity<List<PropertyResponseDTO>> getAllProperties() {
        return ResponseEntity.ok(propertyService.getAllProperties());
    }

    @GetMapping("/inquiries")
    public ResponseEntity<List<EnquiryResponseDTO>> getAllEnquiries() {
        return ResponseEntity.ok(enquiryService.getAllEnquiries());
    }

    @PutMapping("/inquiries/{id}/status")
    public ResponseEntity<EnquiryResponseDTO> updateEnquiryStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body
    ) {
        return ResponseEntity.ok(enquiryService.updateStatus(id, body.get("status")));
    }

    @DeleteMapping("/inquiries/{id}")
    public ResponseEntity<String> deleteEnquiry(@PathVariable Long id) {
        enquiryService.deleteEnquiry(id);
        return ResponseEntity.ok("Enquiry deleted successfully");
    }
}
