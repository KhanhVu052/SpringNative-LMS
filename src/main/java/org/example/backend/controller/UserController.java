package org.example.backend.controller;

import org.example.backend.entity.UserEntity;
import org.example.backend.repository.UserRepository;
import org.example.backend.repository.EnrollmentRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    private final UserRepository userRepository;
    private final EnrollmentRepository enrollmentRepository; // Thêm Repository

    public UserController(UserRepository userRepository, EnrollmentRepository enrollmentRepository) {
        this.userRepository = userRepository;
        this.enrollmentRepository = enrollmentRepository;
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllUsers() {
        List<UserEntity> users = userRepository.findAll();

        List<Map<String, Object>> response = users.stream().map(user -> {
            Map<String, Object> userMap = new HashMap<>();
            userMap.put("id", user.getId());
            userMap.put("username", user.getUsername());
            userMap.put("email", user.getEmail());
            userMap.put("createdAt", user.getCreatedAt().toString());
            userMap.put("provider", user.getProvider());
            userMap.put("isActive", user.getIsActive());
            return userMap;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getUserById(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(user -> {
                    Map<String, Object> userMap = new HashMap<>();
                    userMap.put("id", user.getId());
                    userMap.put("username", user.getUsername());
                    userMap.put("email", user.getEmail());
                    userMap.put("createdAt", user.getCreatedAt().toString());
                    userMap.put("provider", user.getProvider());
                    userMap.put("isActive", user.getIsActive());
                    return ResponseEntity.ok(userMap);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(
            @PathVariable Long id,
            @RequestBody Map<String, String> updates
    ) {
        return userRepository.findById(id)
                .map(user -> {

                    if (updates.containsKey("username")) {
                        String newUsername = updates.get("username");

                        if (!newUsername.equals(user.getUsername()) && userRepository.existsByUsername(newUsername)) {
                            return ResponseEntity.badRequest().body(Map.of("error", "Username already taken"));
                        }
                        user.setUsername(newUsername);
                    }


                    if (updates.containsKey("email")) {
                        String newEmail = updates.get("email");

                        if (!newEmail.equals(user.getEmail()) && userRepository.existsByEmail(newEmail)) {
                            return ResponseEntity.badRequest().body(Map.of("error", "Email already registered"));
                        }
                        user.setEmail(newEmail);
                    }


                    UserEntity updated = userRepository.save(user);

                    Map<String, Object> userMap = new HashMap<>();
                    userMap.put("id", updated.getId());
                    userMap.put("username", updated.getUsername());
                    userMap.put("email", updated.getEmail());
                    userMap.put("createdAt", updated.getCreatedAt().toString());

                    return ResponseEntity.ok(userMap);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteUser(@PathVariable Long id) {
        return userRepository.findById(id).map(user -> {
            long enrollmentCount = enrollmentRepository.countByUserId(id);

            if (enrollmentCount > 0) {
                user.setIsActive(false);
                userRepository.save(user);
                return ResponseEntity.ok(Map.of("message", "User has active enrollments. Account has been locked (Soft Delete)."));
            } else {
                userRepository.deleteById(id);
                return ResponseEntity.ok(Map.of("message", "User deleted permanently (Hard Delete)."));
            }
        }).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "User not found!")));
    }
}