import React from "react";
import UserViewProfile from "../../components/userprofile/UserViewProfile";
const studentProfileData = {
    id: "1",
    email: "student@school.edu",
    username: "student123",
    firstName: "John",
    lastName: "Doe",
    phone: "+1234567890",
    studentId: "STU2024001",
    grade: "10th Grade",
    department: "Science",
    address: "123 Main Street, City, State",
    emergencyContact: {
        name: "Jane Doe",
        phone: "+1987654321",
        relationship: "Mother",
    },
    enrollmentDate: "2024-09-01",
};
export interface StudentProfile {
    id: string;
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    phone?: string;
    studentId: string;
    grade: string;
    department: string;
    dateOfBirth?: string;
    address?: string;
    emergencyContact?: {
        name: string;
        phone: string;
        relationship: string;
    };
    enrollmentDate: string;
    avatar?: string;
}
const handleProfileUpdate = (updatedProfile: StudentProfile) => {
    console.log("Updating profile:", updatedProfile);
    // Add your API call here to update the profile
};

const handleProfileDelete = (profileId: string) => {
    console.log("Deleting profile:", profileId);
    // Add your API call here to delete the profile
    if (window.confirm("Are you sure you want to delete your account?")) {
        // Proceed with deletion
    }
};
export const UserProfilePage = () => {
    return (
        <>
            <UserViewProfile
                profile={studentProfileData}
                onUpdate={handleProfileUpdate}
                onDelete={handleProfileDelete}
            />
        </>
    );
};
