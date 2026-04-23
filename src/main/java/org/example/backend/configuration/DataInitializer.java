package org.example.backend.configuration;

import org.example.backend.service.CourseService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

@Component
@Profile("dev")
public class DataInitializer implements CommandLineRunner {

    private final CourseService courseService;

    public DataInitializer(CourseService courseService) {
        this.courseService = courseService;
    }

    @Override
    public void run(String... args) {

        if (courseService.getCourseByName("DevOps").isEmpty()) {

            var devOpsCourse = courseService.createCourse(
                    "DevOps",
                    "Learn DevOps practices and tools for modern software development"
            );


            courseService.createLearningPath(
                    devOpsCourse.getId(),
                    "Beginner",
                    100,
                    12,
                    "This learning path introduces you to the basics of DevOps. You will learn the most important concepts, tools, and practices."
            );

            courseService.createLearningPath(
                    devOpsCourse.getId(),
                    "advanced",
                    200,
                    12,
                    "Advanced DevOps techniques and best practices for experienced developers."
            );

            courseService.createLearningPath(
                    devOpsCourse.getId(),
                    "professionals",
                    300,
                    12,
                    "Expert knowledge for DevOps professionals with a focus on complex scenarios and specializations."
            );

            System.out.println("✅ DevOps course with 3 learning paths created!");
        }
    }
}