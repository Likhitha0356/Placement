import React, { useState } from 'react';
import { Search, User, AlertCircle } from 'lucide-react';
import { apiService } from '../services/api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface Student {
  rollNo: string;
  name: string;
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

const StudentSearch: React.FC = () => {
  const [searchRollNumber, setSearchRollNumber] = useState('');
  const [searchDept, setSearchDept] = useState('');
  const [searchSection, setSearchSection] = useState('');
  const [searchResults, setSearchResults] = useState<Student[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [filteredAnalysis, setFilteredAnalysis] = useState<any>(null);

  const departments = ['CSE', 'ECE', 'EEE', 'IT', 'ME'];
  const sections = ['A', 'B', 'C', 'D'];

  // Dynamic skill analysis based on actual student data
  const getSkillAnalysis = (students: Student[], dept?: string, section?: string) => {
    if (students.length === 0) return null;
    
    const totalStudents = students.length;
    const skillGaps = {
      projects: students.filter(s => s.projectsCount < 2).length,
      interview: students.filter(s => s.mockInterviewScore < 60).length,
      aptitude: students.filter(s => s.aptitudeScore < 60).length,
      technical: students.filter(s => s.technicalTestScore < 60).length,
      problemSolving: students.filter(s => s.problemsSolved < 30).length,
    };

    // Find the skill with highest gap percentage
    const skillPercentages = {
      projects: Math.round((skillGaps.projects / totalStudents) * 100),
      interview: Math.round((skillGaps.interview / totalStudents) * 100),
      aptitude: Math.round((skillGaps.aptitude / totalStudents) * 100),
      technical: Math.round((skillGaps.technical / totalStudents) * 100),
      problemSolving: Math.round((skillGaps.problemSolving / totalStudents) * 100),
    };

    const topSkill = (Object.keys(skillPercentages) as Array<keyof typeof skillPercentages>).reduce((a, b) => 
      skillPercentages[a] > skillPercentages[b] ? a : b
    );

    const skillNames: Record<keyof typeof skillPercentages, string> = {
      projects: 'Project Experience',
      interview: 'Interview Skills', 
      aptitude: 'Aptitude Skills',
      technical: 'Technical Skills',
      problemSolving: 'Problem Solving'
    };

    return {
      totalStudents,
      criticalGaps: skillGaps,
      topConcern: skillNames[topSkill],
      urgentAction: `${skillPercentages[topSkill]}% of students lack ${skillNames[topSkill].toLowerCase()}`,
      recommendations: dept && section 
        ? `Focus on ${skillNames[topSkill].toLowerCase()} development for ${dept}-${section} students`
        : dept 
        ? `Department-wide ${skillNames[topSkill].toLowerCase()} training needed`
        : `Institution-wide ${skillNames[topSkill].toLowerCase()} development programs recommended`
    };
  };

  const handleSearch = async () => {
    if (!searchRollNumber && !searchDept && !searchSection) {
      alert('Please enter roll number, select department, or select section');
      return;
    }

    setIsSearching(true);
    setHasSearched(true);

    try {
      let students: Student[] = [];
      
      if (searchRollNumber) {
        // Search by roll number
        const response = await apiService.getStudent(searchRollNumber);
        if (response.success) {
          students = [response.data];
        }
      } else {
        // Get all students and filter by department and/or section
        const response = await apiService.getAllStudents();
        if (response.success) {
          const allStudents = Object.values(response.data) as Student[];
          students = allStudents.filter((student: Student) => {
            const deptMatch = !searchDept || student.dept === searchDept;
            const sectionMatch = !searchSection || student.section === searchSection;
            return deptMatch && sectionMatch;
          });
        }
      }
      
      // Update skill analysis based on actual search results
      const analysis = getSkillAnalysis(students, searchDept || undefined, searchSection || undefined);
      setFilteredAnalysis(analysis);
      
      setSearchResults(students);
    } catch (error) {
      console.error('Error searching students:', error);
      alert('Error searching students. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const calculateOverallScore = (student: Student) => {
    return Math.round(
      student.aptitudeScore * 0.15 +
      student.mockInterviewScore * 0.20 +
      student.technicalTestScore * 0.20 +
      student.resumeScore * 0.10 +
      Math.min(student.problemsSolved * 2, 100) * 0.15 +
      Math.min(student.hackathonCount * 20, 100) * 0.10 +
      Math.min(student.projectsCount * 25, 100) * 0.10
    );
  };

  // Prepare chart data for search results
  const prepareChartData = () => {
    if (searchResults.length === 0) return null;

    const deptCounts: { [key: string]: number } = {};
    const sectionCounts: { [key: string]: number } = {};
    const readinessCounts: { [key: string]: number } = {};

    searchResults.forEach(student => {
      deptCounts[student.dept] = (deptCounts[student.dept] || 0) + 1;
      const sectionKey = `${student.dept}-${student.section}`;
      sectionCounts[sectionKey] = (sectionCounts[sectionKey] || 0) + 1;
      readinessCounts[student.placementReadiness] = (readinessCounts[student.placementReadiness] || 0) + 1;
    });

    return {
      deptData: {
        labels: Object.keys(deptCounts),
        datasets: [{
          label: 'Students by Department',
          data: Object.values(deptCounts),
          backgroundColor: [
            'rgba(102, 126, 234, 0.8)',
            'rgba(118, 75, 162, 0.8)',
            'rgba(237, 100, 166, 0.8)',
            'rgba(255, 159, 64, 0.8)',
            'rgba(75, 192, 192, 0.8)',
          ],
          borderColor: '#fff',
          borderWidth: 2,
        }]
      },
      sectionData: {
        labels: Object.keys(sectionCounts),
        datasets: [{
          label: 'Students by Section',
          data: Object.values(sectionCounts),
          backgroundColor: 'rgba(118, 75, 162, 0.8)',
          borderColor: 'rgba(118, 75, 162, 1)',
          borderWidth: 2,
        }]
      },
      readinessData: {
        labels: Object.keys(readinessCounts),
        datasets: [{
          label: 'Placement Readiness',
          data: Object.values(readinessCounts),
          backgroundColor: [
            'rgba(34, 197, 94, 0.8)',
            'rgba(255, 159, 64, 0.8)',
            'rgba(239, 68, 68, 0.8)',
          ],
          borderColor: '#fff',
          borderWidth: 2,
        }]
      }
    };
  };

  const chartData = prepareChartData();

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
      },
    },
  };

  const getReadinessColor = (readiness: string) => {
    switch (readiness) {
      case 'Ready': return 'text-green-600 bg-green-100';
      case 'Not Ready': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="p-6 pt-20">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Student Data Search</h1>
      
      {/* Search Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
          <Search className="w-6 h-6 mr-2 text-primary-600" />
          Search Student
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Roll Number</label>
            <input
              type="text"
              value={searchRollNumber}
              onChange={(e) => setSearchRollNumber(e.target.value)}
              placeholder="Enter roll number"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
            <select
              value={searchDept}
              onChange={(e) => setSearchDept(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Section</label>
            <select
              value={searchSection}
              onChange={(e) => setSearchSection(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">All Sections</option>
              {sections.map(section => (
                <option key={section} value={section}>{section}</option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleSearch}
              disabled={isSearching}
              className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-primary-700 transition-colors duration-200 flex items-center justify-center disabled:opacity-50"
            >
              {isSearching ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Searching...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Skill Analysis Section */}
      {hasSearched && filteredAnalysis && !searchRollNumber && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
            <AlertCircle className="w-6 h-6 mr-2 text-red-600" />
            Skill Gap Analysis - {searchDept && searchSection ? `${searchDept}-${searchSection}` : searchDept ? searchDept : 'All Students'}
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Critical Alert */}
            <div className="bg-red-50 rounded-lg p-4 border border-red-200">
              <div className="flex items-center mb-3">
                <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                <h3 className="font-semibold text-red-800">Critical Concern</h3>
              </div>
              <p className="text-red-700 font-medium mb-2">{filteredAnalysis.topConcern}</p>
              <p className="text-red-600 text-sm">{filteredAnalysis.urgentAction}</p>
            </div>
            
            {/* Skill Gaps */}
            <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
              <h3 className="font-semibold text-orange-800 mb-3">Students Needing Help</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-orange-700">Projects</span>
                  <span className="font-bold text-orange-800">{filteredAnalysis.criticalGaps.projects} ({Math.round((filteredAnalysis.criticalGaps.projects / filteredAnalysis.totalStudents) * 100)}%)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-orange-700">Interview</span>
                  <span className="font-bold text-orange-800">{filteredAnalysis.criticalGaps.interview} ({Math.round((filteredAnalysis.criticalGaps.interview / filteredAnalysis.totalStudents) * 100)}%)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-orange-700">Aptitude</span>
                  <span className="font-bold text-orange-800">{filteredAnalysis.criticalGaps.aptitude} ({Math.round((filteredAnalysis.criticalGaps.aptitude / filteredAnalysis.totalStudents) * 100)}%)</span>
                </div>
              </div>
            </div>
            
            {/* Recommendations */}
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <h3 className="font-semibold text-blue-800 mb-3">Recommended Actions</h3>
              <p className="text-blue-700 text-sm">{filteredAnalysis.recommendations}</p>
              <div className="mt-3 space-y-1">
                <p className="text-blue-600 text-xs">• Organize skill development workshops</p>
                <p className="text-blue-600 text-xs">• Provide additional practice materials</p>
                <p className="text-blue-600 text-xs">• Schedule one-on-one mentoring sessions</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Results Section */}
      {hasSearched && (
        <>
          {/* Charts Section */}
          {chartData && searchResults.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Department Distribution</h3>
                <div className="h-64">
                  <Bar data={chartData.deptData} options={chartOptions} />
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Section Distribution</h3>
                <div className="h-64">
                  <Bar data={chartData.sectionData} options={chartOptions} />
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Placement Readiness</h3>
                <div className="h-64">
                  <Pie data={chartData.readinessData} options={pieOptions} />
                </div>
              </div>
            </div>
          )}

          {/* Results List */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <User className="w-6 h-6 mr-2 text-primary-600" />
              Search Results ({searchResults.length} students found)
            </h2>
            
            {searchResults.length === 0 ? (
              <div className="text-center py-12">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No students found matching your search criteria.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="py-3 px-4 text-sm font-semibold text-gray-700">Roll No</th>
                      <th className="py-3 px-4 text-sm font-semibold text-gray-700">Name</th>
                      <th className="py-3 px-4 text-sm font-semibold text-gray-700">Department</th>
                      <th className="py-3 px-4 text-sm font-semibold text-gray-700">Section</th>
                      <th className="py-3 px-4 text-sm font-semibold text-gray-700">Overall Score</th>
                      <th className="py-3 px-4 text-sm font-semibold text-gray-700">Readiness</th>
                    </tr>
                  </thead>
                  <tbody>
                    {searchResults.map((student, index) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm text-gray-900">{student.rollNo}</td>
                        <td className="py-3 px-4 text-sm text-gray-900">{student.name}</td>
                        <td className="py-3 px-4 text-sm text-gray-900">{student.dept}</td>
                        <td className="py-3 px-4 text-sm text-gray-900">{student.section}</td>
                        <td className="py-3 px-4 text-sm text-gray-900">{calculateOverallScore(student)}%</td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getReadinessColor(student.placementReadiness)}`}>
                            {student.placementReadiness}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default StudentSearch;
