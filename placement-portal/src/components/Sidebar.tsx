import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  LayoutDashboard,
  Users,
  BarChart3,
  Brain,
  FileDown,
  FileText,
  Info,
  Building,
  Target
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const { currentUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const facultyMenuItems = [
    {
      icon: LayoutDashboard,
      label: 'Dashboard',
      path: '/faculty-dashboard'
    },
    {
      icon: Users,
      label: 'Student Data',
      path: '/student-search'
    },
    {
      icon: Brain,
      label: 'Placement Prediction',
      path: '/placement-prediction'
    },
    {
      icon: FileDown,
      label: 'Reports',
      path: '/reports'
    },
    {
      icon: Info,
      label: 'About Us',
      path: '/about'
    }
  ];

  const studentMenuItems = [
    {
      icon: LayoutDashboard,
      label: 'Dashboard',
      path: '/student-dashboard'
    },
    {
      icon: BarChart3,
      label: 'Progress',
      path: '/progress'
    },
    {
      icon: FileText,
      label: 'Resume Analyzer',
      path: '/resume-analyzer'
    },
    {
      icon: Building,
      label: 'Company Eligibility',
      path: '/company-eligibility'
    },
    {
      icon: Target,
      label: 'Role Prediction',
      path: '/role-prediction'
    },
    {
      icon: Brain,
      label: 'Recommendations',
      path: '/recommendations'
    },
    {
      icon: Info,
      label: 'About Us',
      path: '/about'
    }
  ];

  const menuItems = currentUser?.type === 'faculty' ? facultyMenuItems : studentMenuItems;

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 shadow-xl z-40 bg-gradient-to-b from-white to-indigo-50 border-r border-indigo-200">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold flex items-center space-x-2 text-gray-800">
          <BarChart3 className="w-5 h-5" />
          <span>Menu</span>
        </h2>
      </div>
      
      <nav className="p-4">
        <ul className="space-y-1">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <li key={index}>
                <button
                  onClick={() => handleNavigation(item.path)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 text-left group ${
                    isActive 
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg' 
                      : 'text-gray-700 hover:bg-indigo-100 hover:text-indigo-700'
                  }`}
                >
                  <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
