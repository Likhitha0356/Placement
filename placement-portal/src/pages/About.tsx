import React from 'react';
import { Users, Award, Target, BookOpen, Mail, Phone, MapPin } from 'lucide-react';

const About: React.FC = () => {
  const teamMembers = [
    {
      name: "Dr. Sarah Johnson",
      role: "Placement Director",
      description: "15+ years of experience in career guidance and placement management",
      avatar: "SJ"
    },
    {
      name: "Prof. Michael Chen",
      role: "Technical Training Lead",
      description: "Expert in DSA and interview preparation with industry background",
      avatar: "MC"
    },
    {
      name: "Dr. Emily Rodriguez",
      role: "Student Development Coordinator",
      description: "Specializes in aptitude training and soft skills development",
      avatar: "ER"
    },
    {
      name: "James Wilson",
      role: "Industry Relations Manager",
      description: "Builds connections with top companies for campus placements",
      avatar: "JW"
    }
  ];

  const stats = [
    { icon: Users, label: "Students Trained", value: "10,000+" },
    { icon: Award, label: "Companies Partnered", value: "200+" },
    { icon: Target, label: "Success Rate", value: "85%" },
    { icon: BookOpen, label: "Training Programs", value: "50+" }
  ];

  return (
    <div className="p-6 pt-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">About Placement Portal</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Empowering students with comprehensive placement training, real-time progress tracking, and personalized recommendations to achieve their career goals.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{stat.value}</h3>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* Mission Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Our Mission</h2>
            <p className="text-gray-600 mb-4">
              To bridge the gap between academic excellence and industry requirements by providing comprehensive placement training and career guidance.
            </p>
            <p className="text-gray-600 mb-4">
              We focus on developing technical skills, aptitude, and soft skills through personalized learning paths and real-time progress tracking.
            </p>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start">
                <span className="text-primary-600 mr-2">•</span>
                Comprehensive skill assessment and training
              </li>
              <li className="flex items-start">
                <span className="text-primary-600 mr-2">•</span>
                Personalized learning recommendations
              </li>
              <li className="flex items-start">
                <span className="text-primary-600 mr-2">•</span>
                Real-time progress tracking
              </li>
              <li className="flex items-start">
                <span className="text-primary-600 mr-2">•</span>
                Industry-relevant curriculum
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Our Vision</h2>
            <p className="text-gray-600 mb-4">
              To become the leading placement training platform that transforms students into industry-ready professionals.
            </p>
            <p className="text-gray-600 mb-4">
              We envision a future where every student has access to quality placement training and achieves their dream career.
            </p>
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">Excellence</h4>
                <p className="text-sm text-gray-600">Quality training and mentorship</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">Innovation</h4>
                <p className="text-sm text-gray-600">Modern teaching methods</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">Integrity</h4>
                <p className="text-sm text-gray-600">Transparent and ethical practices</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">Impact</h4>
                <p className="text-sm text-gray-600">Creating career opportunities</p>
              </div>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-200">
                <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">{member.avatar}</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{member.name}</h3>
                <p className="text-primary-600 font-medium mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm">{member.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">Platform Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Skill Assessment</h3>
              <p className="text-gray-600">Comprehensive evaluation of technical and soft skills</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Learning Resources</h3>
              <p className="text-gray-600">Curated YouTube playlists and study materials</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Progress Tracking</h3>
              <p className="text-gray-600">Real-time monitoring of student progress</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Personalized Guidance</h3>
              <p className="text-gray-600">Tailored recommendations based on performance</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Mock Interviews</h3>
              <p className="text-gray-600">Practice sessions with expert feedback</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Placement Analytics</h3>
              <p className="text-gray-600">Data-driven insights for improvement</p>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl shadow-lg p-8 text-white">
          <h2 className="text-3xl font-bold text-center mb-8">Get in Touch</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <Mail className="w-8 h-8 mb-3" />
              <h3 className="font-semibold mb-2">Email</h3>
              <p>placements@college.edu</p>
            </div>
            <div className="flex flex-col items-center">
              <Phone className="w-8 h-8 mb-3" />
              <h3 className="font-semibold mb-2">Phone</h3>
              <p>+91 12345 67890</p>
            </div>
            <div className="flex flex-col items-center">
              <MapPin className="w-8 h-8 mb-3" />
              <h3 className="font-semibold mb-2">Address</h3>
              <p>Placement Cell, Engineering College</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
