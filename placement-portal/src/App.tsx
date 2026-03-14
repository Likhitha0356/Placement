import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import FacultyDashboard from './pages/FacultyDashboard';
import StudentDashboard from './pages/StudentDashboard';
import PlacementPrediction from './pages/PlacementPrediction';
import Reports from './pages/Reports';
import StudentSearch from './pages/StudentSearch';
import About from './pages/About';
import Progress from './pages/Progress';
import Recommendations from './pages/Recommendations';
import AIAgent from './pages/AIAgent';
import MockInterview from './pages/MockInterview';
import ResumeAnalyzer from './pages/ResumeAnalyzer';
import CompanyEligibility from './pages/CompanyEligibility';
import RolePrediction from './pages/RolePrediction';
import FacultyProfile from './pages/FacultyProfile';
import StudentProfile from './pages/StudentProfile';

function AppContent() {
  const { currentUser } = useAuth();
  const { darkMode } = useTheme();

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {currentUser && <Navbar />}
      <div className="flex">
        {currentUser && <Sidebar />}
        <main className={`flex-1 ${currentUser ? 'ml-64' : ''} transition-all duration-300`}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route 
              path="/faculty-dashboard" 
              element={currentUser?.type === 'faculty' ? <FacultyDashboard /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/student-dashboard" 
              element={currentUser?.type === 'student' ? <StudentDashboard /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/progress" 
              element={currentUser?.type === 'student' ? <Progress /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/recommendations" 
              element={currentUser?.type === 'student' ? <Recommendations /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/placement-prediction" 
              element={currentUser?.type === 'faculty' ? <PlacementPrediction /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/reports" 
              element={currentUser?.type === 'faculty' ? <Reports /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/student-search" 
              element={currentUser?.type === 'faculty' ? <StudentSearch /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/ai-agent" 
              element={currentUser ? <AIAgent /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/mock-interview" 
              element={currentUser ? <MockInterview /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/resume-analyzer" 
              element={currentUser ? <ResumeAnalyzer /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/faculty-profile" 
              element={currentUser?.type === 'faculty' ? <FacultyProfile /> : <Navigate to="/" />} 
            />
            <Route 
              path="/student-profile" 
              element={currentUser?.type === 'student' ? <StudentProfile /> : <Navigate to="/" />} 
            />
            <Route 
              path="/company-eligibility" 
              element={currentUser ? <CompanyEligibility /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/role-prediction" 
              element={currentUser ? <RolePrediction /> : <Navigate to="/login" />} 
            />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
