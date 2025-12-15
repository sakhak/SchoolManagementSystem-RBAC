import React, { useState } from "react";

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

interface ProfileFormProps {
    profile: StudentProfile;
    onUpdate: (updatedProfile: StudentProfile) => void;
    onDelete: (profileId: string) => void;
}

const UserViewProfile: React.FC<ProfileFormProps> = ({
    profile,
    onUpdate,
    onDelete,
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedProfile, setEditedProfile] = useState<StudentProfile>(profile);

    const handleSave = () => {
        onUpdate(editedProfile);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditedProfile(profile);
        setIsEditing(false);
    };

    const handleChange = (field: keyof StudentProfile, value: string) => {
        setEditedProfile((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleEmergencyContactChange = (
        field: keyof StudentProfile["emergencyContact"],
        value: string,
    ) => {
        setEditedProfile((prev) => ({
            ...prev,
            emergencyContact: {
                ...prev.emergencyContact!,
                [field]: value,
            },
        }));
    };

    return (
        <>
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-blue-600 px-6 py-4 text-white">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold">Student Profile</h1>
                        <div className="flex space-x-2">
                            {!isEditing ? (
                                <>
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
                                    >
                                        Edit Profile
                                    </button>
                                    <button
                                        onClick={() => onDelete(profile.id)}
                                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                                    >
                                        Delete Account
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={handleSave}
                                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                                    >
                                        Save Changes
                                    </button>
                                    <button
                                        onClick={handleCancel}
                                        className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <div className="p-6">
                    {/* Basic Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold border-b pb-2">
                                Basic Information
                            </h2>

                            <div>
                                <label className="block text-sm font-medium text-gray-600">
                                    Student ID
                                </label>
                                <div className="mt-1 text-lg font-mono text-gray-900">
                                    {profile.studentId}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-600">
                                    Username
                                </label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={editedProfile.username}
                                        onChange={(e) =>
                                            handleChange(
                                                "username",
                                                e.target.value,
                                            )
                                        }
                                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                ) : (
                                    <div className="mt-1 text-gray-900">
                                        {profile.username}
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-600">
                                    Email
                                </label>
                                {isEditing ? (
                                    <input
                                        type="email"
                                        value={editedProfile.email}
                                        onChange={(e) =>
                                            handleChange(
                                                "email",
                                                e.target.value,
                                            )
                                        }
                                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                ) : (
                                    <div className="mt-1 text-gray-900">
                                        {profile.email}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold border-b pb-2">
                                Academic Information
                            </h2>

                            <div>
                                <label className="block text-sm font-medium text-gray-600">
                                    Full Name
                                </label>
                                {isEditing ? (
                                    <div className="grid grid-cols-2 gap-2 mt-1">
                                        <input
                                            type="text"
                                            placeholder="First Name"
                                            value={editedProfile.firstName}
                                            onChange={(e) =>
                                                handleChange(
                                                    "firstName",
                                                    e.target.value,
                                                )
                                            }
                                            className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Last Name"
                                            value={editedProfile.lastName}
                                            onChange={(e) =>
                                                handleChange(
                                                    "lastName",
                                                    e.target.value,
                                                )
                                            }
                                            className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                ) : (
                                    <div className="mt-1 text-gray-900">
                                        {profile.firstName} {profile.lastName}
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-600">
                                    Grade/Class
                                </label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={editedProfile.grade}
                                        onChange={(e) =>
                                            handleChange(
                                                "grade",
                                                e.target.value,
                                            )
                                        }
                                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                ) : (
                                    <div className="mt-1 text-gray-900">
                                        {profile.grade}
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-600">
                                    Department
                                </label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={editedProfile.department}
                                        onChange={(e) =>
                                            handleChange(
                                                "department",
                                                e.target.value,
                                            )
                                        }
                                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                ) : (
                                    <div className="mt-1 text-gray-900">
                                        {profile.department}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold border-b pb-2">
                                Contact Information
                            </h2>

                            <div>
                                <label className="block text-sm font-medium text-gray-600">
                                    Phone
                                </label>
                                {isEditing ? (
                                    <input
                                        type="tel"
                                        value={editedProfile.phone || ""}
                                        onChange={(e) =>
                                            handleChange(
                                                "phone",
                                                e.target.value,
                                            )
                                        }
                                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                ) : (
                                    <div className="mt-1 text-gray-900">
                                        {profile.phone || "Not provided"}
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-600">
                                    Address
                                </label>
                                {isEditing ? (
                                    <textarea
                                        value={editedProfile.address || ""}
                                        onChange={(e) =>
                                            handleChange(
                                                "address",
                                                e.target.value,
                                            )
                                        }
                                        rows={3}
                                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                ) : (
                                    <div className="mt-1 text-gray-900">
                                        {profile.address || "Not provided"}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Emergency Contact */}
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold border-b pb-2">
                                Emergency Contact
                            </h2>

                            {profile.emergencyContact && (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600">
                                            Contact Name
                                        </label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={
                                                    editedProfile
                                                        .emergencyContact
                                                        ?.name || ""
                                                }
                                                onChange={(e) =>
                                                    handleEmergencyContactChange(
                                                        "name",
                                                        e.target.value,
                                                    )
                                                }
                                                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        ) : (
                                            <div className="mt-1 text-gray-900">
                                                {profile.emergencyContact.name}
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-600">
                                            Phone
                                        </label>
                                        {isEditing ? (
                                            <input
                                                type="tel"
                                                value={
                                                    editedProfile
                                                        .emergencyContact
                                                        ?.phone || ""
                                                }
                                                onChange={(e) =>
                                                    handleEmergencyContactChange(
                                                        "phone",
                                                        e.target.value,
                                                    )
                                                }
                                                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        ) : (
                                            <div className="mt-1 text-gray-900">
                                                {profile.emergencyContact.phone}
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-600">
                                            Relationship
                                        </label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={
                                                    editedProfile
                                                        .emergencyContact
                                                        ?.relationship || ""
                                                }
                                                onChange={(e) =>
                                                    handleEmergencyContactChange(
                                                        "relationship",
                                                        e.target.value,
                                                    )
                                                }
                                                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        ) : (
                                            <div className="mt-1 text-gray-900">
                                                {
                                                    profile.emergencyContact
                                                        .relationship
                                                }
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* System Information */}
                    <div className="bg-gray-50 rounded-lg p-4">
                        <h2 className="text-lg font-semibold mb-3">
                            System Information
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                                <label className="font-medium text-gray-600">
                                    Enrollment Date
                                </label>
                                <div className="text-gray-900">
                                    {new Date(
                                        profile.enrollmentDate,
                                    ).toLocaleDateString()}
                                </div>
                            </div>
                            <div>
                                <label className="font-medium text-gray-600">
                                    Student ID
                                </label>
                                <div className="text-gray-900 font-mono">
                                    {profile.studentId}
                                </div>
                            </div>
                            <div>
                                <label className="font-medium text-gray-600">
                                    Account Status
                                </label>
                                <div className="text-green-600 font-medium">
                                    Active
                                </div>
                            </div>
                            <div>
                                <label className="font-medium text-gray-600">
                                    User Type
                                </label>
                                <div className="text-gray-900">Student</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

// Example usage
export const ExampleSchoolProfile: React.FC = () => {
    const sampleProfile: StudentProfile = {
        id: "1",
        email: "john.doe@school.edu",
        username: "johndoe2024",
        firstName: "John",
        lastName: "Doe",
        phone: "+1 (555) 123-4567",
        studentId: "STU2024001",
        grade: "10th Grade",
        department: "Science",
        address: "123 Main St, City, State 12345",
        emergencyContact: {
            name: "Jane Doe",
            phone: "+1 (555) 987-6543",
            relationship: "Mother",
        },
        enrollmentDate: "2024-09-01",
    };

    const handleUpdate = (updatedProfile: StudentProfile) => {
        console.log("Updated profile:", updatedProfile);
        // Add your API call here
    };

    const handleDelete = (profileId: string) => {
        console.log("Delete profile:", profileId);
        // Add your delete logic here
        if (window.confirm("Are you sure you want to delete this account?")) {
            // Proceed with deletion
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="container mx-auto px-4">
                <UserViewProfile
                    profile={sampleProfile}
                    onUpdate={handleUpdate}
                    onDelete={handleDelete}
                />
            </div>
        </div>
    );
};

export default UserViewProfile;
