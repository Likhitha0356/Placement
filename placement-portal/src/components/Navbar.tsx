import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { GraduationCap, Menu, X, User, LogOut, Brain, Video, FileText, Target, Briefcase, Zap } from 'lucide-react';

const Navbar: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleProfileClick = () => {
    if (currentUser?.type === 'faculty') {
      navigate('/faculty-profile');
    } else {
      navigate('/student-profile');
    }
  };

  const handleFeatureNavigation = (feature: string) => {
    switch (feature) {
      case 'ai-agent':
        navigate('/ai-agent');
        break;
      case 'mock-interview':
        navigate('/mock-interview');
        break;
      case 'resume-analyzer':
        navigate('/resume-analyzer');
        break;
      default:
        break;
    }
    setMobileMenuOpen(false);
  };

  return (
    <nav className="text-white shadow-lg fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-indigo-600 to-purple-600">
      <div className="px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <GraduationCap className="w-8 h-8" />
            <h1 className="text-xl font-bold">Placement Portal</h1>
            <span className="px-2 py-0.5 text-xs font-medium bg-green-500/90 rounded-full">Updated</span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            {/* AI Features */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => handleFeatureNavigation('ai-agent')}
                className="flex items-center space-x-1 px-3 py-2 rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors"
              >
                <Brain className="w-4 h-4" />
                <span className="text-sm">AI Agent</span>
              </button>
              <button
                onClick={() => handleFeatureNavigation('mock-interview')}
                className="flex items-center space-x-1 px-3 py-2 rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors"
              >
                <Video className="w-4 h-4" />
                <span className="text-sm">Mock Interview</span>
              </button>
              <button
                onClick={() => handleFeatureNavigation('resume-analyzer')}
                className="flex items-center space-x-1 px-3 py-2 rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors"
              >
                <FileText className="w-4 h-4" />
                <span className="text-sm">Resume Analyzer</span>
              </button>
            </div>
            
            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <button
                onClick={handleProfileClick}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors"
              >
                <User className="w-4 h-4" />
                <span className="text-sm">Profile</span>
              </button>
              <div className="text-right">
                <p className="text-sm font-medium">{currentUser?.name}</p>
                <p className="text-xs opacity-75 capitalize">{currentUser?.type}</p>
              </div>
              <button
                onClick={logout}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
          
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 pt-4 border-t border-white border-opacity-20">
            <div className="space-y-2">
              <button
                onClick={() => handleFeatureNavigation('ai-agent')}
                className="flex items-center space-x-2 w-full px-3 py-2 rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors"
              >
                <Brain className="w-4 h-4" />
                <span>AI Agent</span>
              </button>
              <button
                onClick={() => handleFeatureNavigation('mock-interview')}
                className="flex items-center space-x-2 w-full px-3 py-2 rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors"
              >
                <Video className="w-4 h-4" />
                <span>Mock Interview</span>
              </button>
              <button
                onClick={() => handleFeatureNavigation('resume-analyzer')}
                className="flex items-center space-x-2 w-full px-3 py-2 rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors"
              >
                <FileText className="w-4 h-4" />
                <span>Resume Analyzer</span>
              </button>
              <button
                onClick={handleProfileClick}
                className="flex items-center space-x-2 w-full px-3 py-2 rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors"
              >
                <User className="w-4 h-4" />
                <span>Profile</span>
              </button>
              <button
                onClick={logout}
                className="flex items-center space-x-2 w-full px-3 py-2 rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
