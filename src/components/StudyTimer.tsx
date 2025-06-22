import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  Square, 
  RotateCcw, 
  Clock, 
  Coffee, 
  Brain,
  Settings,
  Volume2,
  VolumeX,
  Timer,
  Target,
  Zap,
  Award,
  TrendingUp
} from 'lucide-react';

interface StudyTimerProps {
  onSessionComplete?: (duration: number, skillId?: string) => void;
}

interface TimerSettings {
  workDuration: number;
  shortBreak: number;
  longBreak: number;
  sessionsUntilLongBreak: number;
  soundEnabled: boolean;
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
}

type TimerMode = 'work' | 'shortBreak' | 'longBreak';
type TimerStatus = 'idle' | 'running' | 'paused';

const StudyTimer: React.FC<StudyTimerProps> = ({ onSessionComplete }) => {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [status, setStatus] = useState<TimerStatus>('idle');
  const [mode, setMode] = useState<TimerMode>('work');
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [currentSkill, setCurrentSkill] = useState<string>('');
  
  const [settings, setSettings] = useState<TimerSettings>({
    workDuration: 25,
    shortBreak: 5,
    longBreak: 15,
    sessionsUntilLongBreak: 4,
    soundEnabled: true,
    autoStartBreaks: false,
    autoStartPomodoros: false
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (status === 'running' && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimerComplete();
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [status, timeLeft]);

  const handleTimerComplete = () => {
    setStatus('idle');
    
    if (settings.soundEnabled) {
      playNotificationSound();
    }

    if (mode === 'work') {
      const newSessionsCompleted = sessionsCompleted + 1;
      setSessionsCompleted(newSessionsCompleted);
      
      if (onSessionComplete) {
        onSessionComplete(settings.workDuration, currentSkill);
      }

      // Determine next break type
      if (newSessionsCompleted % settings.sessionsUntilLongBreak === 0) {
        setMode('longBreak');
        setTimeLeft(settings.longBreak * 60);
      } else {
        setMode('shortBreak');
        setTimeLeft(settings.shortBreak * 60);
      }

      if (settings.autoStartBreaks) {
        setStatus('running');
      }
    } else {
      // Break completed, switch to work
      setMode('work');
      setTimeLeft(settings.workDuration * 60);
      
      if (settings.autoStartPomodoros) {
        setStatus('running');
      }
    }
  };

  const playNotificationSound = () => {
    // Create a simple beep sound
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  };

  const startTimer = () => {
    setStatus('running');
  };

  const pauseTimer = () => {
    setStatus('paused');
  };

  const stopTimer = () => {
    setStatus('idle');
    setMode('work');
    setTimeLeft(settings.workDuration * 60);
  };

  const resetTimer = () => {
    setStatus('idle');
    const duration = mode === 'work' ? settings.workDuration : 
                    mode === 'shortBreak' ? settings.shortBreak : settings.longBreak;
    setTimeLeft(duration * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    const totalDuration = mode === 'work' ? settings.workDuration * 60 : 
                         mode === 'shortBreak' ? settings.shortBreak * 60 : settings.longBreak * 60;
    return ((totalDuration - timeLeft) / totalDuration) * 100;
  };

  const getModeConfig = () => {
    switch (mode) {
      case 'work':
        return {
          title: 'Focus Time',
          icon: Brain,
          color: 'from-blue-500 to-indigo-600',
          bgColor: 'from-blue-50 to-indigo-50'
        };
      case 'shortBreak':
        return {
          title: 'Short Break',
          icon: Coffee,
          color: 'from-green-500 to-emerald-600',
          bgColor: 'from-green-50 to-emerald-50'
        };
      case 'longBreak':
        return {
          title: 'Long Break',
          icon: Coffee,
          color: 'from-purple-500 to-pink-600',
          bgColor: 'from-purple-50 to-pink-50'
        };
    }
  };

  const modeConfig = getModeConfig();
  const ModeIcon = modeConfig.icon;

  return (
    <div className="space-y-6">
      {/* Timer Display */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`bg-gradient-to-br ${modeConfig.bgColor} rounded-3xl p-8 shadow-xl border border-gray-200`}
      >
        <div className="text-center">
          {/* Mode Header */}
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className={`p-3 bg-gradient-to-r ${modeConfig.color} rounded-2xl`}>
              <ModeIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800">{modeConfig.title}</h3>
              <p className="text-gray-600">Session {sessionsCompleted + 1}</p>
            </div>
          </div>

          {/* Circular Progress */}
          <div className="relative w-64 h-64 mx-auto mb-8">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                className="text-gray-200"
              />
              {/* Progress circle */}
              <motion.circle
                cx="50"
                cy="50"
                r="45"
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                className={`text-gradient-to-r ${modeConfig.color}`}
                style={{
                  strokeDasharray: `${2 * Math.PI * 45}`,
                  strokeDashoffset: `${2 * Math.PI * 45 * (1 - getProgress() / 100)}`
                }}
                initial={{ strokeDashoffset: 2 * Math.PI * 45 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 45 * (1 - getProgress() / 100) }}
                transition={{ duration: 0.5 }}
              />
            </svg>
            
            {/* Time Display */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-5xl font-bold text-gray-800 mb-2">
                  {formatTime(timeLeft)}
                </div>
                <div className={`text-sm font-medium bg-gradient-to-r ${modeConfig.color} bg-clip-text text-transparent`}>
                  {status === 'running' ? 'In Progress' : status === 'paused' ? 'Paused' : 'Ready'}
                </div>
              </div>
            </div>
          </div>

          {/* Skill Selection */}
          {mode === 'work' && (
            <div className="mb-6">
              <input
                type="text"
                value={currentSkill}
                onChange={(e) => setCurrentSkill(e.target.value)}
                placeholder="What skill are you working on?"
                className="w-full max-w-sm px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none text-center"
              />
            </div>
          )}

          {/* Control Buttons */}
          <div className="flex items-center justify-center space-x-4">
            {status === 'idle' || status === 'paused' ? (
              <button
                onClick={startTimer}
                className={`px-8 py-4 bg-gradient-to-r ${modeConfig.color} text-white rounded-2xl hover:shadow-lg transition-all duration-200 flex items-center space-x-2 transform hover:scale-105`}
              >
                <Play className="h-5 w-5" />
                <span className="font-medium">{status === 'paused' ? 'Resume' : 'Start'}</span>
              </button>
            ) : (
              <button
                onClick={pauseTimer}
                className="px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-2xl hover:shadow-lg transition-all duration-200 flex items-center space-x-2 transform hover:scale-105"
              >
                <Pause className="h-5 w-5" />
                <span className="font-medium">Pause</span>
              </button>
            )}

            <button
              onClick={resetTimer}
              className="px-6 py-4 bg-gray-200 text-gray-700 rounded-2xl hover:bg-gray-300 transition-all duration-200 flex items-center space-x-2"
            >
              <RotateCcw className="h-5 w-5" />
              <span className="font-medium">Reset</span>
            </button>

            <button
              onClick={stopTimer}
              className="px-6 py-4 bg-red-500 text-white rounded-2xl hover:bg-red-600 transition-all duration-200 flex items-center space-x-2"
            >
              <Square className="h-5 w-5" />
              <span className="font-medium">Stop</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl">
              <Award className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{sessionsCompleted}</p>
              <p className="text-gray-600 text-sm">Sessions Today</p>
            </div>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{sessionsCompleted * settings.workDuration}</p>
              <p className="text-gray-600 text-sm">Minutes Focused</p>
            </div>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {Math.round((sessionsCompleted / Math.max(1, settings.sessionsUntilLongBreak)) * 100)}%
              </p>
              <p className="text-gray-600 text-sm">To Long Break</p>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Button */}
      <div className="text-center">
        <button
          onClick={() => setShowSettings(true)}
          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all duration-200 flex items-center space-x-2 mx-auto"
        >
          <Settings className="h-5 w-5" />
          <span>Timer Settings</span>
        </button>
      </div>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowSettings(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl">
                  <Settings className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">Timer Settings</h3>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Work Duration (minutes)
                  </label>
                  <input
                    type="number"
                    value={settings.workDuration}
                    onChange={(e) => setSettings({ ...settings, workDuration: parseInt(e.target.value) || 25 })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none"
                    min="1"
                    max="60"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Short Break (minutes)
                  </label>
                  <input
                    type="number"
                    value={settings.shortBreak}
                    onChange={(e) => setSettings({ ...settings, shortBreak: parseInt(e.target.value) || 5 })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none"
                    min="1"
                    max="30"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Long Break (minutes)
                  </label>
                  <input
                    type="number"
                    value={settings.longBreak}
                    onChange={(e) => setSettings({ ...settings, longBreak: parseInt(e.target.value) || 15 })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none"
                    min="1"
                    max="60"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sessions until Long Break
                  </label>
                  <input
                    type="number"
                    value={settings.sessionsUntilLongBreak}
                    onChange={(e) => setSettings({ ...settings, sessionsUntilLongBreak: parseInt(e.target.value) || 4 })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none"
                    min="2"
                    max="10"
                  />
                </div>

                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.soundEnabled}
                      onChange={(e) => setSettings({ ...settings, soundEnabled: e.target.checked })}
                      className="mr-3"
                    />
                    <span className="text-sm text-gray-700">Enable notification sounds</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.autoStartBreaks}
                      onChange={(e) => setSettings({ ...settings, autoStartBreaks: e.target.checked })}
                      className="mr-3"
                    />
                    <span className="text-sm text-gray-700">Auto-start breaks</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.autoStartPomodoros}
                      onChange={(e) => setSettings({ ...settings, autoStartPomodoros: e.target.checked })}
                      className="mr-3"
                    />
                    <span className="text-sm text-gray-700">Auto-start work sessions</span>
                  </label>
                </div>
              </div>

              <div className="flex space-x-3 mt-8">
                <button
                  onClick={() => setShowSettings(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowSettings(false);
                    resetTimer();
                  }}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all duration-200"
                >
                  Save Settings
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StudyTimer;