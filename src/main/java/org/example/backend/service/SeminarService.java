package org.example.backend.service;

import org.example.backend.entity.CourseEntity;
import org.example.backend.entity.SeminarEntity;
import org.example.backend.repository.CourseRepository;
import org.example.backend.repository.SeminarRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class SeminarService {

    private final SeminarRepository seminarRepository;
    private final CourseRepository courseRepository;

    public SeminarService(SeminarRepository seminarRepository, CourseRepository courseRepository) {
        this.seminarRepository = seminarRepository;
        this.courseRepository = courseRepository;
        // createADemoSeminarAtTheStart
        createDemoSeminarIfNotExists();
    }
    
    private void createDemoSeminarIfNotExists() {
        try {
            // Update existing seminar if instructor name is incorrect
            List<SeminarEntity> existingSeminars = seminarRepository.findAll();
            for (SeminarEntity seminar : existingSeminars) {
                if ("Demo Dozent".equals(seminar.getInstructorName())) {
                    seminar.setInstructorName("dozent");
                    seminarRepository.save(seminar);
                    System.out.println("Updated seminar instructor name to 'dozent' for seminar ID: " + seminar.getId());
                }
            }
            
            // getAllCoursesFromTheDatabase
            List<CourseEntity> allCourses = courseRepository.findAll();
            
            // Create a seminar for each course if one doesn't already exist
            for (CourseEntity course : allCourses) {
                // Check if a seminar already exists for this course (based on title)
                String seminarTitle = course.getName() + " Live-Seminar";
                boolean seminarExists = existingSeminars.stream()
                    .anyMatch(s -> s.getTitle().equals(seminarTitle));
                
                if (!seminarExists) {
                    SeminarEntity newSeminar = new SeminarEntity();
                    newSeminar.setTitle(seminarTitle);
                    newSeminar.setDescription("Live-Seminar für den Kurs: " + course.getName());
                    newSeminar.setInstructorName("dozent");
                    newSeminar.setStartTime(LocalDateTime.now());
                    newSeminar.setEndTime(LocalDateTime.now().plusHours(2));
                    newSeminar.setMaxParticipants(50);
                    newSeminar.setCurrentParticipants(0);
                    newSeminar.setMeetingUrl("https://demo.zoom.us/meeting");
                    newSeminar.setMeetingId("123-456-789");
                    newSeminar.setMeetingPassword("demo123");
                    newSeminar.setStatus(SeminarEntity.SeminarStatus.LIVE);
                    
                    seminarRepository.save(newSeminar);
                    System.out.println("Seminar erstellt für Kurs '" + course.getName() + "' mit ID: " + newSeminar.getId());
                }
            }
            
            // createADefaultSeminarIfNoCoursesExist
            if (allCourses.isEmpty() && seminarRepository.count() == 0) {
                SeminarEntity demoSeminar = new SeminarEntity();
                demoSeminar.setTitle("Demo Live-Seminar");
                demoSeminar.setDescription("Ein Demo-Seminar für Testzwecke");
                demoSeminar.setInstructorName("dozent");
                demoSeminar.setStartTime(LocalDateTime.now());
                demoSeminar.setEndTime(LocalDateTime.now().plusHours(2));
                demoSeminar.setMaxParticipants(50);
                demoSeminar.setCurrentParticipants(0);
                demoSeminar.setMeetingUrl("https://demo.zoom.us/meeting");
                demoSeminar.setMeetingId("123-456-789");
                demoSeminar.setMeetingPassword("demo123");
                demoSeminar.setStatus(SeminarEntity.SeminarStatus.LIVE);
                
                seminarRepository.save(demoSeminar);
                System.out.println("Demo-Seminar erstellt mit ID: " + demoSeminar.getId());
            }
        } catch (Exception e) {
            System.err.println("Fehler beim Erstellen der Seminare: " + e.getMessage());
            e.printStackTrace();
        }
    }

    // viewAllSeminars
    public List<SeminarEntity> getAllSeminars() {
        return seminarRepository.findAll();
    }

    // upcomingSeminars
    public List<SeminarEntity> getUpcomingSeminars() {
        return seminarRepository.findByStartTimeAfterOrderByStartTimeAsc(LocalDateTime.now());
    }

    // liveSowing
    public List<SeminarEntity> getLiveSeminars() {
        return seminarRepository.findLiveSeminars(LocalDateTime.now());
    }

    // seminarsToday
    public List<SeminarEntity> getTodaysSeminars() {
        return seminarRepository.findSeminarsToday(LocalDateTime.now());
    }

    // seminarByID
    public Optional<SeminarEntity> getSeminarById(Long id) {
        return seminarRepository.findById(id);
    }

    // createANewSeminar
    @Transactional
    public SeminarEntity createSeminar(String title, String description, String instructorName,
                                       LocalDateTime startTime, LocalDateTime endTime,
                                       Integer maxParticipants, String meetingUrl,
                                       String meetingId, String meetingPassword) {
        SeminarEntity seminar = new SeminarEntity();
        seminar.setTitle(title);
        seminar.setDescription(description);
        seminar.setInstructorName(instructorName);
        seminar.setStartTime(startTime);
        seminar.setEndTime(endTime);
        seminar.setMaxParticipants(maxParticipants);
        seminar.setMeetingUrl(meetingUrl);
        seminar.setMeetingId(meetingId);
        seminar.setMeetingPassword(meetingPassword);
        seminar.setStatus(SeminarEntity.SeminarStatus.SCHEDULED);

        return seminarRepository.save(seminar);
    }

    // updateSeminar
    @Transactional
    public SeminarEntity updateSeminar(Long id, String title, String description,
                                       String instructorName, LocalDateTime startTime,
                                       LocalDateTime endTime, Integer maxParticipants,
                                       String meetingUrl, String meetingId, String meetingPassword) {
        SeminarEntity seminar = seminarRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Seminar not found"));

        seminar.setTitle(title);
        seminar.setDescription(description);
        seminar.setInstructorName(instructorName);
        seminar.setStartTime(startTime);
        seminar.setEndTime(endTime);
        seminar.setMaxParticipants(maxParticipants);
        seminar.setMeetingUrl(meetingUrl);
        seminar.setMeetingId(meetingId);
        seminar.setMeetingPassword(meetingPassword);

        return seminarRepository.save(seminar);
    }

    // changeSeminarStatus
    @Transactional
    public SeminarEntity updateSeminarStatus(Long id, SeminarEntity.SeminarStatus status) {
        SeminarEntity seminar = seminarRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Seminar not found"));

        seminar.setStatus(status);
        return seminarRepository.save(seminar);
    }

    // addParticipants
    @Transactional
    public SeminarEntity joinSeminar(Long id) {
        SeminarEntity seminar = seminarRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Seminar not found"));

        if (seminar.getCurrentParticipants() >= seminar.getMaxParticipants()) {
            throw new RuntimeException("Seminar is full");
        }

        seminar.setCurrentParticipants(seminar.getCurrentParticipants() + 1);
        return seminarRepository.save(seminar);
    }

    // deleteSeminar
    @Transactional
    public void deleteSeminar(Long id) {
        seminarRepository.deleteById(id);
    }
}