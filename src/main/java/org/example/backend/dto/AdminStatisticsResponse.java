package org.example.backend.dto;

public class AdminStatisticsResponse {
    private long totalUsers;
    private long totalTeachers;
    private long totalEnrollments;
    private long totalCourses;

    public AdminStatisticsResponse() {}

    public AdminStatisticsResponse(long totalUsers, long totalTeachers, long totalEnrollments,
                                    long totalCourses) {
        this.totalUsers = totalUsers;
        this.totalTeachers = totalTeachers;
        this.totalEnrollments = totalEnrollments;
        this.totalCourses = totalCourses;
    }

    // Getters and Setters

    public long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public long getTotalTeachers() { return totalTeachers; }
    public void setTotalTeachers(long totalTeachers) { this.totalTeachers = totalTeachers; }

    public long getTotalEnrollments() { return totalEnrollments; }
    public void setTotalEnrollments(long totalEnrollments) { this.totalEnrollments = totalEnrollments; }


    public long getTotalCourses() { return totalCourses; }
    public void setTotalCourses(long totalCourses) { this.totalCourses = totalCourses; }
}