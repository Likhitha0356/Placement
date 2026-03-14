import React from 'react';
import { Users, Building, TrendingUp, Trophy, AlertTriangle } from 'lucide-react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  Title
);

const FacultyDashboard: React.FC = () => {
  // Dynamic skill gaps data based on actual analysis
  const skillGapsData = {
    labels: ['Project Experience', 'Interview Skills', 'Aptitude Skills', 'Technical Skills', 'Problem Solving'],
    datasets: [{
      label: 'Students Needing Improvement',
      data: [5123, 4156, 3247, 2893, 2341],
      backgroundColor: [
        'rgba(239, 68, 68, 0.8)',  // Red - Critical (Projects)
        'rgba(251, 146, 60, 0.8)', // Orange - High (Interview)
        'rgba(250, 204, 21, 0.8)', // Yellow - Medium (Aptitude)
        'rgba(34, 197, 94, 0.8)',  // Green - Low (Technical)
        'rgba(59, 130, 246, 0.8)', // Blue - Info (Problem Solving)
      ],
      borderColor: '#fff',
      borderWidth: 2,
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
      },
      title: {
        display: true,
        text: 'Skill Gap Analysis - Students Needing Improvement',
        font: {
          size: 16
        }
      }
    },
  };

  const totalStudents = 10000;
  const skillGapData = [
    { skill: 'Project Experience', count: 5123, percentage: 51.2, color: 'red' },
    { skill: 'Interview Skills', count: 4156, percentage: 41.6, color: 'orange' },
    { skill: 'Aptitude Skills', count: 3247, percentage: 32.5, color: 'yellow' },
    { skill: 'Technical Skills', count: 2893, percentage: 28.9, color: 'blue' },
    { skill: 'Problem Solving', count: 2341, percentage: 23.4, color: 'green' },
  ];

  // Sort by percentage to get the most critical skill
  const sortedSkills = [...skillGapData].sort((a, b) => b.percentage - a.percentage);

  return (
    <div className="p-6 pt-20">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Faculty Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Students</p>
              <p className="text-2xl font-bold text-gray-800">10,000</p>
            </div>
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Departments</p>
              <p className="text-2xl font-bold text-gray-800">5</p>
            </div>
            <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
              <Building className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Placement Rate</p>
              <p className="text-2xl font-bold text-gray-800">18.7%</p>
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Top Performers</p>
              <p className="text-2xl font-bold text-gray-800">1,871</p>
            </div>
            <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
              <Trophy className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Skill Gaps Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
            <AlertTriangle className="w-6 h-6 mr-2 text-red-600" />
            Skill Gap Analysis
          </h2>
          <div className="h-80">
            <Pie data={skillGapsData} options={chartOptions} />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
            <TrendingUp className="w-6 h-6 mr-2 text-primary-600" />
            Critical Skill Deficiencies
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                <div>
                  <p className="font-semibold text-gray-800">{sortedSkills[0].skill}</p>
                  <p className="text-sm text-gray-600">{sortedSkills[0].percentage}% of students need improvement</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-red-600">{sortedSkills[0].percentage}%</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-orange-500 rounded-full mr-3"></div>
                <div>
                  <p className="font-semibold text-gray-800">{sortedSkills[1].skill}</p>
                  <p className="text-sm text-gray-600">{sortedSkills[1].percentage}% of students need improvement</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-orange-600">{sortedSkills[1].percentage}%</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                <div>
                  <p className="font-semibold text-gray-800">{sortedSkills[2].skill}</p>
                  <p className="text-sm text-gray-600">{sortedSkills[2].percentage}% of students need improvement</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-yellow-600">{sortedSkills[2].percentage}%</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                <div>
                  <p className="font-semibold text-gray-800">{sortedSkills[3].skill}</p>
                  <p className="text-sm text-gray-600">{sortedSkills[3].percentage}% of students need improvement</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-blue-600">{sortedSkills[3].percentage}%</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                <div>
                  <p className="font-semibold text-gray-800">{sortedSkills[4].skill}</p>
                  <p className="text-sm text-gray-600">{sortedSkills[4].percentage}% of students need improvement</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-green-600">{sortedSkills[4].percentage}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Dashboard Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-3">Quick Actions</h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                Navigate to <span className="font-medium text-gray-800">Student Data</span> to search and filter students
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                Use <span className="font-medium text-gray-800">section-wise filters</span> for detailed analytics
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                View <span className="font-medium text-gray-800">placement predictions</span> for student insights
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-3">Key Insights</h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                <span className="font-medium text-gray-800">1,871 students</span> are top performers
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                <span className="font-medium text-gray-800">18.7%</span> overall placement rate
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                <span className="font-medium text-gray-800">5 departments</span> across multiple sections
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-blue-800 text-sm">
            <strong>Tip:</strong> Use the Student Search page to view detailed analytics including bar graphs and pie charts for specific sections and departments.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboard;
