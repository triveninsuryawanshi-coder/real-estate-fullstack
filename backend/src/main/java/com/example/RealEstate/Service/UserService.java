package com.example.RealEstate.Service;

import com.example.RealEstate.Dto.RegisterRequest;
import com.example.RealEstate.Enum.Role;
import com.example.RealEstate.Exceptions.DuplicateEmailException;
import com.example.RealEstate.Exceptions.ResourceNotFoundException;
import com.example.RealEstate.Model.User;
import com.example.RealEstate.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public User registerUser(RegisterRequest request) {
        return registerUser(request, false);
    }

    public User registerUser(RegisterRequest request, boolean allowAdmin) {
        if (request.getRole() == null) {
            throw new IllegalArgumentException("Role is required");
        }

        if (!allowAdmin && request.getRole() == Role.ADMIN) {
            throw new IllegalArgumentException("ADMIN role can only be created by an admin");
        }

        String email = request.getEmail().toLowerCase();

        if (userRepository.existsByEmail(email)) {
            throw new DuplicateEmailException("Email already registered: " + email);
        }

        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setPhone(request.getPhone());
        user.setRole(request.getRole());
        user.setProfileImageUrl(request.getProfileImageUrl());
        user.setEnabled(true);
        user.setVerified(false);

        return userRepository.save(user);
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email.toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public List<User> getUsersByRole(Role role) {
        return userRepository.findByRole(role);
    }

    public User updateUser(Long id, User updatedData) {
        User existing = getUserById(id);
        existing.setFullName(updatedData.getFullName());
        existing.setPhone(updatedData.getPhone());
        existing.setProfileImageUrl(updatedData.getProfileImageUrl());
        return userRepository.save(existing);
    }

    public User updateUserRole(Long id, String role) {
        User user = getUserById(id);

        try {
            user.setRole(Role.valueOf(role.toUpperCase()));
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid role: " + role);
        }

        return userRepository.save(user);
    }

    public User toggleUserStatus(Long id) {
        User user = getUserById(id);
        user.setEnabled(!user.isEnabled());
        return userRepository.save(user);
    }

    public void deleteUser(Long id) {
        getUserById(id);
        userRepository.deleteById(id);
    }

    public User login(String email, String password) {
        User user = getUserByEmail(email);

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new BadCredentialsException("Invalid password");
        }

        if (!user.isEnabled()) {
            throw new IllegalStateException("User account is disabled");
        }

        return user;
    }

    public String forgotPassword(String email, String newPassword) {
        User user = getUserByEmail(email);
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        return "Password reset successful";
    }

    public void createDefaultAdmin() {
        String adminEmail = "admin@example.com";

        if (!userRepository.existsByEmail(adminEmail)) {
            RegisterRequest adminRequest = new RegisterRequest();
            adminRequest.setFullName("Admin User");
            adminRequest.setEmail(adminEmail);
            adminRequest.setPassword("admin123");
            adminRequest.setRole(Role.ADMIN);
            adminRequest.setPhone("0000000000");
            adminRequest.setProfileImageUrl(null);

            registerUser(adminRequest, true);
            System.out.println("Default admin created: " + adminEmail + " / admin123");
        }
    }
}