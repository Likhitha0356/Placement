import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, TrendingUp, Users, Brain, BarChart3, ArrowRight, Sparkles, Video, FileText, User, Briefcase, Target, Zap } from 'lucide-react';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Brain,
      title: 'AI Career Assistant',
      description: 'Get personalized career guidance and interview preparation tips',
      highlight: 'AI-Powered'
    },
    {
      icon: Video,
      title: 'Mock Interviews',
      description: 'Practice with AI-powered avatar interviewer and real-time feedback',
      highlight: 'Interactive'
    },
    {
      icon: FileText,
      title: 'Resume Analysis',
      description: 'ATS score optimization and personalized improvement suggestions',
      highlight: 'Smart Analysis'
    },
    {
      icon: Target,
      title: 'Role Prediction',
      description: 'AI-powered career path recommendations based on your skills',
      highlight: 'Data-Driven'
    },
    {
      icon: Briefcase,
      title: 'Company Matching',
      description: 'Find the best companies matching your profile and skills',
      highlight: 'Smart Match'
    },
    {
      icon: Zap,
      title: 'Skill Development',
      description: 'Personalized learning paths to bridge your skill gaps',
      highlight: 'Adaptive Learning'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob bg-indigo-300"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000 bg-pink-300"></div>
        <div className="absolute top-40 left-40 w-80 h-80 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000 bg-blue-300"></div>
      </div>

      {/* Hero Section */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-12">
        <div className="text-center max-w-6xl mx-auto">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full shadow-2xl mb-6 transform hover:scale-110 transition-transform duration-300 bg-gradient-to-r from-indigo-500 to-purple-500">
              <GraduationCap className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Placement Portal
            </h1>
            <p className="text-xl md:text-2xl mb-8 font-medium text-gray-700">
              Your Gateway to Career Success with AI-Powered Guidance
            </p>
            <div className="inline-flex items-center px-6 py-3 rounded-full text-sm font-medium bg-indigo-100 text-indigo-700 border border-indigo-200">
              <Sparkles className="w-4 h-4 mr-2" />
              Advanced AI Interview & Career Analysis
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 mb-12 justify-center">
            <button
              onClick={() => navigate('/login?tab=student')}
              className="px-8 py-4 font-bold rounded-xl transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl flex items-center justify-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700"
            >
              <span>I'm a Student</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate('/login?tab=faculty')}
              className="px-8 py-4 font-semibold rounded-xl transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl flex items-center justify-center space-x-2 border-2 border-indigo-500 text-indigo-700 hover:bg-indigo-500 hover:text-white"
            >
              <User className="w-5 h-5" />
              <span>Faculty / Staff</span>
            </button>
          </div>

          <div className="flex items-center justify-center space-x-8 text-sm">
            <div className="flex items-center space-x-2 text-gray-600">
              <Users className="w-5 h-5 text-green-500" />
              <span>10,000+ Students</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              <span>95% Placement Rate</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <Brain className="w-5 h-5 text-purple-500" />
              <span>AI-Powered</span>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-gray-800">
              Cutting-Edge Features
            </h2>
            <p className="text-xl max-w-3xl mx-auto text-gray-600">
              Leverage the power of artificial intelligence to accelerate your career growth and placement success
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 bg-white"
                >
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 ${
                    index % 3 === 0 
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500' 
                      : index % 3 === 1
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500'
                      : 'bg-gradient-to-r from-green-500 to-emerald-500'
                  }`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-800">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                  <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700">
                    {feature.highlight}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-gray-800">
            Ready to Transform Your Career?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-gray-600">
            Join thousands of students who have already landed their dream jobs with our AI-powered placement platform.
          </p>
          <button
            onClick={() => navigate('/login?tab=student')}
            className="px-8 py-4 font-bold rounded-xl transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700"
          >
            Get Started Now
          </button>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
