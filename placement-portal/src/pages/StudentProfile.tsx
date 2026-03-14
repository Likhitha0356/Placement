import React, { useState, useEffect } from 'react';
import { User, Mail, BookOpen, Target, Award, BarChart3, TrendingUp, Briefcase, GraduationCap } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';

interface StudentData {
  name: string;
  rollNo?: string;
  dept: string;
  section: string;
  aptitudeScore: number;
  mockInterviewScore: number;
  problemsSolved: number;
  hackathonCount: number;
  technicalTestScore: number;
  resumeScore: number;
  projectsCount: number;
  placementReadiness: string;
  placementProbabilities: number;
}

const StudentProfile: React.FC = () => {
  const { currentUser } = useAuth();
  const [data, setData] = useState<StudentData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser?.id) return;
    apiService.getStudent(currentUser.id).then((res) => {
      if (res.success && res.data) {
        const d = res.data;
        setData({
          name: d.name || currentUser.name || 'Student',
          rollNo: d.rollNo || currentUser.id,
          dept: d.dept || currentUser.department || '',
          section: d.section || '',
          aptitudeScore: d.aptitudeScore ?? 0,
          mockInterviewScore: d.mockInterviewScore ?? 0,
          problemsSolved: d.problemsSolved ?? 0,
          hackathonCount: d.hackathonCount ?? 0,
          technicalTestScore: d.technicalTestScore ?? 0,
          resumeScore: d.resumeScore ?? 0,
          projectsCount: d.projectsCount ?? 0,
          placementReadiness: d.placementReadiness || 'Not Ready',
          placementProbabilities: typeof d.placementProbabilities === 'number' ? d.placementProbabilities : 0
        });
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [currentUser?.id, currentUser?.name, currentUser?.department]);

  const getReadinessColor = (r: string) => {
    if (r === 'High' || r === 'Ready') return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300';
    if (r === 'Medium') return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300';
    return 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-300';
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
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

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300">Profile not found. Your data may not be in the system yet.</p>
        </div>
      </div>
    );
  }

  const overallScore = Math.round(
    data.aptitudeScore * 0.15 +
    data.mockInterviewScore * 0.2 +
    data.technicalTestScore * 0.2 +
    data.resumeScore * 0.1 +
    Math.min(data.problemsSolved * 2, 100) * 0.15 +
    Math.min(data.hackathonCount * 20, 100) * 0.1 +
    Math.min(data.projectsCount * 25, 100) * 0.1
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl">
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-8 rounded-t-2xl">
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
                <GraduationCap className="w-12 h-12 text-gray-400" />
              </div>
              <div className="text-white">
                <h1 className="text-2xl font-bold">{data.name}</h1>
                <p className="text-lg opacity-90">Student • {data.dept} - Section {data.section}</p>
                {data.rollNo && <p className="text-sm opacity-80 mt-1">Reg. No. {data.rollNo}</p>}
                <div className="flex items-center gap-3 mt-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getReadinessColor(data.placementReadiness)}`}>
                    {data.placementReadiness} Readiness
                  </span>
                  <span className="text-sm opacity-90">
                    Placement probability: {typeof data.placementProbabilities === 'number' ? Math.round(data.placementProbabilities * 100) : 0}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8">
            <h3 className="font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Scores & Metrics
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Aptitude', value: data.aptitudeScore, icon: BookOpen },
                { label: 'Technical Test', value: data.technicalTestScore, icon: Target },
                { label: 'Mock Interview', value: data.mockInterviewScore, icon: Award },
                { label: 'Resume', value: data.resumeScore, icon: Briefcase },
                { label: 'Problems Solved', value: data.problemsSolved, icon: TrendingUp },
                { label: 'Hackathons', value: data.hackathonCount, icon: Award },
                { label: 'Projects', value: data.projectsCount, icon: Briefcase },
                { label: 'Overall', value: overallScore, icon: BarChart3 }
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <Icon className="w-5 h-5 text-blue-500" />
                    <span className={`font-bold ${typeof value === 'number' ? getScoreColor(value) : ''}`}>
                      {typeof value === 'number' ? value : value}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{label}</p>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Use the <strong>Resume Analyzer</strong> to improve your ATS score, <strong>Mock Interview</strong> for practice, and <strong>Company Eligibility</strong> & <strong>Role Prediction</strong> to see matches based on your profile and interview performance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
