package org.example.backend.controller;

import org.example.backend.dto.SearchResultDTO;
import org.example.backend.entity.CourseEntity;
import org.example.backend.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/search")
@CrossOrigin(origins = "*")
public class SearchController {

    private final CourseRepository courseRepository;

    @Autowired
    public SearchController(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }

    @GetMapping
    public ResponseEntity<List<SearchResultDTO>> search(@RequestParam String query) {

        if (query == null || query.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        String queryLower = query.toLowerCase();

        List<CourseEntity> courses = courseRepository.findAll().stream()
                .filter(course -> course.getName() != null &&
                        course.getName().toLowerCase().contains(queryLower))
                .collect(Collectors.toList());

        List<SearchResultDTO> results = courses.stream()
                .map(course -> new SearchResultDTO("course", mapCourseToResponse(course)))
                .collect(Collectors.toList());

        return ResponseEntity.ok(results);
    }

    private Map<String, Object> mapCourseToResponse(CourseEntity course) {
        Map<String, Object> courseMap = new HashMap<>();
        courseMap.put("id", course.getId());
        courseMap.put("name", course.getName());
        courseMap.put("description", course.getDescription());
        courseMap.put("status", course.getStatus());
        if (course.getCreatedAt() != null) {
            courseMap.put("createdAt", course.getCreatedAt().toString());
        }
        return courseMap;
    }
}