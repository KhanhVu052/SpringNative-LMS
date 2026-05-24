package org.example.backend.repository;

import org.example.backend.entity.CourseEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CourseRepository extends JpaRepository<CourseEntity, Long> {
    List<CourseEntity> findByTeacherId(Long teacherId);
    Optional<CourseEntity> findByName(String name);

}