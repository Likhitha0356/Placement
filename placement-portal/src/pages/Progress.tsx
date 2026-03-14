import React, { useState } from 'react';
import { TrendingUp, Target, Award, Calendar, BarChart3, Activity } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
} from 'chart.js';
import { Line as ChartLine, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement
);

interface ProgressData {
  week: number;
  aptitude: number;
  technical: number;
  interview: number;
  overall: number;
}

const Progress: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [studentData, setStudentData] = useState({
    name: 'John Doe',
    registerNumber: '21CS001',
    department: 'CSE',
    section: 'A',
    aptitudeScore: 75,
    technicalTestScore: 82,
    mockInterviewScore: 78,
    resumeScore: 85,
    projectsCount: 3,
    problemsSolved: 45,
    overallProgress: 80,
  });

  // Sample progress data over 12 weeks
  const progressHistory: ProgressData[] = [
    { week: 1, aptitude: 45, technical: 50, interview: 40, overall: 45 },
    { week: 2, aptitude: 48, technical: 52, interview: 43, overall: 48 },
    { week: 3, aptitude: 52, technical: 55, interview: 47, overall: 51 },
    { week: 4, aptitude: 55, technical: 58, interview: 50, overall: 54 },
    { week: 5, aptitude: 58, technical: 61, interview: 53, overall: 57 },
    { week: 6, aptitude: 62, technical: 64, interview: 57, overall: 61 },
    { week: 7, aptitude: 65, technical: 67, interview: 60, overall: 64 },
    { week: 8, aptitude: 68, technical: 70, interview: 63, overall: 67 },
    { week: 9, aptitude: 71, technical: 73, interview: 67, overall: 70 },
    { week: 10, aptitude: 74, technical: 76, interview: 70, overall: 73 },
    { week: 11, aptitude: 77, technical: 79, interview: 74, overall: 77 },
    { week: 12, aptitude: 80, technical: 82, interview: 78, overall: 80 },
  ];

  const lineChartData = {
    labels: progressHistory.map(data => `Week ${data.week}`),
    datasets: [
      {
        label: 'Aptitude',
        data: progressHistory.map(data => data.aptitude),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Technical',
        data: progressHistory.map(data => data.technical),
        borderColor: 'rgb(168, 85, 247)',
        backgroundColor: 'rgba(168, 85, 247, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Interview',
        data: progressHistory.map(data => data.interview),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Overall',
        data: progressHistory.map(data => data.overall),
        borderColor: 'rgb(251, 146, 60)',
        backgroundColor: 'rgba(251, 146, 60, 0.1)',
        tension: 0.4,
        borderWidth: 3,
      },
    ],
  };

  const barChartData = {
    labels: ['Aptitude', 'Technical', 'Interview', 'Resume', 'Projects'],
    datasets: [
      {
        label: 'Current Score',
        data: [
          studentData.aptitudeScore,
          studentData.technicalTestScore,
          studentData.mockInterviewScore,
          studentData.resumeScore,
          Math.min(studentData.projectsCount * 25, 100),
        ],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(251, 146, 60, 0.8)',
          'rgba(236, 72, 153, 0.8)',
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(168, 85, 247)',
          'rgb(34, 197, 94)',
          'rgb(251, 146, 60)',
          'rgb(236, 72, 153)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
  };

  const milestones = [
    { week: 4, title: 'Foundation Complete', description: 'Completed basic concepts and fundamentals' },
    { week: 8, title: 'Intermediate Level', description: 'Achieved intermediate proficiency in all areas' },
    { week: 12, title: 'Advanced Ready', description: 'Ready for placement interviews' },
  ];

  const achievements = [
    { icon: Award, title: 'Fast Learner', description: 'Improved by 15% in 4 weeks', earned: true },
    { icon: Target, title: 'Consistent Performer', description: 'Maintained >70% score for 6 weeks', earned: true },
    { icon: TrendingUp, title: 'Perfect Week', description: 'Scored 90%+ in all areas', earned: false },
    { icon: BarChart3, title: 'All Rounder', description: 'Scored >80% in all categories', earned: false },
  ];

  if (loading) {
    return (
      <div className="p-6 pt-20">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 pt-20">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">My Progress</h1>
        
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-sm text-green-600 font-medium">+12%</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800">{studentData.overallProgress}%</h3>
            <p className="text-gray-600">Overall Progress</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Target className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-sm text-green-600 font-medium">+8%</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800">{studentData.aptitudeScore}%</h3>
            <p className="text-gray-600">Aptitude Score</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Award className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-sm text-green-600 font-medium">+15%</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800">{studentData.technicalTestScore}%</h3>
            <p className="text-gray-600">Technical Skills</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
              <span className="text-sm text-gray-600 font-medium">12 weeks</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800">Active</h3>
            <p className="text-gray-600">Training Period</p>
          </div>
        </div>

        {/* Progress Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <Activity className="w-6 h-6 mr-2 text-primary-600" />
              Progress Over Time
            </h2>
            <div className="h-80">
              <ChartLine data={lineChartData} options={chartOptions} />
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <BarChart3 className="w-6 h-6 mr-2 text-primary-600" />
              Current Performance
            </h2>
            <div className="h-80">
              <Bar data={barChartData} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* Milestones */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
            <Target className="w-6 h-6 mr-2 text-primary-600" />
            Learning Milestones
          </h2>
          <div className="space-y-4">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex items-center p-4 border border-gray-200 rounded-lg">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-green-600 font-bold">W{milestone.week}</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{milestone.title}</h3>
                  <p className="text-gray-600">{milestone.description}</p>
                </div>
                <div className={`w-6 h-6 rounded-full ${progressHistory[progressHistory.length - 1].week >= milestone.week ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
            <Award className="w-6 h-6 mr-2 text-primary-600" />
            Achievements
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {achievements.map((achievement, index) => {
              const Icon = achievement.icon;
              return (
                <div
                  key={index}
                  className={`text-center p-6 rounded-lg border-2 transition-all duration-200 ${
                    achievement.earned
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 bg-gray-50 opacity-50'
                  }`}
                >
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                    achievement.earned ? 'bg-green-500' : 'bg-gray-300'
                  }`}>
                    <Icon className={`w-8 h-8 ${achievement.earned ? 'text-white' : 'text-gray-500'}`} />
                  </div>
                  <h3 className={`font-semibold mb-2 ${achievement.earned ? 'text-gray-800' : 'text-gray-500'}`}>
                    {achievement.title}
                  </h3>
                  <p className={`text-sm ${achievement.earned ? 'text-gray-600' : 'text-gray-400'}`}>
                    {achievement.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Progress;
