package org.example.backend.repository;

import org.example.backend.entity.StudentSubmissionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentSubmissionRepository extends JpaRepository<StudentSubmissionEntity, Long> {

    List<StudentSubmissionEntity> findByCourseIdOrderBySubmissionTimeDesc(Long courseId);
    List<StudentSubmissionEntity> findByStudentIdAndCourseId(Long studentId, Long courseId);
    List<StudentSubmissionEntity> findByCourseIdAndSubmissionType(Long courseId, StudentSubmissionEntity.SubmissionType submissionType);
    long countByCourseId(Long courseId);
}