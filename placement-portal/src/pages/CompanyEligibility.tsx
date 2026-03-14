import React, { useState, useEffect } from 'react';
import { Building, TrendingUp, Target, Award, Search, Filter, Star, MapPin, DollarSign, Users, Briefcase, Brain, CheckCircle, AlertCircle, X } from 'lucide-react';

interface Company {
  id: string;
  name: string;
  logo: string;
  industry: string;
  location: string;
  size: string;
  rating: number;
  eligibilityScore: number;
  requirements: {
    minCGPA: number;
    skills: string[];
    experience: string;
    backlogs: number;
  };
  salary: {
    min: number;
    max: number;
    currency: string;
  };
  roles: string[];
  description: string;
  benefits: string[];
  matchingSkills: string[];
  missingSkills: string[];
  probability: number;
  applicationDeadline: string;
}

const MOCK_INTERVIEW_STORAGE_KEY = 'placement_mock_interview_result';

const CompanyEligibility: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [sortBy, setSortBy] = useState('probability');
  const [loading, setLoading] = useState(true);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [mockInterviewScore, setMockInterviewScore] = useState<number | null>(null);

  // Sample company data - in real app, this would come from API
  const sampleCompanies: Company[] = [
    {
      id: '1',
      name: 'TechCorp Solutions',
      logo: 'TC',
      industry: 'Technology',
      location: 'Bangalore',
      size: '1000-5000',
      rating: 4.5,
      eligibilityScore: 85,
      requirements: {
        minCGPA: 7.0,
        skills: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
        experience: '0-2 years',
        backlogs: 0
      },
      salary: {
        min: 800000,
        max: 1200000,
        currency: 'INR'
      },
      roles: ['Software Engineer', 'Full Stack Developer', 'Frontend Developer'],
      description: 'Leading technology company specializing in web and mobile application development.',
      benefits: ['Health Insurance', 'Flexible Work Hours', 'Training Programs', 'Stock Options'],
      matchingSkills: ['JavaScript', 'React', 'Node.js'],
      missingSkills: ['MongoDB'],
      probability: 85,
      applicationDeadline: '2024-12-31'
    },
    {
      id: '2',
      name: 'DataMinds Analytics',
      logo: 'DM',
      industry: 'Data Science',
      location: 'Hyderabad',
      size: '500-1000',
      rating: 4.3,
      eligibilityScore: 78,
      requirements: {
        minCGPA: 7.5,
        skills: ['Python', 'Machine Learning', 'SQL', 'Data Visualization'],
        experience: '1-3 years',
        backlogs: 2
      },
      salary: {
        min: 1000000,
        max: 1500000,
        currency: 'INR'
      },
      roles: ['Data Scientist', 'ML Engineer', 'Data Analyst'],
      description: 'Innovative data science company focused on AI and machine learning solutions.',
      benefits: ['Research Opportunities', 'Conference Sponsorship', 'Gym Membership', 'Remote Work'],
      matchingSkills: ['Python', 'Machine Learning', 'SQL'],
      missingSkills: ['Data Visualization'],
      probability: 78,
      applicationDeadline: '2024-12-15'
    },
    {
      id: '3',
      name: 'CloudTech Systems',
      logo: 'CT',
      industry: 'Cloud Computing',
      location: 'Pune',
      size: '2000-5000',
      rating: 4.4,
      eligibilityScore: 72,
      requirements: {
        minCGPA: 6.5,
        skills: ['AWS', 'Docker', 'Kubernetes', 'DevOps'],
        experience: '0-2 years',
        backlogs: 1
      },
      salary: {
        min: 900000,
        max: 1300000,
        currency: 'INR'
      },
      roles: ['Cloud Engineer', 'DevOps Engineer', 'Site Reliability Engineer'],
      description: 'Cloud infrastructure provider with focus on enterprise solutions.',
      benefits: ['Cloud Certification Support', 'Remote Work Options', 'Health Insurance', 'Performance Bonus'],
      matchingSkills: [],
      missingSkills: ['AWS', 'Docker', 'Kubernetes', 'DevOps'],
      probability: 45,
      applicationDeadline: '2024-12-20'
    },
    {
      id: '4',
      name: 'FinTech Innovations',
      logo: 'FI',
      industry: 'Fintech',
      location: 'Mumbai',
      size: '100-500',
      rating: 4.6,
      eligibilityScore: 88,
      requirements: {
        minCGPA: 8.0,
        skills: ['Java', 'Spring Boot', 'Microservices', 'Blockchain'],
        experience: '0-1 years',
        backlogs: 0
      },
      salary: {
        min: 1100000,
        max: 1600000,
        currency: 'INR'
      },
      roles: ['Software Engineer', 'Backend Developer', 'Blockchain Developer'],
      description: 'Fast-growing fintech startup revolutionizing digital payments.',
      benefits: ['Equity Options', 'Flexible Hours', 'Learning Budget', 'Health Insurance'],
      matchingSkills: ['Java', 'Spring Boot'],
      missingSkills: ['Microservices', 'Blockchain'],
      probability: 72,
      applicationDeadline: '2024-12-25'
    },
    {
      id: '5',
      name: 'AI Robotics Lab',
      logo: 'AR',
      industry: 'AI/Robotics',
      location: 'Chennai',
      size: '50-100',
      rating: 4.2,
      eligibilityScore: 65,
      requirements: {
        minCGPA: 7.0,
        skills: ['Python', 'Computer Vision', 'TensorFlow', 'Robotics'],
        experience: '0-2 years',
        backlogs: 2
      },
      salary: {
        min: 700000,
        max: 1000000,
        currency: 'INR'
      },
      roles: ['AI Engineer', 'Robotics Engineer', 'Computer Vision Engineer'],
      description: 'Cutting-edge AI and robotics research organization.',
      benefits: ['Research Environment', 'Patent Opportunities', 'Flexible Schedule', 'Remote Work'],
      matchingSkills: ['Python', 'TensorFlow'],
      missingSkills: ['Computer Vision', 'Robotics'],
      probability: 58,
      applicationDeadline: '2024-12-18'
    }
  ];

  const industries = ['all', 'Technology', 'Data Science', 'Cloud Computing', 'Fintech', 'AI/Robotics'];
  const locations = ['all', 'Bangalore', 'Hyderabad', 'Pune', 'Mumbai', 'Chennai'];
  const sortOptions = [
    { value: 'probability', label: 'Match Probability' },
    { value: 'salary', label: 'Salary Range' },
    { value: 'rating', label: 'Company Rating' },
    { value: 'deadline', label: 'Application Deadline' }
  ];

  useEffect(() => {
    let score: number | null = null;
    try {
      const stored = localStorage.getItem(MOCK_INTERVIEW_STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        score = data.overallScore ?? data.confidence ?? null;
        setMockInterviewScore(score);
      }
    } catch (_) {}
    setTimeout(() => {
      let list = sampleCompanies;
      if (score != null) {
        list = list.map(c => ({
          ...c,
          probability: Math.min(95, Math.round(c.probability * 0.7 + (score! / 100) * 30))
        }));
      }
      setCompanies(list);
      setFilteredCompanies(list);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = companies;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(company =>
        company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.roles.some(role => role.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by industry
    if (selectedIndustry !== 'all') {
      filtered = filtered.filter(company => company.industry === selectedIndustry);
    }

    // Filter by location
    if (selectedLocation !== 'all') {
      filtered = filtered.filter(company => company.location === selectedLocation);
    }

    // Sort
    switch (sortBy) {
      case 'probability':
        filtered.sort((a, b) => b.probability - a.probability);
        break;
      case 'salary':
        filtered.sort((a, b) => b.salary.max - a.salary.max);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'deadline':
        filtered.sort((a, b) => new Date(a.applicationDeadline).getTime() - new Date(b.applicationDeadline).getTime());
        break;
    }

    setFilteredCompanies(filtered);
  }, [companies, searchTerm, selectedIndustry, selectedLocation, sortBy]);

  const getProbabilityColor = (probability: number) => {
    if (probability >= 80) return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300';
    if (probability >= 60) return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300';
    return 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-300';
  };

  const getProbabilityLabel = (probability: number) => {
    if (probability >= 80) return 'High Match';
    if (probability >= 60) return 'Medium Match';
    return 'Low Match';
  };

  const formatSalary = (salary: { min: number; max: number; currency: string }) => {
    const format = (num: number) => {
      if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
      if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
      return num.toString();
    };
    return `${salary.currency} ${format(salary.min)} - ${format(salary.max)}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Analyzing company eligibility...</p>
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
              <Building className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            Company Eligibility Predictor
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            AI-powered analysis of your eligibility for top companies
          </p>
          {mockInterviewScore != null && (
            <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
              Eligibility adjusted using your Mock Interview score ({mockInterviewScore}%)
            </p>
          )}
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Search Companies
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name, industry, or role..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Industry
              </label>
              <select
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                {industries.map(industry => (
                  <option key={industry} value={industry}>
                    {industry === 'all' ? 'All Industries' : industry}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Location
              </label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                {locations.map(location => (
                  <option key={location} value={location}>
                    {location === 'all' ? 'All Locations' : location}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Company Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredCompanies.map((company) => (
            <div
              key={company.id}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 cursor-pointer"
              onClick={() => setSelectedCompany(company)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                    {company.logo}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                      {company.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {company.industry} • {company.location}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${getProbabilityColor(company.probability)}`}>
                    {getProbabilityLabel(company.probability)}
                  </div>
                  <div className="text-2xl font-bold text-gray-800 dark:text-white mt-1">
                    {company.probability}%
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {company.rating} Rating
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {formatSalary(company.salary)}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {company.size} employees
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Briefcase className="w-4 h-4 text-purple-500" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {company.requirements.experience}
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                  Key Roles: {company.roles.slice(0, 3).join(', ')}
                  {company.roles.length > 3 && ` +${company.roles.length - 3} more`}
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {company.matchingSkills.slice(0, 3).map((skill, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 rounded-full text-xs"
                    >
                      {skill}
                    </span>
                  ))}
                  {company.missingSkills.length > 0 && (
                    <span className="px-2 py-1 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 rounded-full text-xs">
                      +{company.missingSkills.length} missing
                    </span>
                  )}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Deadline: {new Date(company.applicationDeadline).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Company Detail Modal */}
        {selectedCompany && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                      {selectedCompany.logo}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                        {selectedCompany.name}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-300">
                        {selectedCompany.industry} • {selectedCompany.location}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedCompany(null)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-white mb-4">Company Overview</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {selectedCompany.description}
                    </p>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Company Size</span>
                        <span className="font-medium text-gray-800 dark:text-white">{selectedCompany.size}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Rating</span>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span className="font-medium text-gray-800 dark:text-white">{selectedCompany.rating}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Salary Range</span>
                        <span className="font-medium text-gray-800 dark:text-white">
                          {formatSalary(selectedCompany.salary)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Experience Required</span>
                        <span className="font-medium text-gray-800 dark:text-white">
                          {selectedCompany.requirements.experience}
                        </span>
                      </div>
                    </div>

                    <div className="mt-6">
                      <h4 className="font-semibold text-gray-800 dark:text-white mb-3">Benefits</h4>
                      <div className="space-y-2">
                        {selectedCompany.benefits.map((benefit, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-white mb-4">Eligibility Analysis</h3>
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-600 dark:text-gray-300">Match Probability</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getProbabilityColor(selectedCompany.probability)}`}>
                          {selectedCompany.probability}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                          style={{ width: `${selectedCompany.probability}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-800 dark:text-white mb-2">Requirements</h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600 dark:text-gray-300">Minimum CGPA</span>
                            <span className="font-medium text-gray-800 dark:text-white">
                              {selectedCompany.requirements.minCGPA}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600 dark:text-gray-300">Allowed Backlogs</span>
                            <span className="font-medium text-gray-800 dark:text-white">
                              {selectedCompany.requirements.backlogs}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-800 dark:text-white mb-2">Skills Match</h4>
                        <div className="space-y-2">
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Matching Skills</p>
                            <div className="flex flex-wrap gap-1">
                              {selectedCompany.matchingSkills.map((skill, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 rounded-full text-xs"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Missing Skills</p>
                            <div className="flex flex-wrap gap-1">
                              {selectedCompany.missingSkills.map((skill, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 rounded-full text-xs"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-800 dark:text-white mb-2">Available Roles</h4>
                        <div className="space-y-1">
                          {selectedCompany.roles.map((role, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <Briefcase className="w-3 h-3 text-blue-500" />
                              <span className="text-gray-700 dark:text-gray-300 text-sm">{role}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-4">
                  <button
                    onClick={() => setSelectedCompany(null)}
                    className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Close
                  </button>
                  <button className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:shadow-lg transition-all duration-200">
                    Apply Now
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

export default CompanyEligibility;
