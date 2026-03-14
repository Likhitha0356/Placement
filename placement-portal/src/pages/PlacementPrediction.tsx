import React, { useState } from 'react';
import { Brain, TrendingUp, AlertCircle, CheckCircle, ExternalLink } from 'lucide-react';
import { apiService } from '../services/api';

const PLACEMENT_AI_URL = process.env.REACT_APP_PLACEMENT_AI_URL || 'http://localhost:8000';

interface PredictionData {
  section: string;
  rollNumber: string;
  department: string;
  aptitudeScore: number;
  mockInterviewScore: number;
  problemsSolved: number;
  hackathonCount: number;
  technicalTestScore: number;
  resumeScore: number;
  projectsCount: number;
}

interface PredictionResult {
  readiness: 'High' | 'Medium' | 'Low';
  probability: number;
  score: number;
  maxScore: number;
  recommendations: string[];
}

const PlacementPrediction: React.FC = () => {
  const [formData, setFormData] = useState<PredictionData>({
    section: '',
    rollNumber: '',
    department: '',
    aptitudeScore: 0,
    mockInterviewScore: 0,
    problemsSolved: 0,
    hackathonCount: 0,
    technicalTestScore: 0,
    resumeScore: 0,
    projectsCount: 0
  });

  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [usingMLModel, setUsingMLModel] = useState<boolean | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name.includes('Score') || name.includes('Count') || name.includes('Solved') ? Number(value) : value
    }));
  };

  const generatePrediction = async () => {
    setIsGenerating(true);
    
    try {
      // First try the backend API
      const response = await apiService.predictPlacement(formData);
      if (response.success) {
        setPrediction({
          readiness: response.prediction.readiness,
          probability: Math.round(response.prediction.probability * 100),
          score: Math.round(response.prediction.probability * 100),
          maxScore: 100,
          recommendations: response.prediction.recommendations
        });
        setUsingMLModel(true);
      } else {
        // Fallback to local calculation if backend fails
        console.log('Backend API failed, using local calculation');
        const localPrediction = calculatePrediction(formData);
        setPrediction(localPrediction);
        setUsingMLModel(false);
      }
    } catch (error) {
      console.error('Backend API error, using local calculation:', error);
      // Fallback to local calculation
      const localPrediction = calculatePrediction(formData);
      setPrediction(localPrediction);
      setUsingMLModel(false);
    } finally {
      setIsGenerating(false);
    }
  };

  const calculatePrediction = (data: PredictionData): PredictionResult => {
    // Simple scoring algorithm (replace with your actual ML model)
    let score = 0;
    let maxScore = 0;
    
    // Weight different factors
    score += data.aptitudeScore * 0.15;
    maxScore += 100 * 0.15;
    
    score += data.mockInterviewScore * 0.20;
    maxScore += 100 * 0.20;
    
    score += Math.min(data.problemsSolved * 2, 100) * 0.15;
    maxScore += 100 * 0.15;
    
    score += Math.min(data.hackathonCount * 20, 100) * 0.10;
    maxScore += 100 * 0.10;
    
    score += data.technicalTestScore * 0.20;
    maxScore += 100 * 0.20;
    
    score += data.resumeScore * 0.10;
    maxScore += 100 * 0.10;
    
    score += Math.min(data.projectsCount * 25, 100) * 0.10;
    maxScore += 100 * 0.10;
    
    const probability = Math.round((score / maxScore) * 100);
    
    let readiness: 'High' | 'Medium' | 'Low';
    let recommendations: string[] = [];
    
    if (probability >= 80) {
      readiness = 'High';
      recommendations = [
        'Maintain current performance level',
        'Focus on advanced topics and specialization',
        'Prepare for technical interviews with top companies'
      ];
    } else if (probability >= 60) {
      readiness = 'Medium';
      recommendations = [
        'Continue practicing coding problems',
        'Consider participating in hackathons',
        'Improve resume with relevant projects',
        'Work on communication skills'
      ];
    } else {
      readiness = 'Low';
      recommendations = [
        'Focus on improving aptitude skills through regular practice',
        'Participate in mock interviews to build confidence',
        'Work on more coding problems and projects',
        'Seek mentorship from seniors or faculty'
      ];
    }
    
    return {
      readiness,
      probability,
      score: Math.round(score),
      maxScore: Math.round(maxScore),
      recommendations
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.section || !formData.rollNumber || !formData.department) {
      alert('Please fill in all required fields');
      return;
    }
    generatePrediction();
  };

  const getReadinessColor = (readiness: string) => {
    switch (readiness) {
      case 'High': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Low': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getProgressColor = (probability: number) => {
    if (probability >= 80) return 'bg-green-500';
    if (probability >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="p-6 pt-20">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Placement Prediction</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
            <Brain className="w-6 h-6 mr-2 text-primary-600" />
            Student Information
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Section *
                </label>
                <select
                  name="section"
                  value={formData.section}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                >
                  <option value="">Select Section</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Roll Number *
                </label>
                <input
                  type="text"
                  name="rollNumber"
                  value={formData.rollNumber}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter roll number"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department *
                </label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                >
                  <option value="">Select Department</option>
                  <option value="CSE">Computer Science</option>
                  <option value="ECE">Electronics</option>
                  <option value="EEE">Electrical</option>
                  <option value="MECH">Mechanical</option>
                  <option value="CIVIL">Civil</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Aptitude Score
                </label>
                <input
                  type="number"
                  name="aptitudeScore"
                  value={formData.aptitudeScore}
                  onChange={handleInputChange}
                  min="0"
                  max="100"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="0-100"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mock Interview Score
                </label>
                <input
                  type="number"
                  name="mockInterviewScore"
                  value={formData.mockInterviewScore}
                  onChange={handleInputChange}
                  min="0"
                  max="100"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="0-100"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Problems Solved
                </label>
                <input
                  type="number"
                  name="problemsSolved"
                  value={formData.problemsSolved}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Number of problems"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hackathon Count
                </label>
                <input
                  type="number"
                  name="hackathonCount"
                  value={formData.hackathonCount}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Number of hackathons"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Technical Test Score
                </label>
                <input
                  type="number"
                  name="technicalTestScore"
                  value={formData.technicalTestScore}
                  onChange={handleInputChange}
                  min="0"
                  max="100"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="0-100"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resume Score
                </label>
                <input
                  type="number"
                  name="resumeScore"
                  value={formData.resumeScore}
                  onChange={handleInputChange}
                  min="0"
                  max="100"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="0-100"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Projects Count
                </label>
                <input
                  type="number"
                  name="projectsCount"
                  value={formData.projectsCount}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Number of projects"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isGenerating}
              className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-3 px-4 rounded-lg font-medium hover:from-primary-700 hover:to-secondary-700 transform hover:scale-[1.02] transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Generating Prediction...
                </>
              ) : (
                <>
                  <Brain className="w-5 h-5 mr-2" />
                  Generate Prediction
                </>
              )}
            </button>
          </form>
        </div>

        {/* Result Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
            <TrendingUp className="w-6 h-6 mr-2 text-primary-600" />
            Prediction Result
          </h2>
          
          {!prediction ? (
            <div className="text-center py-12">
              <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Enter student details to generate prediction</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Model Status Indicator */}
              {usingMLModel !== null && (
                <div className={`p-3 rounded-lg border dark:border-opacity-50 ${
                  usingMLModel 
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700' 
                    : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700'
                }`}>
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center">
                      <Brain className={`w-4 h-4 mr-2 ${
                        usingMLModel ? 'text-green-600' : 'text-yellow-600'
                      }`} />
                      <span className={`text-sm font-medium ${
                        usingMLModel ? 'text-green-800 dark:text-green-300' : 'text-yellow-800 dark:text-yellow-300'
                      }`}>
                        {usingMLModel 
                          ? '✓ Using ML Model Prediction' 
                          : '⚠ Using Local Calculation (ML Model Unavailable)'
                        }
                      </span>
                    </div>
                    <a
                      href={PLACEMENT_AI_URL.startsWith('http') ? `${PLACEMENT_AI_URL.replace(/\/$/, '')}/docs` : '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs flex items-center gap-1 text-primary-600 dark:text-primary-400 hover:underline"
                    >
                      Placement AI API <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              )}

              <div className={`p-4 rounded-lg ${getReadinessColor(prediction.readiness)}`}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-lg">Placement Readiness</h3>
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm opacity-75">Status</p>
                    <p className="font-bold text-xl">{prediction.readiness}</p>
                  </div>
                  <div>
                    <p className="text-sm opacity-75">Probability</p>
                    <p className="font-bold text-xl">{prediction.probability}%</p>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Overall Score</span>
                  <span className="text-sm font-medium text-gray-700">{prediction.score}/{prediction.maxScore}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all duration-500 ${getProgressColor(prediction.probability)}`}
                    style={{ width: `${prediction.probability}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                  <Brain className="w-5 h-5 mr-2 text-primary-600" />
                  Recommendations
                </h4>
                <div className="space-y-2">
                  {prediction.recommendations.map((rec, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg border-l-4 border-primary-500">
                      <p className="text-sm text-gray-700">{rec}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlacementPrediction;
