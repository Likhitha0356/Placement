import React, { useState, useEffect } from 'react';
import { BookOpen, User, Target, Play, Youtube, ExternalLink, TrendingUp } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from 'chart.js';
import { Radar, Bar, Line } from 'react-chartjs-2';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

const StudentDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const [studentData, setStudentData] = useState({
    name: 'Loading...',
    registerNumber: '',
    department: '',
    section: '',
    overallProgress: 0,
    aptitudeScore: 0,
    mockInterviewScore: 0,
    problemsSolved: 0,
    hackathonCount: 0,
    technicalTestScore: 0,
    resumeScore: 0,
    projectsCount: 0,
    placementReadiness: '',
    placementProbabilities: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStudentData = async () => {
      if (!currentUser?.id) return;

      try {
        const response = await apiService.getStudent(currentUser.id);
        if (response.success) {
          const student = response.data;
          setStudentData({
            name: student.name || 'Student User',
            registerNumber: student.rollNo || currentUser.id,
            department: student.dept || 'Computer Science',
            section: student.section || 'A',
            overallProgress: Math.round((student.placementProbabilities || 0.55) * 100),
            aptitudeScore: student.aptitudeScore || 65,
            mockInterviewScore: student.mockInterviewScore || 92,
            problemsSolved: student.problemsSolved || 96,
            hackathonCount: student.hackathonCount || 5,
            technicalTestScore: student.technicalTestScore || 48,
            resumeScore: student.resumeScore || 40,
            projectsCount: student.projectsCount || 5,
            placementReadiness: student.placementReadiness || 'Not Ready',
            placementProbabilities: student.placementProbabilities || 0.55
          });
        } else {
          // Use fallback data
          setStudentData({
            name: 'Student User',
            registerNumber: currentUser.id,
            department: 'Computer Science',
            section: 'A',
            overallProgress: 55,
            aptitudeScore: 65,
            mockInterviewScore: 92,
            problemsSolved: 96,
            hackathonCount: 5,
            technicalTestScore: 48,
            resumeScore: 40,
            projectsCount: 5,
            placementReadiness: 'Not Ready',
            placementProbabilities: 0.55
          });
        }
      } catch (error) {
        console.error('Error loading student data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStudentData();
  }, [currentUser]);

  const skillData = {
    labels: ['Aptitude', 'Technical', 'Communication', 'Projects', 'Interview'],
    datasets: [
      {
        label: 'Current Skills',
        data: [
          studentData.aptitudeScore,
          studentData.technicalTestScore,
          Math.round((studentData.mockInterviewScore + studentData.resumeScore) / 2),
          Math.min(studentData.projectsCount * 25, 100),
          studentData.mockInterviewScore
        ],
        backgroundColor: 'rgba(102, 126, 234, 0.2)',
        borderColor: 'rgba(102, 126, 234, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(102, 126, 234, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(102, 126, 234, 1)'
      }
    ]
  };

  const progressData = {
    labels: ['Month 1', 'Month 2', 'Month 3', 'Month 4', 'Month 5', 'Month 6'],
    datasets: [
      {
        label: 'Placement Readiness',
        data: [
          Math.max(20, studentData.overallProgress - 55),
          Math.max(30, studentData.overallProgress - 45),
          Math.max(40, studentData.overallProgress - 35),
          Math.max(50, studentData.overallProgress - 25),
          Math.max(60, studentData.overallProgress - 15),
          studentData.overallProgress
        ],
        backgroundColor: 'rgba(102, 126, 234, 0.2)',
        borderColor: 'rgba(102, 126, 234, 1)',
        borderWidth: 2,
        tension: 0.4,
        fill: true
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        beginAtZero: true,
        max: 100
      }
    },
    plugins: {
      legend: {
        display: false
      }
    }
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 100
      }
    },
    plugins: {
      legend: {
        display: false
      }
    }
  };

  const youtubePlaylists = [
    {
      title: "Data Structures & Algorithms",
      description: "Complete DSA course for placements",
      channel: "Programming with Mosh",
      priority: studentData.technicalTestScore < 60 ? "High" : studentData.technicalTestScore < 80 ? "Medium" : "Low",
      icon: Play,
      playlistId: "PL_c9B4zLjBRm4A0k2s9mP5I7yI0l5y3XQZ"
    },
    {
      title: "Aptitude & Reasoning",
      description: "Quantitative aptitude mastery",
      channel: "CareerRide",
      priority: studentData.aptitudeScore < 60 ? "High" : studentData.aptitudeScore < 80 ? "Medium" : "Low",
      icon: Play,
      playlistId: "PLhI_oi7G9q9XqB2YcQgS4qL9Q5g5z5QZQ"
    },
    {
      title: "Interview Preparation",
      description: "Technical interview questions & answers",
      channel: "Knowledge Gate",
      priority: studentData.mockInterviewScore < 60 ? "High" : studentData.mockInterviewScore < 80 ? "Medium" : "Low",
      icon: Play,
      playlistId: "PLDo8Ofma4qXqIQcU7IYlRqk4b3x5v5Y5Y"
    },
    {
      title: "Development Projects",
      description: "Build impressive portfolio projects",
      channel: "Traversy Media",
      priority: studentData.projectsCount < 2 ? "High" : studentData.projectsCount < 4 ? "Medium" : "Low",
      icon: Play,
      playlistId: "PLillR-RASN5v7U-N4-3Z4T5hJQ9IBaH7X"
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'text-red-600 bg-red-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="p-6 pt-20">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Student Dashboard</h1>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <>
      
      {/* Personal Information Card */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
          <User className="w-6 h-6 mr-2 text-primary-600" />
          Personal Information
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <p className="text-sm text-gray-500 mb-1">Register Number</p>
            <p className="font-semibold text-gray-800">{studentData.registerNumber}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Name</p>
            <p className="font-semibold text-gray-800">{studentData.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Department</p>
            <p className="font-semibold text-gray-800">{studentData.department}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Section</p>
            <p className="font-semibold text-gray-800">{studentData.section}</p>
          </div>
        </div>
        
        <div className="mt-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Overall Progress</span>
            <span className="text-sm font-medium text-gray-700">{studentData.overallProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-primary-500 to-secondary-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${studentData.overallProgress}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-1">{studentData.overallProgress}% Complete - {studentData.overallProgress >= 70 ? 'Great progress!' : studentData.overallProgress >= 50 ? 'Keep going!' : 'More effort needed!'}</p>
        </div>
      </div>

      {/* Progress Rings Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
            <Target className="w-6 h-6 mr-2 text-primary-600" />
            Skill Assessment
          </h2>
          <div className="h-80">
            <Radar data={skillData} options={chartOptions} />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
            <TrendingUp className="w-6 h-6 mr-2 text-primary-600" />
            Progress Over Time
          </h2>
          <div className="h-80">
            <Line data={progressData} options={lineOptions} />
          </div>
        </div>
      </div>

      {/* Progress Rings */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
          <Target className="w-6 h-6 mr-2 text-primary-600" />
          Skill Progress
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {[
            { name: 'Aptitude', score: studentData.aptitudeScore, color: 'from-blue-400 to-blue-600' },
            { name: 'Interview', score: studentData.mockInterviewScore, color: 'from-green-400 to-green-600' },
            { name: 'Technical', score: studentData.technicalTestScore, color: 'from-purple-400 to-purple-600' },
            { name: 'Resume', score: studentData.resumeScore, color: 'from-yellow-400 to-yellow-600' },
            { name: 'Projects', score: Math.min(studentData.projectsCount * 25, 100), color: 'from-pink-400 to-pink-600' }
          ].map((skill, index) => (
            <div key={index} className="text-center">
              <div className="relative w-20 h-20 mx-auto mb-3">
                <svg className="w-20 h-20 transform -rotate-90">
                  <circle
                    cx="40"
                    cy="40"
                    r="36"
                    stroke="#e5e7eb"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="36"
                    stroke="url(#gradient-${index})"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 36}`}
                    strokeDashoffset={`${2 * Math.PI * 36 * (1 - skill.score / 100)}`}
                    className="transition-all duration-1000 ease-out"
                  />
                  <defs>
                    <linearGradient id={`gradient-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#1d4ed8" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-bold text-gray-800">{skill.score}%</span>
                </div>
              </div>
              <p className="text-sm font-medium text-gray-700">{skill.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* YouTube Playlists */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
          <Youtube className="w-6 h-6 mr-2 text-primary-600" />
          Recommended Learning Playlists
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {youtubePlaylists.map((playlist, index) => {
            const Icon = playlist.icon;
            return (
              <div key={index} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(playlist.priority)}`}>
                    {playlist.priority}
                  </span>
                </div>
                
                <h3 className="font-semibold text-gray-800 mb-2">{playlist.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{playlist.description}</p>
                
                <div className="flex items-center text-xs text-gray-500 mb-3">
                  <Youtube className="w-3 h-3 mr-1" />
                  <span>{playlist.channel}</span>
                </div>
                
                <button 
                  onClick={() => window.open(`https://www.youtube.com/playlist?list=${playlist.playlistId}`, '_blank')}
                  className="w-full bg-red-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors duration-200 flex items-center justify-center"
                >
                  <ExternalLink className="w-3 h-3 mr-1" />
                  View Playlist
                </button>
              </div>
            );
          })}
        </div>
      </div>
        </>
      )}
    </div>
  );
};

export default StudentDashboard;
