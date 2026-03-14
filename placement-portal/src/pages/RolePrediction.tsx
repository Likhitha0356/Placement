import React, { useState, useEffect } from 'react';
import { Target, Brain, TrendingUp, Award, Briefcase, Star, BarChart3, Users, Clock, CheckCircle, AlertCircle, Download, Eye, ArrowRight, DollarSign, X } from 'lucide-react';

interface RolePrediction {
  role: string;
  company: string;
  probability: number;
  matchScore: number;
  skills: {
    matching: string[];
    missing: string[];
    improving: string[];
  };
  salary: {
    min: number;
    max: number;
    currency: string;
  };
  growth: string;
  description: string;
  responsibilities: string[];
  requirements: {
    education: string;
    experience: string;
    skills: string[];
  };
  careerPath: string[];
  interviewScore?: number;
  mockInterviewPerformance?: {
    technical: number;
    communication: number;
    confidence: number;
    problemSolving: number;
  };
}

const MOCK_INTERVIEW_STORAGE_KEY = 'placement_mock_interview_result';

const RolePrediction: React.FC = () => {
  const [predictions, setPredictions] = useState<RolePrediction[]>([]);
  const [selectedRole, setSelectedRole] = useState<RolePrediction | null>(null);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('probability');
  const [showDetailed, setShowDetailed] = useState(false);
  const [mockInterviewData, setMockInterviewData] = useState<{ overallScore?: number; confidence?: number } | null>(null);

  // Sample role predictions based on mock interview performance
  const samplePredictions: RolePrediction[] = [
    {
      role: 'Full Stack Developer',
      company: 'TechCorp Solutions',
      probability: 92,
      matchScore: 88,
      skills: {
        matching: ['JavaScript', 'React', 'Node.js', 'HTML/CSS'],
        missing: ['GraphQL', 'TypeScript'],
        improving: ['Database Design', 'API Development']
      },
      salary: {
        min: 800000,
        max: 1200000,
        currency: 'INR'
      },
      growth: 'High',
      description: 'Develop both frontend and backend applications, working with modern web technologies.',
      responsibilities: [
        'Design and develop responsive web applications',
        'Create RESTful APIs and microservices',
        'Optimize application performance',
        'Collaborate with cross-functional teams'
      ],
      requirements: {
        education: 'B.E./B.Tech in Computer Science',
        experience: '0-2 years',
        skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Git']
      },
      careerPath: ['Junior Developer', 'Full Stack Developer', 'Senior Developer', 'Tech Lead'],
      interviewScore: 85,
      mockInterviewPerformance: {
        technical: 88,
        communication: 82,
        confidence: 85,
        problemSolving: 86
      }
    },
    {
      role: 'Data Scientist',
      company: 'DataMinds Analytics',
      probability: 78,
      matchScore: 75,
      skills: {
        matching: ['Python', 'Machine Learning', 'SQL'],
        missing: ['Deep Learning', 'NLP'],
        improving: ['Data Visualization', 'Statistical Analysis']
      },
      salary: {
        min: 1000000,
        max: 1500000,
        currency: 'INR'
      },
      growth: 'Very High',
      description: 'Analyze complex data sets to extract insights and build predictive models.',
      responsibilities: [
        'Develop machine learning models',
        'Analyze large datasets',
        'Create data visualizations and reports',
        'Collaborate with business stakeholders'
      ],
      requirements: {
        education: 'M.S./M.Tech in Data Science or related field',
        experience: '1-3 years',
        skills: ['Python', 'Machine Learning', 'SQL', 'Statistics', 'Data Visualization']
      },
      careerPath: ['Data Analyst', 'Data Scientist', 'Senior Data Scientist', 'Lead Data Scientist'],
      interviewScore: 76,
      mockInterviewPerformance: {
        technical: 78,
        communication: 74,
        confidence: 72,
        problemSolving: 80
      }
    },
    {
      role: 'Cloud Engineer',
      company: 'CloudTech Systems',
      probability: 65,
      matchScore: 58,
      skills: {
        matching: ['Linux', 'Networking Basics'],
        missing: ['AWS', 'Docker', 'Kubernetes', 'Terraform'],
        improving: ['System Administration', 'Scripting']
      },
      salary: {
        min: 900000,
        max: 1300000,
        currency: 'INR'
      },
      growth: 'High',
      description: 'Design, implement, and maintain cloud infrastructure and deployment pipelines.',
      responsibilities: [
        'Manage cloud infrastructure',
        'Implement CI/CD pipelines',
        'Monitor system performance',
        'Ensure security and compliance'
      ],
      requirements: {
        education: 'B.E./B.Tech in Computer Science or IT',
        experience: '0-2 years',
        skills: ['AWS', 'Docker', 'Kubernetes', 'Linux', 'Networking']
      },
      careerPath: ['Junior Cloud Engineer', 'Cloud Engineer', 'Senior Cloud Engineer', 'Cloud Architect'],
      interviewScore: 62,
      mockInterviewPerformance: {
        technical: 60,
        communication: 68,
        confidence: 65,
        problemSolving: 55
      }
    },
    {
      role: 'Frontend Developer',
      company: 'FinTech Innovations',
      probability: 88,
      matchScore: 85,
      skills: {
        matching: ['JavaScript', 'React', 'HTML/CSS', 'UI/UX Basics'],
        missing: ['Redux', 'Next.js'],
        improving: ['Performance Optimization', 'Testing']
      },
      salary: {
        min: 700000,
        max: 1000000,
        currency: 'INR'
      },
      growth: 'High',
      description: 'Create engaging user interfaces and responsive web applications.',
      responsibilities: [
        'Develop responsive web interfaces',
        'Implement UI/UX designs',
        'Optimize application performance',
        'Collaborate with design teams'
      ],
      requirements: {
        education: 'B.E./B.Tech in Computer Science',
        experience: '0-2 years',
        skills: ['JavaScript', 'React', 'HTML/CSS', 'UI/UX', 'Git']
      },
      careerPath: ['Junior Frontend Developer', 'Frontend Developer', 'Senior Frontend Developer', 'UI Architect'],
      interviewScore: 82,
      mockInterviewPerformance: {
        technical: 85,
        communication: 80,
        confidence: 78,
        problemSolving: 85
      }
    },
    {
      role: 'AI Engineer',
      company: 'AI Robotics Lab',
      probability: 72,
      matchScore: 68,
      skills: {
        matching: ['Python', 'TensorFlow', 'Machine Learning'],
        missing: ['Computer Vision', 'Robotics', 'PyTorch'],
        improving: ['Deep Learning', 'Model Optimization']
      },
      salary: {
        min: 1100000,
        max: 1600000,
        currency: 'INR'
      },
      growth: 'Very High',
      description: 'Develop AI and machine learning models for robotics and automation.',
      responsibilities: [
        'Design AI models for robotics',
        'Implement computer vision algorithms',
        'Optimize model performance',
        'Research new AI techniques'
      ],
      requirements: {
        education: 'M.S./M.Tech in AI/ML or related field',
        experience: '1-3 years',
        skills: ['Python', 'TensorFlow', 'Computer Vision', 'Robotics', 'Deep Learning']
      },
      careerPath: ['AI Engineer', 'Senior AI Engineer', 'AI Researcher', 'AI Team Lead'],
      interviewScore: 70,
      mockInterviewPerformance: {
        technical: 72,
        communication: 68,
        confidence: 70,
        problemSolving: 70
      }
    }
  ];

  const sortOptions = [
    { value: 'probability', label: 'Match Probability' },
    { value: 'salary', label: 'Salary Range' },
    { value: 'growth', label: 'Growth Potential' },
    { value: 'interview', label: 'Interview Score' }
  ];

  useEffect(() => {
    let data: { overallScore?: number; confidence?: number } | null = null;
    try {
      const stored = localStorage.getItem(MOCK_INTERVIEW_STORAGE_KEY);
      if (stored) {
        data = JSON.parse(stored);
        setMockInterviewData(data);
      }
    } catch (_) {}
    const score = data?.overallScore ?? data?.confidence;
    setTimeout(() => {
      let list = samplePredictions;
      if (score != null) {
        list = list.map(p => ({
          ...p,
          probability: Math.min(95, Math.round(p.probability * 0.75 + (score / 100) * 25)),
          interviewScore: Math.round((p.interviewScore ?? 70) * 0.6 + score * 0.4),
          mockInterviewPerformance: p.mockInterviewPerformance ? {
            ...p.mockInterviewPerformance,
            confidence: Math.round((p.mockInterviewPerformance.confidence + score) / 2),
            technical: Math.round((p.mockInterviewPerformance.technical + score) / 2),
            communication: Math.round((p.mockInterviewPerformance.communication + score) / 2),
            problemSolving: Math.round((p.mockInterviewPerformance.problemSolving + score) / 2)
          } : p.mockInterviewPerformance
        }));
      }
      setPredictions(list);
      setLoading(false);
    }, 1500);
  }, []);

  useEffect(() => {
    let sorted = [...predictions];
    
    switch (sortBy) {
      case 'probability':
        sorted.sort((a, b) => b.probability - a.probability);
        break;
      case 'salary':
        sorted.sort((a, b) => b.salary.max - a.salary.max);
        break;
      case 'growth':
        const growthOrder = { 'Very High': 3, 'High': 2, 'Medium': 1, 'Low': 0 };
        sorted.sort((a, b) => growthOrder[b.growth as keyof typeof growthOrder] - growthOrder[a.growth as keyof typeof growthOrder]);
        break;
      case 'interview':
        sorted.sort((a, b) => (b.interviewScore || 0) - (a.interviewScore || 0));
        break;
    }
    
    setPredictions(sorted);
  }, [sortBy]);

  const getProbabilityColor = (probability: number) => {
    if (probability >= 80) return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300';
    if (probability >= 60) return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300';
    return 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-300';
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatSalary = (salary: { min: number; max: number; currency: string }) => {
    const format = (num: number) => {
      if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
      if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
      return num.toString();
    };
    return `${salary.currency} ${format(salary.min)} - ${format(salary.max)}`;
  };

  const getGrowthColor = (growth: string) => {
    switch (growth) {
      case 'Very High': return 'text-purple-600 bg-purple-100 dark:bg-purple-900 dark:text-purple-300';
      case 'High': return 'text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-300';
      case 'Medium': return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const downloadReport = () => {
    const report = `
Role Prediction Report
=====================

Generated on: ${new Date().toLocaleDateString()}

Top Role Predictions:
${predictions.map((pred, index) => `
${index + 1}. ${pred.role} at ${pred.company}
   Match Probability: ${pred.probability}%
   Interview Score: ${pred.interviewScore || 'N/A'}%
   Salary: ${formatSalary(pred.salary)}
   Growth Potential: ${pred.growth}
   
   Matching Skills: ${pred.skills.matching.join(', ')}
   Missing Skills: ${pred.skills.missing.join(', ')}
   Skills to Improve: ${pred.skills.improving.join(', ')}
   
   Mock Interview Performance:
   - Technical: ${pred.mockInterviewPerformance?.technical || 'N/A'}%
   - Communication: ${pred.mockInterviewPerformance?.communication || 'N/A'}%
   - Confidence: ${pred.mockInterviewPerformance?.confidence || 'N/A'}%
   - Problem Solving: ${pred.mockInterviewPerformance?.problemSolving || 'N/A'}%
`).join('\n')}

Recommendations:
1. Focus on improving missing skills for higher match probability
2. Practice technical interview questions for weak areas
3. Build projects demonstrating required skills
4. Consider additional certifications for competitive roles
    `;
    
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'role-prediction-report.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Analyzing your profile for role predictions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 pt-8">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full">
              <Target className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            AI Role Prediction
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Personalized career role predictions based on your mock interview performance
          </p>
          {(mockInterviewData?.overallScore != null || mockInterviewData?.confidence != null) && (
            <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
              Predictions use your latest Mock Interview results
            </p>
          )}
        </div>

        {/* Filters and Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Sort By:
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowDetailed(!showDetailed)}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <Eye className="w-4 h-4" />
                <span>{showDetailed ? 'Simple View' : 'Detailed View'}</span>
              </button>
              <button
                onClick={downloadReport}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:shadow-lg transition-all duration-200"
              >
                <Download className="w-4 h-4" />
                <span>Download Report</span>
              </button>
            </div>
          </div>
        </div>

        {/* Role Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {predictions.map((prediction, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 cursor-pointer"
              onClick={() => setSelectedRole(prediction)}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-1">
                    {prediction.role}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {prediction.company}
                  </p>
                </div>
                <div className="text-right">
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${getProbabilityColor(prediction.probability)}`}>
                    {prediction.probability}% Match
                  </div>
                  {prediction.interviewScore && (
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Interview: {prediction.interviewScore}%
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {formatSalary(prediction.salary)}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-blue-500" />
                  <span className={`text-sm font-medium ${getGrowthColor(prediction.growth)}`}>
                    {prediction.growth} Growth
                  </span>
                </div>
              </div>

              {showDetailed && prediction.mockInterviewPerformance && (
                <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Mock Interview Performance
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-600 dark:text-gray-400">Technical</span>
                      <span className={`text-xs font-medium ${getScoreColor(prediction.mockInterviewPerformance.technical)}`}>
                        {prediction.mockInterviewPerformance.technical}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-600 dark:text-gray-400">Communication</span>
                      <span className={`text-xs font-medium ${getScoreColor(prediction.mockInterviewPerformance.communication)}`}>
                        {prediction.mockInterviewPerformance.communication}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-600 dark:text-gray-400">Confidence</span>
                      <span className={`text-xs font-medium ${getScoreColor(prediction.mockInterviewPerformance.confidence)}`}>
                        {prediction.mockInterviewPerformance.confidence}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-600 dark:text-gray-400">Problem Solving</span>
                      <span className={`text-xs font-medium ${getScoreColor(prediction.mockInterviewPerformance.problemSolving)}`}>
                        {prediction.mockInterviewPerformance.problemSolving}%
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="mb-4">
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                  {prediction.description}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex flex-wrap gap-1">
                  {prediction.skills.matching.slice(0, 3).map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 rounded-full text-xs"
                    >
                      {skill}
                    </span>
                  ))}
                  {prediction.skills.missing.length > 0 && (
                    <span className="px-2 py-1 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 rounded-full text-xs">
                      +{prediction.skills.missing.length} needed
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Career Path: {prediction.careerPath.slice(0, 3).join(' → ')}
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          ))}
        </div>

        {/* Role Detail Modal */}
        {selectedRole && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                      {selectedRole.role}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300">
                      {selectedRole.company}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedRole(null)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-white mb-4">Role Overview</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {selectedRole.description}
                    </p>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Match Probability</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getProbabilityColor(selectedRole.probability)}`}>
                          {selectedRole.probability}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Salary Range</span>
                        <span className="font-medium text-gray-800 dark:text-white">
                          {formatSalary(selectedRole.salary)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Growth Potential</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getGrowthColor(selectedRole.growth)}`}>
                          {selectedRole.growth}
                        </span>
                      </div>
                      {selectedRole.interviewScore && (
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 dark:text-gray-300">Interview Score</span>
                          <span className={`font-medium ${getScoreColor(selectedRole.interviewScore)}`}>
                            {selectedRole.interviewScore}%
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="mt-6">
                      <h4 className="font-medium text-gray-800 dark:text-white mb-3">Responsibilities</h4>
                      <ul className="space-y-2">
                        {selectedRole.responsibilities.map((responsibility, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                            <span className="text-gray-700 dark:text-gray-300 text-sm">{responsibility}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-6">
                      <h4 className="font-medium text-gray-800 dark:text-white mb-3">Requirements</h4>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Award className="w-4 h-4 text-blue-500" />
                          <span className="text-gray-700 dark:text-gray-300 text-sm">
                            {selectedRole.requirements.education}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Briefcase className="w-4 h-4 text-purple-500" />
                          <span className="text-gray-700 dark:text-gray-300 text-sm">
                            {selectedRole.requirements.experience}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-white mb-4">Skills Analysis</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Matching Skills ({selectedRole.skills.matching.length})
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedRole.skills.matching.map((skill, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 rounded-full text-sm"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Missing Skills ({selectedRole.skills.missing.length})
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedRole.skills.missing.map((skill, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 rounded-full text-sm"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Skills to Improve ({selectedRole.skills.improving.length})
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedRole.skills.improving.map((skill, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 rounded-full text-sm"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {selectedRole.mockInterviewPerformance && (
                      <div className="mt-6">
                        <h4 className="font-medium text-gray-800 dark:text-white mb-3">
                          Mock Interview Performance
                        </h4>
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm text-gray-600 dark:text-gray-300">Technical Skills</span>
                              <span className={`text-sm font-medium ${getScoreColor(selectedRole.mockInterviewPerformance.technical)}`}>
                                {selectedRole.mockInterviewPerformance.technical}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                              <div
                                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                                style={{ width: `${selectedRole.mockInterviewPerformance.technical}%` }}
                              ></div>
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm text-gray-600 dark:text-gray-300">Communication</span>
                              <span className={`text-sm font-medium ${getScoreColor(selectedRole.mockInterviewPerformance.communication)}`}>
                                {selectedRole.mockInterviewPerformance.communication}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                              <div
                                className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full"
                                style={{ width: `${selectedRole.mockInterviewPerformance.communication}%` }}
                              ></div>
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm text-gray-600 dark:text-gray-300">Confidence</span>
                              <span className={`text-sm font-medium ${getScoreColor(selectedRole.mockInterviewPerformance.confidence)}`}>
                                {selectedRole.mockInterviewPerformance.confidence}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                              <div
                                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                                style={{ width: `${selectedRole.mockInterviewPerformance.confidence}%` }}
                              ></div>
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm text-gray-600 dark:text-gray-300">Problem Solving</span>
                              <span className={`text-sm font-medium ${getScoreColor(selectedRole.mockInterviewPerformance.problemSolving)}`}>
                                {selectedRole.mockInterviewPerformance.problemSolving}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                              <div
                                className="bg-gradient-to-r from-yellow-500 to-orange-500 h-2 rounded-full"
                                style={{ width: `${selectedRole.mockInterviewPerformance.problemSolving}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="mt-6">
                      <h4 className="font-medium text-gray-800 dark:text-white mb-3">Career Path</h4>
                      <div className="space-y-2">
                        {selectedRole.careerPath.map((role, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <div className={`w-3 h-3 rounded-full ${
                              index === 0 ? 'bg-green-500' : 
                              index === 1 ? 'bg-blue-500' : 
                              index === 2 ? 'bg-purple-500' : 'bg-gray-400'
                            }`}></div>
                            <span className="text-gray-700 dark:text-gray-300 text-sm">{role}</span>
                            {index < selectedRole.careerPath.length - 1 && (
                              <ArrowRight className="w-3 h-3 text-gray-400" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-4">
                  <button
                    onClick={() => setSelectedRole(null)}
                    className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Close
                  </button>
                  <button className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:shadow-lg transition-all duration-200">
                    View Application Tips
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RolePrediction;
