import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Video, VideoOff, Mic, MicOff, MessageCircle, Brain, Award, Clock, Camera, Monitor, FileDown, AlertCircle, Volume2 } from 'lucide-react';

interface InterviewQuestion {
  id: string;
  question: string;
  category: 'technical' | 'behavioral' | 'situational';
  difficulty: 'easy' | 'medium' | 'hard';
  expectedAnswer?: string;
}

interface AnalysisResult {
  confidence: number;
  clarity: number;
  technicalAccuracy: number;
  communication: number;
  overallScore: number;
  feedback: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
  speakingTime: number;
  fillersCount: number;
}

interface SentimentData {
  positivity: number;
  confidence: number;
  engagement: number;
  speaking: boolean;
}

const MOCK_INTERVIEW_STORAGE_KEY = 'placement_mock_interview_result';

const MockInterview: React.FC = () => {
  const [isInterviewActive, setIsInterviewActive] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isAudioOn, setIsAudioOn] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [interviewTime, setInterviewTime] = useState(0);
  const [transcript, setTranscript] = useState<string[]>([]);
  const [userResponses, setUserResponses] = useState<string[]>([]);
  const [liveConfidence, setLiveConfidence] = useState<number | null>(null);
  const [avatarSpeaking, setAvatarSpeaking] = useState(false);
  const [cameraPermission, setCameraPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');
  const [microphonePermission, setMicrophonePermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');
  const [sentiment, setSentiment] = useState<SentimentData>({
    positivity: 50,
    confidence: 50,
    engagement: 50,
    speaking: false
  });
  const [isListening, setIsListening] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const confidenceIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const trackingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const sentimentIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastAvgRef = useRef<number>(0);

  // Text-to-Speech function
  const speakQuestion = useCallback((text: string) => {
    if (!speechSupported || !('speechSynthesis' in window)) {
      console.log('Speech synthesis not supported');
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9; // Slightly slower for clarity
    utterance.pitch = 1.0; // Natural pitch
    utterance.volume = 1.0;
    
    // Set female voice for more natural interview experience
    const voices = window.speechSynthesis.getVoices();
    const femaleVoice = voices.find(voice => 
      voice.name.includes('female') || 
      voice.name.includes('woman') || 
      voice.name.includes('Samantha') ||
      voice.name.includes('Karen')
    ) || voices[0];
    
    if (femaleVoice) {
      utterance.voice = femaleVoice;
    }
    
    utterance.onstart = () => {
      setIsAISpeaking(true);
      setAvatarSpeaking(true);
    };
    
    utterance.onend = () => {
      setIsAISpeaking(false);
      setAvatarSpeaking(false);
    };
    
    window.speechSynthesis.speak(utterance);
  }, [speechSupported]);

  // Enhanced sentiment analysis
  const analyzeSentiment = useCallback((audioData: Uint8Array) => {
    // Calculate audio features
    const average = Array.from(audioData).reduce((a, b) => a + b) / audioData.length;
    const variance = Array.from(audioData).reduce((sum, val) => sum + Math.pow(val - average, 2), 0) / audioData.length;
    const maxVolume = Math.max(...Array.from(audioData));
    
    // Speaking detection with better threshold
    const isSpeaking = average > 15 && maxVolume > 50;
    setIsListening(isSpeaking);
    
    if (isSpeaking) {
      // Enhanced sentiment calculation
      const energy = average / 255; // Normalized energy
      const consistency = 1 - (variance / (255 * 255)); // Consistency of speech
      const engagement = Math.min(100, (energy * 100 + consistency * 50));
      
      setSentiment(prev => ({
        ...prev,
        speaking: true,
        engagement: Math.min(100, prev.engagement + 3),
        confidence: Math.min(100, prev.confidence + 2),
        positivity: engagement > 60 ? Math.min(100, prev.positivity + 1) : Math.max(0, prev.positivity - 0.5)
      }));
      
      setLiveConfidence(prev => {
        const newConfidence = Math.min(95, Math.max(20, prev ? prev + 2 : 65));
        return newConfidence;
      });
    } else {
      setSentiment(prev => ({
        ...prev,
        speaking: false,
        engagement: Math.max(0, prev.engagement - 1)
      }));
    }
    
    setAudioLevel(average);
  }, []);

  const questions: InterviewQuestion[] = [
    {
      id: '1',
      question: 'Tell me about yourself and your background in computer science.',
      category: 'behavioral',
      difficulty: 'easy'
    },
    {
      id: '2',
      question: 'What are your strengths and weaknesses as a developer?',
      category: 'behavioral',
      difficulty: 'medium'
    },
    {
      id: '3',
      question: 'Explain the difference between REST and GraphQL APIs.',
      category: 'technical',
      difficulty: 'medium'
    },
    {
      id: '4',
      question: 'How would you handle a situation where you disagree with your team lead?',
      category: 'situational',
      difficulty: 'hard'
    },
    {
      id: '5',
      question: 'Describe a challenging project you worked on and how you overcame obstacles.',
      category: 'behavioral',
      difficulty: 'medium'
    }
  ];

  // Check camera and microphone permissions
  const checkPermissions = async () => {
    try {
      // Check camera permission
      const cameraResult = await navigator.permissions.query({ name: 'camera' as PermissionName });
      setCameraPermission(cameraResult.state as 'granted' | 'denied' | 'prompt');
      
      // Check microphone permission
      const micResult = await navigator.permissions.query({ name: 'microphone' as PermissionName });
      setMicrophonePermission(micResult.state as 'granted' | 'denied' | 'prompt');
    } catch (error) {
      console.log('Permission check failed:', error);
    }
  };

  useEffect(() => {
    checkPermissions();
  }, []);

  // Enhanced audio level detection
  const detectAudioLevel = useCallback(() => {
    if (analyserRef.current && streamRef.current) {
      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
      analyserRef.current.getByteFrequencyData(dataArray);
      
      // Use enhanced sentiment analysis
      analyzeSentiment(dataArray);
    }
  }, [analyzeSentiment]);

  // Setup audio analysis
  const setupAudioAnalysis = useCallback(async () => {
    if (streamRef.current && !audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      
      const source = audioContextRef.current.createMediaStreamSource(streamRef.current);
      source.connect(analyserRef.current);
      
      // Start audio level detection
      sentimentIntervalRef.current = setInterval(detectAudioLevel, 100);
    }
  }, [detectAudioLevel]);

  // Enhanced camera start with permission handling
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsVideoOn(true);
        setIsAudioOn(true);
        setCameraPermission('granted');
        setMicrophonePermission('granted');
      }
      
      await setupAudioAnalysis();
      
      // Start confidence tracking
      startConfidenceTracking();
      
    } catch (error) {
      console.error('Camera/microphone access denied:', error);
      setCameraPermission('denied');
      setMicrophonePermission('denied');
      
      // Show user-friendly message
      window.alert('Please allow camera and microphone access to use the mock interview feature. You can test without camera, but audio is recommended for better analysis.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      setIsVideoOn(false);
      setIsAudioOn(false);
    }
    
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
      analyserRef.current = null;
    }
    
    if (sentimentIntervalRef.current) {
      clearInterval(sentimentIntervalRef.current);
      sentimentIntervalRef.current = null;
    }
    
    if (confidenceIntervalRef.current) {
      clearInterval(confidenceIntervalRef.current);
      confidenceIntervalRef.current = null;
    }
  };

  // Enhanced confidence tracking with real-time feedback
  const startConfidenceTracking = () => {
    confidenceIntervalRef.current = setInterval(() => {
      if (streamRef.current && videoRef.current) {
        // Simulate confidence detection with more realistic variation
        const baseConfidence = 65;
        const variation = Math.sin(Date.now() / 2000) * 15;
        const noise = Math.random() * 10 - 5;
        const confidence = Math.max(20, Math.min(95, baseConfidence + variation + noise));
        
        setLiveConfidence(confidence);
        
        // Update avatar state based on confidence
        setAvatarSpeaking(confidence > 70);
      }
    }, 500);
  };

  const startInterview = async () => {
    if (cameraPermission === 'denied' || microphonePermission === 'denied') {
      const proceed = window.confirm('Camera or microphone access was denied. Would you like to proceed with a simulated interview?');
      if (!proceed) return;
    }
    
    // Check speech synthesis support
    if (!('speechSynthesis' in window)) {
      setSpeechSupported(false);
      console.log('Speech synthesis not supported in this browser');
    } else {
      // Load voices
      window.speechSynthesis.getVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = () => {
          window.speechSynthesis.getVoices();
        };
      }
    }
    
    await startCamera();
    setIsInterviewActive(true);
    setCurrentQuestionIndex(0);
    setInterviewTime(0);
    setTranscript([]);
    setUserResponses([]);
    setShowResults(false);
    setAnalysis(null);
    setLiveConfidence(null);
    setAvatarSpeaking(true);
    setSentiment({
      positivity: 50,
      confidence: 50,
      engagement: 50,
      speaking: false
    });
    
    // Speak the first question after a short delay
    setTimeout(() => {
      const firstQuestion = questions[0].question;
      speakQuestion(firstQuestion);
    }, 2000);
  };

  const stopInterview = () => {
    setIsInterviewActive(false);
    stopCamera();
    if (isRecording) {
      stopRecording();
    }
    generateAnalysis();
  };

  const startRecording = () => {
    if (streamRef.current) {
      const mediaRecorder = new MediaRecorder(streamRef.current);
      mediaRecorderRef.current = mediaRecorder;
      
      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        simulateTranscription();
      };
      
      mediaRecorder.start();
      setIsRecording(true);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const simulateTranscription = () => {
    const responses = [
      "I have experience with React, Node.js, and Python development.",
      "I believe my strengths are problem-solving and teamwork.",
      "REST uses HTTP methods while GraphQL uses a single endpoint.",
      "I would discuss my concerns respectfully with my team lead.",
      "I worked on an e-commerce platform with complex payment integration."
    ];
    
    const response = responses[currentQuestionIndex] || "I understand the question and would answer based on my experience.";
    setUserResponses(prev => [...prev, response]);
    setTranscript(prev => [...prev, response]);
  };

  const generateAnalysis = () => {
    const confidenceScore = liveConfidence || 75;
    const sentimentScore = sentiment.confidence;
    
    const analysis: AnalysisResult = {
      confidence: confidenceScore,
      clarity: Math.min(100, confidenceScore + Math.random() * 10),
      technicalAccuracy: Math.min(100, 70 + Math.random() * 25),
      communication: Math.min(100, sentimentScore + Math.random() * 15),
      overallScore: Math.min(100, (confidenceScore + sentimentScore) / 2 + Math.random() * 10),
      sentiment: sentiment.confidence > 70 ? 'positive' : sentiment.confidence > 40 ? 'neutral' : 'negative',
      speakingTime: interviewTime,
      fillersCount: Math.floor(Math.random() * 8),
      feedback: [
        "Good eye contact maintained throughout the interview",
        "Clear articulation of technical concepts",
        "Well-structured responses with relevant examples",
        "Could improve on providing more specific details",
        "Consider adding more enthusiasm when discussing achievements"
      ]
    };
    
    setAnalysis(analysis);
    setShowResults(true);
    
    // Save to localStorage
    localStorage.setItem(MOCK_INTERVIEW_STORAGE_KEY, JSON.stringify(analysis));
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-600';
      case 'negative': return 'text-red-600';
      default: return 'text-yellow-600';
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isInterviewActive) {
      interval = setInterval(() => {
        setInterviewTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isInterviewActive]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const nextQuestion = () => {
    // Stop any ongoing speech
    if (speechSupported && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    
    if (currentQuestionIndex < questions.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      setAvatarSpeaking(true);
      
      // Speak the next question
      setTimeout(() => {
        const nextQuestionText = questions[nextIndex].question;
        speakQuestion(nextQuestionText);
      }, 1000);
    } else {
      stopInterview();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            AI Mock Interview
          </h1>
          <p className="text-gray-600">
            Practice with our advanced AI avatar and get real-time sentiment analysis
          </p>
        </div>

        {/* Permission Warnings */}
        {(cameraPermission === 'denied' || microphonePermission === 'denied') && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              <div className="text-yellow-800">
                <p className="font-semibold">Permissions Required</p>
                <p className="text-sm">
                  {cameraPermission === 'denied' && 'Camera access is denied. '}
                  {microphonePermission === 'denied' && 'Microphone access is denied. '}
                  Please enable permissions in your browser settings for the best experience.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Main Interview Interface */}
        {!isInterviewActive ? (
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 mb-4">
                <Brain className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Ready for Your Mock Interview?
              </h2>
              <p className="text-gray-600 mb-6">
                Our AI interviewer will ask you {questions.length} questions and provide detailed feedback
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="p-4 bg-indigo-50 rounded-lg">
                  <Camera className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-800">Camera Analysis</h3>
                  <p className="text-sm text-gray-600">Real-time confidence tracking</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <Volume2 className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-800">Voice Analysis</h3>
                  <p className="text-sm text-gray-600">Sentiment and engagement detection</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <Award className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-800">Instant Feedback</h3>
                  <p className="text-sm text-gray-600">Detailed performance analysis</p>
                </div>
              </div>
            </div>
            
            <button
              onClick={startInterview}
              className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              Start Mock Interview
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: User Video & AI Avatar */}
            <div className="lg:col-span-7 flex flex-col">
              <div className="flex-1 bg-gradient-to-b from-slate-800 to-slate-900 rounded-2xl shadow-2xl overflow-hidden relative min-h-[400px]">
                {/* User Video - Main Background */}
                {isVideoOn && streamRef.current ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover transform scale-x-[-1]"
                  />
                ) : (
                  /* Placeholder when no video */
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
                    <div className="text-center">
                      <Video className="w-16 h-16 text-slate-500 mx-auto mb-4" />
                      <p className="text-slate-400 text-lg">Camera is off</p>
                      <p className="text-slate-500 text-sm mt-2">Enable camera for better experience</p>
                    </div>
                  </div>
                )}
                
                {/* AI Avatar Overlay - Positioned as Interviewer */}
                <div className="absolute top-4 right-4 z-10">
                  <div className="relative">
                    {/* Avatar Container */}
                    <div className={`relative transition-all duration-700 ${avatarSpeaking ? 'scale-105' : 'scale-100'}`}>
                      {/* Avatar Background */}
                      <div className="w-24 h-24 bg-gradient-to-b from-slate-600 to-slate-700 rounded-full shadow-2xl border-2 border-slate-500 flex items-center justify-center">
                        {/* Simplified Avatar */}
                        <div className="relative">
                          {/* Face */}
                          <div className="w-16 h-16 bg-gradient-to-b from-amber-100 to-amber-200 rounded-full shadow-lg relative">
                            {/* Eyes */}
                            <div className="absolute top-5 left-1/2 -translate-x-1/2 flex gap-3">
                              <div className={`w-3 h-3 bg-white rounded-full shadow-inner relative transition-all duration-300 ${avatarSpeaking ? 'scale-110' : 'scale-100'}`}>
                                <div className="absolute top-0.5 left-0.5 w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                                <div className="absolute top-1 left-1 w-0.5 h-0.5 bg-black rounded-full"></div>
                              </div>
                              <div className={`w-3 h-3 bg-white rounded-full shadow-inner relative transition-all duration-300 ${avatarSpeaking ? 'scale-110' : 'scale-100'}`}>
                                <div className="absolute top-0.5 left-0.5 w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                                <div className="absolute top-1 left-1 w-0.5 h-0.5 bg-black rounded-full"></div>
                              </div>
                            </div>
                            
                            {/* Nose */}
                            <div className="absolute top-9 left-1/2 -translate-x-1/2">
                              <div className="w-1 h-2 bg-gradient-to-b from-amber-300 to-amber-400 rounded-full"></div>
                            </div>
                            
                            {/* Mouth */}
                            <div className={`absolute top-12 left-1/2 -translate-x-1/2 transition-all duration-300 ${avatarSpeaking ? 'h-2' : 'h-1'}`}>
                              <div className="w-8 h-1 bg-gradient-to-b from-pink-400 to-pink-600 rounded-full shadow-sm">
                                {avatarSpeaking && (
                                  <div className="w-6 h-1.5 bg-white rounded-t-lg mt-0.5">
                                    <div className="flex justify-center gap-0.5">
                                      <div className="w-0.5 h-1 bg-gray-200 rounded"></div>
                                      <div className="w-0.5 h-1 bg-gray-200 rounded"></div>
                                      <div className="w-0.5 h-1 bg-gray-200 rounded"></div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Avatar Label */}
                      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-slate-800 px-3 py-1 rounded-full">
                        <span className="text-xs text-white font-medium">AI Interviewer</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Status Indicators */}
                <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                  <div className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
                    isAISpeaking
                      ? 'bg-purple-500 text-white animate-pulse' 
                      : avatarSpeaking 
                      ? 'bg-green-500 text-white animate-pulse' 
                      : isListening
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-600 text-gray-300'
                  }`}>
                    {isAISpeaking ? 'AI Speaking' : avatarSpeaking ? 'Speaking' : isListening ? 'Listening' : 'Waiting'}
                  </div>
                  {isListening && (
                    <div className="px-3 py-1 bg-orange-500 text-white rounded-full text-xs font-medium animate-pulse">
                      Analyzing...
                    </div>
                  )}
                  {isAISpeaking && (
                    <div className="px-3 py-1 bg-purple-500 text-white rounded-full text-xs font-medium animate-pulse">
                      🎵 AI Speaking
                    </div>
                  )}
                </div>
                
                {/* Audio Level Indicator */}
                {isAudioOn && (
                  <div className="absolute bottom-4 left-4 right-4 z-10">
                    <div className="bg-black/70 backdrop-blur-sm rounded-full p-3">
                      <div className="flex items-center space-x-3">
                        <Volume2 className="w-5 h-5 text-white" />
                        <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-100"
                            style={{ width: `${audioLevel}%` }}
                          ></div>
                        </div>
                        <span className="text-white text-xs font-medium">{Math.round(audioLevel)}%</span>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Camera Status */}
                <div className="absolute bottom-4 right-4 z-10">
                  <div className={`px-3 py-2 rounded-lg backdrop-blur-sm ${
                    isVideoOn 
                      ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                      : 'bg-red-500/20 text-red-300 border border-red-500/30'
                  }`}>
                    <div className="flex items-center space-x-2">
                      <Video className="w-4 h-4" />
                      <span className="text-xs font-medium">
                        {isVideoOn ? 'Camera On' : 'Camera Off'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <canvas ref={canvasRef} className="hidden" />
              </div>
              
              {/* Current Question */}
              <div className="mt-6 bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </h3>
                <p className="text-gray-700 text-lg leading-relaxed">
                  {questions[currentQuestionIndex].question}
                </p>
                <div className="mt-4 flex items-center space-x-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    questions[currentQuestionIndex].category === 'technical' ? 'bg-blue-100 text-blue-700' :
                    questions[currentQuestionIndex].category === 'behavioral' ? 'bg-green-100 text-green-700' :
                    'bg-purple-100 text-purple-700'
                  }`}>
                    {questions[currentQuestionIndex].category}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    questions[currentQuestionIndex].difficulty === 'easy' ? 'bg-gray-100 text-gray-700' :
                    questions[currentQuestionIndex].difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {questions[currentQuestionIndex].difficulty}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Controls and Analysis */}
            <div className="lg:col-span-5 space-y-6">
              {/* Live Metrics */}
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Live Analysis</h3>
                
                {/* Confidence */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Confidence</span>
                    <span className={`text-sm font-bold ${getScoreColor(liveConfidence || 0)}`}>
                      {liveConfidence || 0}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
                      style={{ width: `${liveConfidence || 0}%` }}
                    ></div>
                  </div>
                </div>

                {/* Sentiment Analysis */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Sentiment</span>
                    <span className={`text-sm font-bold ${getSentimentColor(sentiment.confidence > 70 ? 'positive' : sentiment.confidence > 40 ? 'neutral' : 'negative')}`}>
                      {sentiment.confidence > 70 ? 'Positive' : sentiment.confidence > 40 ? 'Neutral' : 'Negative'}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 ${
                        sentiment.confidence > 70 ? 'bg-green-500' : 
                        sentiment.confidence > 40 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${sentiment.confidence}%` }}
                    ></div>
                  </div>
                </div>

                {/* Engagement */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Engagement</span>
                    <span className="text-sm font-bold text-purple-600">
                      {sentiment.engagement}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
                      style={{ width: `${sentiment.engagement}%` }}
                    ></div>
                  </div>
                </div>

                {/* Speaking Status */}
                <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                  <div className={`w-2 h-2 rounded-full ${isListening ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
                  <span className="text-sm text-gray-700">
                    {isListening ? 'Speaking detected' : 'Waiting for response...'}
                  </span>
                </div>
              </div>

              {/* Controls */}
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Controls</h3>
                
                <div className="space-y-4">
                  {/* Camera Control */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Video className="w-5 h-5 text-gray-600" />
                      <span className="text-sm text-gray-700">Camera</span>
                    </div>
                    <button
                      onClick={() => isVideoOn ? stopCamera() : startCamera()}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        isVideoOn 
                          ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {isVideoOn ? 'On' : 'Off'}
                    </button>
                  </div>

                  {/* Microphone Control */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Mic className="w-5 h-5 text-gray-600" />
                      <span className="text-sm text-gray-700">Microphone</span>
                    </div>
                    <button
                      onClick={() => isAudioOn ? stopCamera() : startCamera()}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        isAudioOn 
                          ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {isAudioOn ? 'On' : 'Off'}
                    </button>
                  </div>

                  {/* Recording Control */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <MessageCircle className="w-5 h-5 text-gray-600" />
                      <span className="text-sm text-gray-700">Recording</span>
                    </div>
                    <button
                      onClick={() => isRecording ? stopRecording() : startRecording()}
                      disabled={!isAudioOn}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        isRecording 
                          ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                          : isAudioOn
                          ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {isRecording ? 'Stop' : 'Start'}
                    </button>
                  </div>
                </div>

                {/* Timer */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-5 h-5 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">Interview Time</span>
                    </div>
                    <span className="text-lg font-bold text-gray-800">{formatTime(interviewTime)}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 space-y-3">
                  <button
                    onClick={() => speakQuestion(questions[currentQuestionIndex].question)}
                    disabled={!speechSupported || isAISpeaking}
                    className="w-full px-4 py-3 bg-purple-100 text-purple-700 rounded-lg font-medium hover:bg-purple-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>{isAISpeaking ? 'AI Speaking...' : 'Repeat Question'}</span>
                  </button>
                  
                  <button
                    onClick={nextQuestion}
                    disabled={isAISpeaking}
                    className="w-full px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Complete Interview'}
                  </button>
                  
                  <button
                    onClick={stopInterview}
                    className="w-full px-4 py-3 bg-red-100 text-red-700 rounded-lg font-medium hover:bg-red-200 transition-colors"
                  >
                    End Interview
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results Section */}
        {showResults && analysis && (
          <div className="mt-8 bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Interview Analysis Results</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-semibold text-gray-800 mb-2">Confidence</h3>
                <div className={`text-3xl font-bold ${getScoreColor(analysis.confidence)}`}>
                  {analysis.confidence}%
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-semibold text-gray-800 mb-2">Clarity</h3>
                <div className={`text-3xl font-bold ${getScoreColor(analysis.clarity)}`}>
                  {analysis.clarity}%
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-semibold text-gray-800 mb-2">Technical</h3>
                <div className={`text-3xl font-bold ${getScoreColor(analysis.technicalAccuracy)}`}>
                  {analysis.technicalAccuracy}%
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-semibold text-gray-800 mb-2">Communication</h3>
                <div className={`text-3xl font-bold ${getScoreColor(analysis.communication)}`}>
                  {analysis.communication}%
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-semibold text-gray-800 mb-4">Overall Score</h3>
                <div className="flex items-center justify-center">
                  <div className="relative">
                    <div className="w-32 h-32 rounded-full border-8 border-gray-200"></div>
                    <div
                      className="absolute top-0 left-0 w-32 h-32 rounded-full border-8 border-transparent border-t-blue-500"
                      style={{ 
                        transform: `rotate(${(analysis.overallScore / 100) * 360 - 90}deg)`,
                        borderTopColor: '#667eea'
                      }}
                    ></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                      <div className={`text-3xl font-bold ${getScoreColor(analysis.overallScore)}`}>
                        {analysis.overallScore}%
                      </div>
                      <div className="text-sm text-gray-600">Score</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-semibold text-gray-800 mb-4">Sentiment Analysis</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-700">Overall Sentiment</span>
                    <span className={`text-sm font-bold ${getSentimentColor(analysis.sentiment)}`}>
                      {analysis.sentiment.charAt(0).toUpperCase() + analysis.sentiment.slice(1)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-700">Speaking Time</span>
                    <span className="text-sm font-bold text-gray-800">{formatTime(analysis.speakingTime)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-700">Filler Words</span>
                    <span className="text-sm font-bold text-gray-800">{analysis.fillersCount}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <h3 className="font-semibold text-gray-800 mb-4">AI Feedback</h3>
              <div className="space-y-3">
                {analysis.feedback.map((feedback, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <Brain className="w-5 h-5 text-blue-500 mt-0.5" />
                    <p className="text-gray-700">{feedback}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => {
                  setShowResults(false);
                  setAnalysis(null);
                  setCurrentQuestionIndex(0);
                  setInterviewTime(0);
                }}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-colors"
              >
                Start New Interview
              </button>
              
              <button
                onClick={() => {
                  const dataStr = JSON.stringify(analysis, null, 2);
                  const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
                  const exportFileDefaultName = 'interview-analysis.json';
                  const linkElement = document.createElement('a');
                  linkElement.setAttribute('href', dataUri);
                  linkElement.setAttribute('download', exportFileDefaultName);
                  linkElement.click();
                }}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center space-x-2"
              >
                <FileDown className="w-5 h-5" />
                <span>Download Report</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MockInterview;
