package org.example.backend.repository;

import org.example.backend.entity.SeminarEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface SeminarRepository extends JpaRepository<SeminarEntity, Long> {

    // allUpcomingSeminars
    List<SeminarEntity> findByStartTimeAfterOrderByStartTimeAsc(LocalDateTime now);

    // atLaufendenSow
    @Query("SELECT s FROM SeminarEntity s WHERE s.startTime <= :now AND s.endTime >= :now AND s.status = 'LIVE'")
    List<SeminarEntity> findLiveSeminars(LocalDateTime now);

    // seminarsByStatus
    List<SeminarEntity> findByStatusOrderByStartTimeAsc(SeminarEntity.SeminarStatus status);

    // seminarsToday
    @Query("SELECT s FROM SeminarEntity s WHERE DATE(s.startTime) = DATE(:today) ORDER BY s.startTime ASC")
    List<SeminarEntity> findSeminarsToday(LocalDateTime today);
}