import React, { useState, useEffect } from 'react';
import { Brain, BookOpen, Target, Play, ExternalLink, Clock, TrendingUp } from 'lucide-react';

interface Recommendation {
  id: string;
  title: string;
  description: string;
  type: 'course' | 'video' | 'practice' | 'project';
  priority: 'high' | 'medium' | 'low';
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  link?: string;
  completed?: boolean;
  progress?: number;
}

const Recommendations: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [studentData, setStudentData] = useState({
    name: 'John Doe',
    aptitudeScore: 75,
    technicalTestScore: 82,
    mockInterviewScore: 78,
    projectsCount: 3,
    problemsSolved: 45,
  });
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [filter, setFilter] = useState<'all' | 'course' | 'video' | 'practice' | 'project'>('all');

  useEffect(() => {
    generateRecommendations(studentData);
  }, [studentData]);

  const generateRecommendations = (data: any) => {
    const recs: Recommendation[] = [];

    // Aptitude recommendations
    if (data.aptitudeScore < 60) {
      recs.push({
        id: 'apt-basic',
        title: 'Quantitative Aptitude Fundamentals',
        description: 'Master the basics of quantitative aptitude with comprehensive practice',
        type: 'course',
        priority: 'high',
        duration: '4 weeks',
        difficulty: 'beginner',
        link: 'https://www.youtube.com/playlist?list=PLhI_oi7G9q9XqB2YcQgS4qL9Q5g5z5QZQ',
        progress: 25
      });
      recs.push({
        id: 'apt-practice-1',
        title: '1000+ Aptitude Problems',
        description: 'Practice thousands of aptitude questions with solutions',
        type: 'practice',
        priority: 'high',
        duration: '6 weeks',
        difficulty: 'beginner',
        progress: 15
      });
    } else if (data.aptitudeScore < 80) {
      recs.push({
        id: 'apt-advanced',
        title: 'Advanced Problem Solving',
        description: 'Tackle complex aptitude problems with advanced techniques',
        type: 'practice',
        priority: 'medium',
        duration: '3 weeks',
        difficulty: 'intermediate',
        progress: 60
      });
    }

    // Technical recommendations
    if (data.technicalTestScore < 60) {
      recs.push({
        id: 'tech-dsa',
        title: 'Data Structures & Algorithms Complete Course',
        description: 'Learn DSA from scratch with hands-on coding examples',
        type: 'video',
        priority: 'high',
        duration: '8 weeks',
        difficulty: 'beginner',
        link: 'https://www.youtube.com/playlist?list=PL_c9B4zLjBRm4A0k2s9mP5I7yI0l5y3XQZ',
        progress: 15
      });
      recs.push({
        id: 'tech-cpp',
        title: 'C++ Programming Mastery',
        description: 'Complete C++ course from basics to advanced concepts',
        type: 'course',
        priority: 'high',
        duration: '6 weeks',
        difficulty: 'beginner',
        progress: 20
      });
      recs.push({
        id: 'tech-java',
        title: 'Java Programming Full Course',
        description: 'Learn Java programming with real-world projects',
        type: 'video',
        priority: 'medium',
        duration: '7 weeks',
        difficulty: 'beginner',
        link: 'https://www.youtube.com/playlist?list=PLsyeobzVxlUL4erewTm5n1dV4h9I0sG2X',
        progress: 10
      });
    }

    // Interview recommendations
    if (data.mockInterviewScore < 60) {
      recs.push({
        id: 'interview-basics',
        title: 'Interview Preparation Masterclass',
        description: 'Complete guide to crack technical interviews',
        type: 'course',
        priority: 'high',
        duration: '6 weeks',
        difficulty: 'intermediate',
        link: 'https://www.youtube.com/playlist?list=PLDo8Ofma4qXqIQcU7IYlRqk4b3x5v5Y5Y',
        progress: 30
      });
      recs.push({
        id: 'interview-questions',
        title: '500+ Interview Questions',
        description: 'Most frequently asked interview questions with solutions',
        type: 'practice',
        priority: 'high',
        duration: '4 weeks',
        difficulty: 'intermediate',
        progress: 25
      });
      recs.push({
        id: 'interview-behavioral',
        title: 'Behavioral Interview Skills',
        description: 'Master behavioral and HR interview questions',
        type: 'video',
        priority: 'medium',
        duration: '2 weeks',
        difficulty: 'beginner',
        link: 'https://www.youtube.com/playlist?list=PLu0W_RiXn7pQa2qHrLQ0j6Xn6YdKqY6cY',
        progress: 40
      });
    }

    // Project recommendations
    if (data.projectsCount < 3) {
      recs.push({
        id: 'project-web',
        title: 'Build a Full-Stack Web Application',
        description: 'Create a complete web app using React, Node.js, and MongoDB',
        type: 'project',
        priority: 'high',
        duration: '4 weeks',
        difficulty: 'intermediate',
        progress: 0
      });
      recs.push({
        id: 'project-mobile',
        title: 'Mobile App Development',
        description: 'Build a mobile app using React Native or Flutter',
        type: 'project',
        priority: 'medium',
        duration: '5 weeks',
        difficulty: 'intermediate',
        progress: 0
      });
      recs.push({
        id: 'project-ml',
        title: 'Machine Learning Project',
        description: 'Create an ML project using Python and TensorFlow',
        type: 'project',
        priority: 'medium',
        duration: '6 weeks',
        difficulty: 'advanced',
        progress: 0
      });
    }

    // Problem solving recommendations
    if (data.problemsSolved < 50) {
      recs.push({
        id: 'practice-coding',
        title: 'Coding Practice Challenge',
        description: 'Solve 100+ coding problems to improve problem-solving skills',
        type: 'practice',
        priority: 'medium',
        duration: '6 weeks',
        difficulty: 'beginner',
        progress: 45
      });
      recs.push({
        id: 'practice-leetcode',
        title: 'LeetCode Problem Solving',
        description: 'Master LeetCode problems with detailed solutions',
        type: 'practice',
        priority: 'high',
        duration: '8 weeks',
        difficulty: 'intermediate',
        progress: 30
      });
    }

    // Additional recommendations for all students
    recs.push({
      id: 'soft-skills',
      title: 'Soft Skills Development',
      description: 'Improve communication, teamwork, and leadership skills',
      type: 'course',
      priority: 'medium',
      duration: '3 weeks',
      difficulty: 'beginner',
      progress: 50
    });
    
    recs.push({
      id: 'resume-building',
      title: 'Professional Resume Building',
      description: 'Create an impressive resume that gets you interviews',
      type: 'course',
      priority: 'high',
      duration: '2 weeks',
      difficulty: 'beginner',
      progress: 70
    });

    recs.push({
      id: 'linkedin-mastery',
      title: 'LinkedIn Profile Optimization',
      description: 'Optimize your LinkedIn profile for recruiters',
      type: 'video',
      priority: 'medium',
      duration: '1 week',
      difficulty: 'beginner',
      link: 'https://www.youtube.com/playlist?list=PLhI_oi7G9q9XqB2YcQgS4qL9Q5g5z5QZQ',
      progress: 85
    });

    recs.push({
      id: 'system-design',
      title: 'System Design Fundamentals',
      description: 'Learn system design concepts for technical interviews',
      type: 'course',
      priority: 'medium',
      duration: '5 weeks',
      difficulty: 'advanced',
      progress: 20
    });

    recs.push({
      id: 'competitive-programming',
      title: 'Competitive Programming',
      description: 'Master algorithms and data structures for coding competitions',
      type: 'practice',
      priority: 'low',
      duration: '10 weeks',
      difficulty: 'advanced',
      progress: 10
    });

    recs.push({
      id: 'database-skills',
      title: 'Database Management Systems',
      description: 'Learn SQL and NoSQL database concepts',
      type: 'course',
      priority: 'medium',
      duration: '4 weeks',
      difficulty: 'intermediate',
      progress: 35
    });

    recs.push({
      id: 'cloud-computing',
      title: 'Cloud Computing with AWS',
      description: 'Master cloud services and deployment',
      type: 'course',
      priority: 'low',
      duration: '6 weeks',
      difficulty: 'intermediate',
      progress: 15
    });

    recs.push({
      id: 'git-github',
      title: 'Git and GitHub Mastery',
      description: 'Learn version control and collaboration',
      type: 'video',
      priority: 'high',
      duration: '2 weeks',
      difficulty: 'beginner',
      link: 'https://www.youtube.com/playlist?list=PLhI_oi7G9q9XqB2YcQgS4qL9Q5g5z5QZQ',
      progress: 60
    });

    recs.push({
      id: 'python-django',
      title: 'Python Django Web Development',
      description: 'Build web applications using Python and Django',
      type: 'project',
      priority: 'medium',
      duration: '5 weeks',
      difficulty: 'intermediate',
      progress: 25
    });

    recs.push({
      id: 'android-dev',
      title: 'Android App Development',
      description: 'Create native Android applications',
      type: 'project',
      priority: 'low',
      duration: '6 weeks',
      difficulty: 'intermediate',
      progress: 5
    });

    // Advanced recommendations for high performers
    if (data.aptitudeScore >= 80 && data.technicalTestScore >= 80) {
      recs.push({
        id: 'advanced-systems',
        title: 'System Design Interview Prep',
        description: 'Learn system design concepts for FAANG interviews',
        type: 'course',
        priority: 'medium',
        duration: '5 weeks',
        difficulty: 'advanced',
        link: 'https://www.youtube.com/playlist?list=PLillR-RASN5v7U-N4-3Z4T5hJQ9IBaH7X',
        progress: 10
      });
    }

    setRecommendations(recs);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'course': return BookOpen;
      case 'video': return Play;
      case 'practice': return Target;
      case 'project': return Brain;
      default: return BookOpen;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'course': return 'text-blue-600 bg-blue-100';
      case 'video': return 'text-red-600 bg-red-100';
      case 'practice': return 'text-green-600 bg-green-100';
      case 'project': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-600';
      case 'intermediate': return 'text-yellow-600';
      case 'advanced': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const filteredRecommendations = filter === 'all' 
    ? recommendations 
    : recommendations.filter(rec => rec.type === filter);

  const handleComplete = (id: string) => {
    setRecommendations(prev => 
      prev.map(rec => 
        rec.id === id 
          ? { ...rec, completed: !rec.completed, progress: rec.completed ? 0 : 100 }
          : rec
      )
    );
  };

  if (loading) {
    return (
      <div className="p-6 pt-20">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 pt-20">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Personalized Recommendations</h1>
        
        {/* Performance Summary */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
            <TrendingUp className="w-6 h-6 mr-2 text-primary-600" />
            Your Performance Summary
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-800">{studentData.aptitudeScore}%</div>
              <div className="text-sm text-gray-600">Aptitude</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-800">{studentData.technicalTestScore}%</div>
              <div className="text-sm text-gray-600">Technical</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-800">{studentData.mockInterviewScore}%</div>
              <div className="text-sm text-gray-600">Interview</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-800">{studentData.projectsCount}</div>
              <div className="text-sm text-gray-600">Projects</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-800">{studentData.problemsSolved}</div>
              <div className="text-sm text-gray-600">Problems</div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8 border border-gray-200 dark:border-gray-700">
          <div className="flex flex-wrap gap-2">
            {['all', 'course', 'video', 'practice', 'project'].map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type as any)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                  filter === type
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Recommendations List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecommendations.map((rec) => {
            const Icon = getTypeIcon(rec.type);
            return (
              <div key={rec.id} className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-200 border border-gray-200 dark:border-gray-700 ${
                rec.completed ? 'opacity-75' : ''
              }`}>
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getTypeColor(rec.type)}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(rec.priority)}`}>
                      {rec.priority}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(rec.type)}`}>
                      {rec.type}
                    </span>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-800 mb-2">{rec.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{rec.description}</p>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{rec.duration}</span>
                    </div>
                    <div className={`font-medium ${getDifficultyColor(rec.difficulty)}`}>
                      {rec.difficulty}
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                {rec.progress !== undefined && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>{rec.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${rec.progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  {rec.link && (
                    <button
                      onClick={() => window.open(rec.link, '_blank')}
                      className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors duration-200 flex items-center justify-center"
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Open
                    </button>
                  )}
                  <button
                    onClick={() => handleComplete(rec.id)}
                    className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200 ${
                      rec.completed
                        ? 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {rec.completed ? 'Undo' : 'Complete'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredRecommendations.length === 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center border border-gray-200 dark:border-gray-700">
            <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No recommendations found</h3>
            <p className="text-gray-600">Try adjusting your filters or check back later for new recommendations.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Recommendations;
