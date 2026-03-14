import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Award, BookOpen, Users, Briefcase, Edit3, Save, X, GraduationCap, Target, TrendingUp } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';

interface FacultyProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  experience: number;
  education: {
    degree: string;
    university: string;
    year: string;
  }[];
  expertise: string[];
  publications: number;
  studentsMentored: number;
  courses: string[];
  officeLocation: string;
  officeHours: string;
  bio: string;
  achievements: string[];
  researchInterests: string[];
  linkedin?: string;
  website?: string;
}

const FacultyProfile: React.FC = () => {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState<FacultyProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<FacultyProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser?.id) return;
    apiService.getFaculty(currentUser.id).then((res) => {
      if (res.success && res.data) {
        const d = res.data;
        const p: FacultyProfile = {
          id: d.id || currentUser.id,
          name: d.name || currentUser.name || 'Faculty',
          email: d.email || currentUser.email || '',
          phone: d.phone || '',
          department: d.department || currentUser.department || '',
          designation: d.designation || 'Faculty',
          experience: d.experience ?? 0,
          education: Array.isArray(d.education) ? d.education : [{ degree: '', university: '', year: '' }],
          expertise: Array.isArray(d.expertise) ? d.expertise : [],
          publications: d.publications ?? 0,
          studentsMentored: d.studentsMentored ?? 0,
          courses: Array.isArray(d.courses) ? d.courses : [],
          officeLocation: d.officeLocation || '',
          officeHours: d.officeHours || '',
          bio: d.bio || '',
          achievements: Array.isArray(d.achievements) ? d.achievements : [],
          researchInterests: Array.isArray(d.researchInterests) ? d.researchInterests : [],
          linkedin: d.linkedin,
          website: d.website
        };
        setProfile(p);
        setEditedProfile(p);
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [currentUser?.id, currentUser?.name, currentUser?.email, currentUser?.department]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedProfile(profile);
  };

  const handleSave = () => {
    if (editedProfile) {
      setProfile(editedProfile);
      setIsEditing(false);
      // In real app, this would save to backend
      alert('Profile updated successfully!');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedProfile(profile);
  };

  const handleInputChange = (field: keyof FacultyProfile, value: any) => {
    if (editedProfile) {
      setEditedProfile({ ...editedProfile, [field]: value });
    }
  };

  const handleEducationChange = (index: number, field: string, value: string) => {
    if (editedProfile) {
      const updatedEducation = [...editedProfile.education];
      updatedEducation[index] = { ...updatedEducation[index], [field]: value };
      setEditedProfile({ ...editedProfile, education: updatedEducation });
    }
  };

  const addEducation = () => {
    if (editedProfile) {
      setEditedProfile({
        ...editedProfile,
        education: [...editedProfile.education, { degree: '', university: '', year: '' }]
      });
    }
  };

  const removeEducation = (index: number) => {
    if (editedProfile) {
      const updatedEducation = editedProfile.education.filter((_, i) => i !== index);
      setEditedProfile({ ...editedProfile, education: updatedEducation });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300">Profile not found</p>
        </div>
      </div>
    );
  }

  const currentProfile = isEditing ? editedProfile : profile;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-8 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
                  <User className="w-12 h-12 text-gray-400" />
                </div>
                <div className="text-white">
                  {isEditing ? (
                    <input
                      type="text"
                      value={currentProfile?.name || ''}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="text-2xl font-bold bg-transparent border-b border-white outline-none"
                    />
                  ) : (
                    <h1 className="text-2xl font-bold">{currentProfile?.name}</h1>
                  )}
                  {isEditing ? (
                    <input
                      type="text"
                      value={currentProfile?.designation || ''}
                      onChange={(e) => handleInputChange('designation', e.target.value)}
                      className="text-lg bg-transparent border-b border-white outline-none mt-1"
                    />
                  ) : (
                    <p className="text-lg opacity-90">{currentProfile?.designation}</p>
                  )}
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="text-sm opacity-80">{currentProfile?.department}</span>
                    <span className="text-sm opacity-80">•</span>
                    <span className="text-sm opacity-80">{currentProfile?.experience} years experience</span>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-2">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSave}
                      className="p-2 bg-white text-blue-500 rounded-full hover:bg-gray-100 transition-colors duration-200"
                    >
                      <Save className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleCancel}
                      className="p-2 bg-white text-red-500 rounded-full hover:bg-gray-100 transition-colors duration-200"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleEdit}
                    className="p-2 bg-white text-blue-500 rounded-full hover:bg-gray-100 transition-colors duration-200"
                  >
                    <Edit3 className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Bio */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    About
                  </h3>
                  {isEditing ? (
                    <textarea
                      value={currentProfile?.bio || ''}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                      rows={4}
                    />
                  ) : (
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {currentProfile?.bio}
                    </p>
                  )}
                </div>

                {/* Education */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-800 dark:text-white flex items-center">
                      <GraduationCap className="w-5 h-5 mr-2" />
                      Education
                    </h3>
                    {isEditing && (
                      <button
                        onClick={addEducation}
                        className="text-blue-500 hover:text-blue-600"
                      >
                        + Add
                      </button>
                    )}
                  </div>
                  <div className="space-y-4">
                    {currentProfile?.education.map((edu, index) => (
                      <div key={index} className="border-l-4 border-blue-500 pl-4">
                        {isEditing ? (
                          <div className="space-y-2">
                            <input
                              type="text"
                              value={edu.degree}
                              onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
                              placeholder="Degree"
                            />
                            <input
                              type="text"
                              value={edu.university}
                              onChange={(e) => handleEducationChange(index, 'university', e.target.value)}
                              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
                              placeholder="University"
                            />
                            <input
                              type="text"
                              value={edu.year}
                              onChange={(e) => handleEducationChange(index, 'year', e.target.value)}
                              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
                              placeholder="Year"
                            />
                            {isEditing && (
                              <button
                                onClick={() => removeEducation(index)}
                                className="text-red-500 hover:text-red-600 text-sm"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                        ) : (
                          <>
                            <h4 className="font-medium text-gray-800 dark:text-white">{edu.degree}</h4>
                            <p className="text-gray-600 dark:text-gray-300">{edu.university}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{edu.year}</p>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Expertise */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                    <Target className="w-5 h-5 mr-2" />
                    Areas of Expertise
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {currentProfile?.expertise.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Research Interests */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Research Interests
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {currentProfile?.researchInterests.map((interest, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 rounded-full text-sm"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Achievements */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                    <Award className="w-5 h-5 mr-2" />
                    Achievements
                  </h3>
                  <ul className="space-y-2">
                    {currentProfile?.achievements.map((achievement, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        <span className="text-gray-700 dark:text-gray-300">{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Contact Info */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-800 dark:text-white mb-4">Contact Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Mail className="w-4 h-4 text-gray-500" />
                      {isEditing ? (
                        <input
                          type="email"
                          value={currentProfile?.email || ''}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
                        />
                      ) : (
                        <span className="text-gray-700 dark:text-gray-300">{currentProfile?.email}</span>
                      )}
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="w-4 h-4 text-gray-500" />
                      {isEditing ? (
                        <input
                          type="tel"
                          value={currentProfile?.phone || ''}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
                        />
                      ) : (
                        <span className="text-gray-700 dark:text-gray-300">{currentProfile?.phone}</span>
                      )}
                    </div>
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-700 dark:text-gray-300">{currentProfile?.officeLocation}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-700 dark:text-gray-300">{currentProfile?.officeHours}</span>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-800 dark:text-white mb-4">Statistics</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <BookOpen className="w-4 h-4 text-blue-500" />
                        <span className="text-gray-700 dark:text-gray-300">Publications</span>
                      </div>
                      <span className="font-semibold text-gray-800 dark:text-white">{currentProfile?.publications}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-green-500" />
                        <span className="text-gray-700 dark:text-gray-300">Students Mentored</span>
                      </div>
                      <span className="font-semibold text-gray-800 dark:text-white">{currentProfile?.studentsMentored}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Briefcase className="w-4 h-4 text-purple-500" />
                        <span className="text-gray-700 dark:text-gray-300">Experience</span>
                      </div>
                      <span className="font-semibold text-gray-800 dark:text-white">{currentProfile?.experience} years</span>
                    </div>
                  </div>
                </div>

                {/* Courses */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-800 dark:text-white mb-4">Courses Taught</h3>
                  <div className="space-y-2">
                    {currentProfile?.courses.map((course, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-gray-700 dark:text-gray-300 text-sm">{course}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Social Links */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-800 dark:text-white mb-4">Connect</h3>
                  <div className="space-y-2">
                    {currentProfile?.linkedin && (
                      <a
                        href={currentProfile.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-600 text-sm"
                      >
                        LinkedIn Profile
                      </a>
                    )}
                    {currentProfile?.website && (
                      <a
                        href={currentProfile.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-600 text-sm"
                      >
                        Personal Website
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyProfile;
