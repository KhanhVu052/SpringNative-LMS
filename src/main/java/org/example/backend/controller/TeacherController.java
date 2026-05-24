package org.example.backend.controller;

import org.example.backend.entity.TeacherEntity;
import org.example.backend.entity.UserEntity;
import org.example.backend.repository.TeacherRepository;
import org.example.backend.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/teachers")
@CrossOrigin(origins = "http://localhost:5173")
public class TeacherController {

    private final TeacherRepository teacherRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public TeacherController(TeacherRepository teacherRepository,
                             UserRepository userRepository,
                             PasswordEncoder passwordEncoder) {
        this.teacherRepository = teacherRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllTeachers() {
        List<TeacherEntity> teachers = teacherRepository.findAll();

        List<Map<String, Object>> response = teachers.stream().map(teacher -> {
            Map<String, Object> teacherMap = new HashMap<>();
            teacherMap.put("id", teacher.getId());
            teacherMap.put("firstName", teacher.getFirstName());
            teacherMap.put("lastName", teacher.getLastName());
            teacherMap.put("birthDate", teacher.getBirthDate().toString());
            teacherMap.put("birthPlace", teacher.getBirthPlace());
            teacherMap.put("qualifications", teacher.getQualifications());
            teacherMap.put("subject", teacher.getSubject());
            teacherMap.put("createdAt", teacher.getCreatedAt().toString());
            return teacherMap;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getTeacherById(@PathVariable Long id) {
        return teacherRepository.findById(id)
                .map(teacher -> {
                    Map<String, Object> teacherMap = new HashMap<>();
                    teacherMap.put("id", teacher.getId());
                    teacherMap.put("firstName", teacher.getFirstName());
                    teacherMap.put("lastName", teacher.getLastName());
                    teacherMap.put("birthDate", teacher.getBirthDate().toString());
                    teacherMap.put("birthPlace", teacher.getBirthPlace());
                    teacherMap.put("qualifications", teacher.getQualifications());
                    teacherMap.put("subject", teacher.getSubject());
                    return ResponseEntity.ok(teacherMap);
                })
                .orElse(ResponseEntity.notFound().build());
    }



    @PostMapping
    public ResponseEntity<Map<String, Object>> createTeacher(@RequestBody Map<String, String> data) {
        if (userRepository.existsByUsername(data.get("username"))) {
            return ResponseEntity.badRequest().body(Map.of("error", "Username already exists"));
        }
        if (userRepository.existsByEmail(data.get("email"))) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email already exists"));
        }

        UserEntity user = new UserEntity();
        user.setUsername(data.get("username"));
        user.setEmail(data.get("email"));
        user.setPasswordHash(passwordEncoder.encode(data.get("password")));
        user.setRole("ROLE_TEACHER");
        UserEntity savedUser = userRepository.save(user);

        TeacherEntity teacher = new TeacherEntity();
        teacher.setFirstName(data.get("firstName"));
        teacher.setLastName(data.get("lastName"));
        teacher.setBirthDate(LocalDate.parse(data.get("birthDate")));
        teacher.setBirthPlace(data.get("birthPlace"));
        teacher.setQualifications(data.get("qualifications"));
        teacher.setSubject(data.get("subject"));
        teacher.setUser(savedUser);

        TeacherEntity saved = teacherRepository.save(teacher);

        Map<String, Object> response = new HashMap<>();
        response.put("teacherProfileId", saved.getId());
        response.put("userAccountId", savedUser.getId());
        response.put("username", savedUser.getUsername());
        response.put("message", "Teacher account and profile created successfully!");

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateTeacher(
            @PathVariable Long id,
            @RequestBody Map<String, String> updates
    ) {
        return teacherRepository.findById(id)
                .map(teacher -> {
                    if (updates.containsKey("firstName")) {
                        teacher.setFirstName(updates.get("firstName"));
                    }
                    if (updates.containsKey("lastName")) {
                        teacher.setLastName(updates.get("lastName"));
                    }
                    if (updates.containsKey("birthDate")) {
                        teacher.setBirthDate(LocalDate.parse(updates.get("birthDate")));
                    }
                    if (updates.containsKey("birthPlace")) {
                        teacher.setBirthPlace(updates.get("birthPlace"));
                    }
                    if (updates.containsKey("qualifications")) {
                        teacher.setQualifications(updates.get("qualifications"));
                    }
                    if (updates.containsKey("subject")) {
                        teacher.setSubject(updates.get("subject"));
                    }

                    TeacherEntity updated = teacherRepository.save(teacher);
                    Map<String, Object> response = new HashMap<>();
                    response.put("id", updated.getId());
                    response.put("firstName", updated.getFirstName());
                    response.put("lastName", updated.getLastName());
                    response.put("birthDate", updated.getBirthDate().toString());
                    response.put("birthPlace", updated.getBirthPlace());
                    response.put("qualifications", updated.getQualifications());
                    response.put("subject", updated.getSubject());
                    return ResponseEntity.ok(response);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteTeacher(@PathVariable Long id) {
        return teacherRepository.findById(id).map(teacher -> {
            UserEntity user = teacher.getUser();

            if (user != null) {
                user.setIsActive(false);
                userRepository.save(user);
            }
            if (!teacher.getLastName().endsWith("[Former]")) {
                teacher.setLastName(teacher.getLastName() + " [Former]");
                teacherRepository.save(teacher);
            }

            return ResponseEntity.ok(Map.of("message", "Teacher account locked and profile archived (Soft Delete)."));
        }).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Teacher not found!")));
    }
}