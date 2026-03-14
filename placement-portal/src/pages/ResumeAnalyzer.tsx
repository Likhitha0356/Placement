import React, { useState, useRef } from 'react';
import { FileText, Upload, Download, CheckCircle, AlertCircle, TrendingUp, Brain, Target, Sparkles, Eye, FileCheck, Lightbulb } from 'lucide-react';

interface ResumeAnalysis {
  atsScore: number;
  sections: {
    contact: { score: number; feedback: string[] };
    experience: { score: number; feedback: string[] };
    education: { score: number; feedback: string[] };
    skills: { score: number; feedback: string[] };
  };
  keywords: string[];
  missingKeywords: string[];
  suggestions: string[];
  formatScore: number;
  contentScore: number;
}

const ResumeAnalyzer: React.FC = () => {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (file: File) => {
    if (file && (file.type === 'application/pdf' || file.type === 'application/msword' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
      setResumeFile(file);
      setAnalysis(null);
    } else {
      alert('Please upload a PDF or Word document');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileUpload(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const analyzeResume = async () => {
    if (!resumeFile) return;
    
    setIsAnalyzing(true);
    
    // Simulate AI analysis (in real app, this would call an API)
    setTimeout(() => {
      const mockAnalysis: ResumeAnalysis = {
        atsScore: Math.floor(Math.random() * 30) + 70,
        sections: {
          contact: {
            score: Math.floor(Math.random() * 20) + 80,
            feedback: [
              'Contact information is clearly visible',
              'Professional email address',
              'LinkedIn profile included'
            ]
          },
          experience: {
            score: Math.floor(Math.random() * 25) + 75,
            feedback: [
              'Good use of action verbs',
              'Quantifiable achievements included',
              'Consider adding more metrics'
            ]
          },
          education: {
            score: Math.floor(Math.random() * 15) + 85,
            feedback: [
              'Education details are complete',
              'GPA included when relevant',
              'Relevant coursework highlighted'
            ]
          },
          skills: {
            score: Math.floor(Math.random() * 30) + 70,
            feedback: [
              'Technical skills well organized',
              'Consider adding soft skills',
              'Skills match job requirements'
            ]
          }
        },
        keywords: [
          'JavaScript', 'React', 'Node.js', 'Python', 'Machine Learning',
          'Data Analysis', 'Problem Solving', 'Team Collaboration', 'Agile'
        ],
        missingKeywords: [
          'Docker', 'AWS', 'GraphQL', 'TypeScript', 'Kubernetes'
        ],
        suggestions: [
          'Add more quantifiable achievements to your experience section',
          'Include a professional summary at the top',
          'Tailor your resume for specific job applications',
          'Use industry-standard terminology',
          'Consider adding a projects section',
          'Include certifications and online courses'
        ],
        formatScore: Math.floor(Math.random() * 20) + 80,
        contentScore: Math.floor(Math.random() * 25) + 75
      };
      
      setAnalysis(mockAnalysis);
      setIsAnalyzing(false);
    }, 3000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
  };

  const downloadReport = () => {
    if (!analysis) return;
    
    const report = `
Resume Analysis Report
=====================

ATS Score: ${analysis.atsScore}/100

Section Scores:
- Contact Information: ${analysis.sections.contact.score}/100
- Experience: ${analysis.sections.experience.score}/100
- Education: ${analysis.sections.education.score}/100
- Skills: ${analysis.sections.skills.score}/100

Format Score: ${analysis.formatScore}/100
Content Score: ${analysis.contentScore}/100

Keywords Found: ${analysis.keywords.join(', ')}

Missing Keywords: ${analysis.missingKeywords.join(', ')}

Suggestions:
${analysis.suggestions.map(s => `- ${s}`).join('\n')}

Section Feedback:
Contact: ${analysis.sections.contact.feedback.join(', ')}
Experience: ${analysis.sections.experience.feedback.join(', ')}
Education: ${analysis.sections.education.feedback.join(', ')}
Skills: ${analysis.sections.skills.feedback.join(', ')}
    `;
    
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'resume-analysis-report.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8 pt-8">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full">
              <FileText className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            AI Resume Analyzer
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Get instant ATS scoring and personalized improvement suggestions
          </p>
        </div>

        {!analysis ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <div className="max-w-2xl mx-auto">
              {/* Upload Area */}
              <div
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors duration-200 ${
                  dragActive 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                    : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                <div className="mb-4">
                  <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                    Upload Your Resume
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Drag and drop your resume here, or click to browse
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Supported formats: PDF, DOC, DOCX (Max size: 5MB)
                  </p>
                </div>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(file);
                  }}
                  className="hidden"
                />
                
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-200"
                >
                  Choose File
                </button>
              </div>

              {resumeFile && (
                <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-5 h-5 text-blue-500" />
                      <span className="text-gray-800 dark:text-white">{resumeFile.name}</span>
                    </div>
                    <button
                      onClick={() => setResumeFile(null)}
                      className="text-red-500 hover:text-red-600"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )}

              {resumeFile && (
                <div className="mt-6">
                  <button
                    onClick={analyzeResume}
                    disabled={isAnalyzing}
                    className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isAnalyzing ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Analyzing Resume...
                      </div>
                    ) : (
                      'Analyze Resume'
                    )}
                  </button>
                </div>
              )}

              {/* Features */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <Eye className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-800 dark:text-white mb-1">ATS Optimization</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Checks compatibility with applicant tracking systems
                  </p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                  <FileCheck className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-800 dark:text-white mb-1">Content Analysis</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Evaluates content quality and relevance
                  </p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                  <Lightbulb className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-800 dark:text-white mb-1">Smart Suggestions</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Provides actionable improvement tips
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Overall Score */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
              <div className="text-center mb-8">
                <div className="flex items-center justify-center mb-4">
                  <div className={`p-4 rounded-full ${getScoreBgColor(analysis.atsScore)}`}>
                    <Brain className="w-8 h-8" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                  ATS Score: {analysis.atsScore}/100
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Your resume compatibility with modern ATS systems
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-white mb-4">
                    Section Scores
                  </h3>
                  <div className="space-y-3">
                    {Object.entries(analysis.sections).map(([section, data]) => (
                      <div key={section} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium text-gray-800 dark:text-white capitalize">
                            {section}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreBgColor(data.score)}`}>
                            {data.score}/100
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                            style={{ width: `${data.score}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-white mb-4">
                    Additional Metrics
                  </h3>
                  <div className="space-y-3">
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-gray-800 dark:text-white">
                          Format Score
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreBgColor(analysis.formatScore)}`}>
                          {analysis.formatScore}/100
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full"
                          style={{ width: `${analysis.formatScore}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-gray-800 dark:text-white">
                          Content Score
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreBgColor(analysis.contentScore)}`}>
                          {analysis.contentScore}/100
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                          style={{ width: `${analysis.contentScore}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Keywords Analysis */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
              <h3 className="font-semibold text-gray-800 dark:text-white mb-4">
                Keywords Analysis
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-3">
                    Keywords Found ({analysis.keywords.length})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {analysis.keywords.map((keyword, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 rounded-full text-sm"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-3">
                    Missing Keywords ({analysis.missingKeywords.length})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {analysis.missingKeywords.map((keyword, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 rounded-full text-sm"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Suggestions */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
              <h3 className="font-semibold text-gray-800 dark:text-white mb-4">
                AI Suggestions
              </h3>
              <div className="space-y-3">
                {analysis.suggestions.map((suggestion, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <Sparkles className="w-5 h-5 text-yellow-500 mt-0.5" />
                    <p className="text-gray-700 dark:text-gray-300">{suggestion}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Section Feedback */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
              <h3 className="font-semibold text-gray-800 dark:text-white mb-4">
                Detailed Feedback
              </h3>
              <div className="space-y-4">
                {Object.entries(analysis.sections).map(([section, data]) => (
                  <div key={section} className="border-l-4 border-blue-500 pl-4">
                    <h4 className="font-medium text-gray-800 dark:text-white capitalize mb-2">
                      {section} Section
                    </h4>
                    <ul className="space-y-1">
                      {data.feedback.map((feedback, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                          <span className="text-gray-700 dark:text-gray-300 text-sm">{feedback}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-center space-x-4">
              <button
                onClick={downloadReport}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
              >
                <Download className="w-5 h-5" />
                <span>Download Report</span>
              </button>
              <button
                onClick={() => {
                  setAnalysis(null);
                  setResumeFile(null);
                }}
                className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
              >
                Analyze Another Resume
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeAnalyzer;
