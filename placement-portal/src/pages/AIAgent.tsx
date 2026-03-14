import React, { useState, useEffect, useRef } from 'react';
import { Brain, Send, User, Bot, Sparkles, TrendingUp, Target, BookOpen, Lightbulb, MessageCircle } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type?: 'suggestion' | 'guidance' | 'insight';
}

interface SuggestionCard {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  category: 'career' | 'skills' | 'interview' | 'resume';
  action: string;
}

const AIAgent: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm your placement and career coach. I can help with DSA & coding prep, interview tips (technical + STAR), resume/ATS, career path, salary/CGPA/backlogs, and time management. Ask anything or use the quick actions →",
      sender: 'ai',
      timestamp: new Date(),
      type: 'guidance'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestions: SuggestionCard[] = [
    {
      id: '1',
      title: 'Skill Gap Analysis',
      description: 'Identify strengths and areas to improve',
      icon: TrendingUp,
      category: 'skills',
      action: 'Analyze my skills and suggest where to focus'
    },
    {
      id: '2',
      title: 'Interview Preparation',
      description: 'Technical + behavioral tips and strategies',
      icon: MessageCircle,
      category: 'interview',
      action: 'How do I prepare for technical and HR interviews?'
    },
    {
      id: '3',
      title: 'DSA & Coding',
      description: 'LeetCode, patterns, and coding round prep',
      icon: Brain,
      category: 'skills',
      action: 'How should I prepare for DSA and coding rounds?'
    },
    {
      id: '4',
      title: 'Career Path Guidance',
      description: 'Explore roles: SDE, Data, PM based on profile',
      icon: Target,
      category: 'career',
      action: 'Career guidance and which role suits me'
    },
    {
      id: '5',
      title: 'Resume & ATS',
      description: 'Improve resume for better ATS scoring',
      icon: BookOpen,
      category: 'resume',
      action: 'Resume tips and ATS optimization'
    },
    {
      id: '6',
      title: 'Salary, CGPA & Backlogs',
      description: 'Package negotiation, low CGPA, backlogs',
      icon: Sparkles,
      category: 'career',
      action: 'I have backlogs / low CGPA. What can I do for placements?'
    }
  ];

  const followUpChips = [
    'Give me a 4-week preparation plan',
    'What about STAR / behavioral rounds?',
    'How do I choose between offers?',
    'Tell me more',
    'What if I have less than 3 months?'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const textToSend = inputText.trim();
    setInputText('');
    setIsTyping(true);

    const history = messages.map(m => ({
      role: m.sender === 'user' ? 'user' : 'assistant',
      content: m.text
    }));

    try {
      const { getAIResponse } = await import('../services/aiAgentService');
      const reply = await getAIResponse(textToSend, history);
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: reply,
        sender: 'ai',
        timestamp: new Date(),
        type: 'suggestion'
      };
      setMessages(prev => [...prev, aiResponse]);
    } catch (e) {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I couldn't process that. Please try again or rephrase your question.",
        sender: 'ai',
        timestamp: new Date(),
        type: 'guidance'
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSuggestionClick = (suggestion: SuggestionCard) => {
    setInputText(suggestion.action);
  };

  const handleFollowUpClick = (text: string) => {
    setInputText(text);
  };

  const getMessageIcon = (type?: string) => {
    switch (type) {
      case 'suggestion':
        return <Lightbulb className="w-4 h-4 text-yellow-500" />;
      case 'guidance':
        return <Target className="w-4 h-4 text-blue-500" />;
      case 'insight':
        return <Sparkles className="w-4 h-4 text-purple-500" />;
      default:
        return <Bot className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full">
              <Brain className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            AI Career Assistant
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Get personalized guidance for your placement journey
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat Area */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl h-[600px] flex flex-col">
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-white">AI Assistant</h3>
                    <p className="text-sm text-green-500">● Online</p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                        message.sender === 'user'
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white'
                      }`}
                    >
                      <div className="flex items-start space-x-2">
                        {message.sender === 'ai' && getMessageIcon(message.type)}
                        <p className="text-sm">{message.text}</p>
                      </div>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 dark:bg-gray-700 px-4 py-3 rounded-2xl flex items-center gap-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">Thinking...</span>
                    </div>
                  </div>
                )}
                {messages.length > 1 && messages[messages.length - 1]?.sender === 'ai' && !isTyping && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {followUpChips.map((chip, i) => (
                      <button
                        key={i}
                        onClick={() => handleFollowUpClick(chip)}
                        className="px-3 py-1.5 text-xs font-medium rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-800/60 transition-colors"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Ask me anything about placements, skills, or career guidance..."
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full hover:shadow-lg transition-all duration-200"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Suggestions Panel */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
              <h3 className="font-semibold text-gray-800 dark:text-white mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                {suggestions.map((suggestion) => {
                  const Icon = suggestion.icon;
                  return (
                    <button
                      key={suggestion.id}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full p-3 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200 text-left"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-800 dark:text-white text-sm">
                            {suggestion.title}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-300">
                            {suggestion.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Insights */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
              <h3 className="font-semibold text-gray-800 dark:text-white mb-4">
                Latest Insights
              </h3>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="flex items-center space-x-2 mb-1">
                    <Sparkles className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-medium text-blue-800 dark:text-blue-300">
                      Trending Skills
                    </span>
                  </div>
                  <p className="text-xs text-blue-700 dark:text-blue-400">
                    AI/ML and Cloud Computing are most in-demand skills this season
                  </p>
                </div>
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="flex items-center space-x-2 mb-1">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium text-green-800 dark:text-green-300">
                      Placement Tips
                    </span>
                  </div>
                  <p className="text-xs text-green-700 dark:text-green-400">
                    Students with 2+ projects have 40% higher placement rates
                  </p>
                </div>
                <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="flex items-center space-x-2 mb-1">
                    <Target className="w-4 h-4 text-purple-500" />
                    <span className="text-sm font-medium text-purple-800 dark:text-purple-300">
                      Career Advice
                    </span>
                  </div>
                  <p className="text-xs text-purple-700 dark:text-purple-400">
                    Start interview prep 3 months before placement season
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAgent;
