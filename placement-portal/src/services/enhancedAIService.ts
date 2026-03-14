// Enhanced AI Service for Mock Interview and AI Agent
// This simulates advanced AI responses. In production, replace with actual AI API calls.

interface AIMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface InterviewAnalysis {
  confidence: number;
  clarity: number;
  technicalAccuracy: number;
  communication: number;
  overallScore: number;
  feedback: string[];
}

// Mock Interview AI Responses
export const mockInterviewAI = {
  generateQuestion: (category: string, previousQuestions: string[] = []) => {
    const questions = {
      technical: [
        "Can you explain the difference between React hooks and class components?",
        "How would you optimize a database query that's running slowly?",
        "What is the time complexity of binary search and when would you use it?",
        "Explain the concept of RESTful API design principles.",
        "How do you handle state management in large React applications?",
        "What's the difference between SQL and NoSQL databases?",
        "Explain the concept of microservices architecture.",
        "How do you implement authentication in web applications?"
      ],
      behavioral: [
        "Tell me about a time when you had to work with a difficult team member.",
        "Describe a situation where you had to learn a new technology quickly.",
        "How do you handle tight deadlines and pressure?",
        "Tell me about a project you're most proud of and why.",
        "How do you stay updated with the latest technology trends?",
        "Describe a time when you made a mistake and how you handled it.",
        "How do you approach problem-solving when faced with a challenge?",
        "Tell me about your experience working in a team environment."
      ],
      situational: [
        "If you were assigned a project with unclear requirements, how would you proceed?",
        "How would you handle a situation where you disagree with your team's approach?",
        "What would you do if you discovered a critical bug just before a product launch?",
        "How would you prioritize multiple tasks with competing deadlines?",
        "If you had to explain a technical concept to a non-technical person, how would you do it?",
        "What would you do if you saw a colleague struggling with their work?",
        "How would you handle a situation where your code review was rejected?",
        "What steps would you take to improve a poorly performing application?"
      ]
    };

    const categoryQuestions = questions[category as keyof typeof questions] || questions.technical;
    const availableQuestions = categoryQuestions.filter(q => !previousQuestions.includes(q));
    
    if (availableQuestions.length === 0) {
      return categoryQuestions[Math.floor(Math.random() * categoryQuestions.length)];
    }
    
    return availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
  },

  analyzeResponse: async (audioData?: Blob, videoData?: Blob): Promise<Partial<InterviewAnalysis>> => {
    // Simulate AI analysis delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simulate confidence analysis based on video/audio
    let confidenceScore = 70 + Math.random() * 20;
    
    if (videoData) {
      // Simulate video analysis (confidence, eye contact, expressions)
      confidenceScore += Math.random() * 10;
    }
    
    if (audioData) {
      // Simulate audio analysis (clarity, pace, tone)
      confidenceScore += Math.random() * 5;
    }

    const analysis: Partial<InterviewAnalysis> = {
      confidence: Math.round(confidenceScore),
      clarity: Math.round(65 + Math.random() * 25),
      technicalAccuracy: Math.round(60 + Math.random() * 30),
      communication: Math.round(70 + Math.random() * 20),
      overallScore: Math.round(confidenceScore * 0.4 + 75 * 0.6),
      feedback: [
        "Good eye contact during the interview",
        "Clear articulation of technical concepts", 
        "Well-structured responses to behavioral questions",
        "Consider providing more specific examples",
        "Work on reducing filler words"
      ]
    };

    return analysis;
  }
};

// AI Agent Service
export const getAIResponse = async (userMessage: string, history: AIMessage[]): Promise<string> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  const lowerMessage = userMessage.toLowerCase();
  
  // Context-aware responses based on conversation history
  const recentContext = history.slice(-3).map(h => h.content).join(' ').toLowerCase();
  
  if (lowerMessage.includes('skill') || lowerMessage.includes('improve')) {
    if (recentContext.includes('interview') || recentContext.includes('job')) {
      return "Based on your interview preparation, I recommend focusing on: 1) Advanced problem-solving skills, 2) Communication and presentation skills, 3) Latest technologies in your field. Would you like me to create a personalized skill development plan for your target role?";
    }
    return "Based on current industry trends, I recommend focusing on: 1) Advanced problem-solving skills, 2) Communication and presentation skills, 3) Latest technologies in your field. Would you like me to create a personalized skill development plan?";
  }
  
  if (lowerMessage.includes('interview') || lowerMessage.includes('prepare')) {
    if (recentContext.includes('mock') || recentContext.includes('practice')) {
      return "Great that you're practicing! For interview success: 1) Research the company thoroughly, 2) Practice STAR method for behavioral questions, 3) Prepare 3-5 key technical questions, 4) Have thoughtful questions for the interviewer. Would you like specific practice questions for your role?";
    }
    return "For interview success: 1) Research the company thoroughly, 2) Practice STAR method for behavioral questions, 3) Prepare 3-5 key technical questions, 4) Have thoughtful questions for the interviewer. Would you like specific practice questions?";
  }
  
  if (lowerMessage.includes('career') || lowerMessage.includes('path')) {
    return "Based on your profile, consider these paths: 1) Software Development (high demand), 2) Data Science (growing field), 3) Product Management (leadership track). Each requires different skill combinations. Which interests you most?";
  }
  
  if (lowerMessage.includes('resume') || lowerMessage.includes('ats')) {
    return "For ATS optimization: 1) Use standard section headers, 2) Include keywords from job descriptions, 3) Quantify achievements with metrics, 4) Keep formatting clean and simple. Would you like a specific template?";
  }
  
  if (lowerMessage.includes('placement') || lowerMessage.includes('job')) {
    return "Placement success factors: 1) Strong technical foundation (70% weight), 2) Communication skills (20% weight), 3) Project experience (10% weight). Focus on building 2-3 quality projects. Need specific company insights?";
  }
  
  if (lowerMessage.includes('company') || lowerMessage.includes('eligible')) {
    return "I can help you assess your eligibility for different companies! Based on your profile, I can analyze your match probability with top companies. Would you like me to check your eligibility for specific companies or roles?";
  }
  
  if (lowerMessage.includes('mock') && lowerMessage.includes('interview')) {
    return "The mock interview feature is excellent for practice! It includes: 1) AI-powered avatar interviewer, 2) Real-time camera access for confidence analysis, 3) NLP-based response analysis, 4) Detailed feedback on your performance. Would you like to start a practice session?";
  }
  
  if (lowerMessage.includes('help') || lowerMessage.includes('what can you do')) {
    return `I'm your AI career assistant! I can help you with:
      
🎯 Career guidance and path planning
💼 Interview preparation and mock interviews
📄 Resume optimization and ATS scoring
🏢 Company eligibility analysis
📊 Skill gap analysis and improvement plans
🎓 Learning resources and recommendations

What would you like to explore today?`;
  }
  
  return "I understand you're looking for guidance. Let me provide personalized advice based on current placement trends. Could you tell me more about your specific interests or concerns?";
};

// Resume Analyzer AI
export const resumeAnalyzerAI = {
  analyzeResume: async (file: File): Promise<{
    atsScore: number;
    keywords: string[];
    suggestions: string[];
    sections: string[];
    format: string;
  }> => {
    // Simulate analysis delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simulate different scores based on file type and size
    let baseScore = 70;
    if (file.type === 'application/pdf') baseScore += 10;
    if (file.size > 50000 && file.size < 2000000) baseScore += 5;

    const analysis = {
      atsScore: Math.round(baseScore + Math.random() * 20),
      keywords: [
        'JavaScript', 'React', 'Node.js', 'Python', 'Machine Learning',
        'SQL', 'Git', 'Agile', 'REST API', 'MongoDB'
      ].slice(0, 5 + Math.floor(Math.random() * 5)),
      suggestions: [
        'Add more quantifiable achievements with specific metrics',
        'Include a professional summary at the top',
        'Use action verbs to start bullet points',
        'Tailor your resume for each job application',
        'Remove irrelevant work experience',
        'Add technical skills section with proficiency levels'
      ].slice(0, 3 + Math.floor(Math.random() * 3)),
      sections: ['Contact', 'Summary', 'Experience', 'Education', 'Skills'],
      format: file.type.split('/')[1]?.toUpperCase() || 'Unknown'
    };

    return analysis;
  }
};

export default { getAIResponse, mockInterviewAI, resumeAnalyzerAI };
