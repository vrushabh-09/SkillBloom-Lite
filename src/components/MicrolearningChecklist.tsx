import React, { useCallback, useEffect, useState } from 'react';
import { X, CheckCircle2, Circle, Trophy } from 'lucide-react';
import { Skill, LearningModule } from '../types';
import * as Icons from 'lucide-react';

interface MicrolearningChecklistProps {
  skill: Skill;
  onSkillUpdate: (skill: Skill) => void;
  onClose: () => void;
}

const MicrolearningChecklist: React.FC<MicrolearningChecklistProps> = ({
  skill,
  onSkillUpdate,
  onClose
}) => {
  const IconComponent = Icons[skill.icon as keyof typeof Icons] || Icons.Code;
  const [localModules, setLocalModules] = useState(skill.learningModules);
  const [showCelebration, setShowCelebration] = useState(false);

  const calculateProgress = useCallback((modules: LearningModule[]) => {
    const completedCount = modules.filter(m => m.completed).length;
    return Math.round((completedCount / modules.length) * 100);
  }, []);

  const handleModuleToggle = useCallback((moduleId: string) => {
    setLocalModules(prevModules => {
      const updatedModules = prevModules.map(module =>
        module.id === moduleId ? { ...module, completed: !module.completed } : module
      );
      
      const newProgress = calculateProgress(updatedModules);
      
      // Update parent state
      onSkillUpdate({
        ...skill,
        learningModules: updatedModules,
        progress: newProgress
      });

      // Trigger celebration if all modules are completed
      if (newProgress === 100) {
        setShowCelebration(true);
      }

      return updatedModules;
    });
  }, [skill, onSkillUpdate, calculateProgress]);

  useEffect(() => {
    setLocalModules(skill.learningModules);
  }, [skill.learningModules]);

  return (
    <div className="bg-white/90 backdrop-blur-lg rounded-xl shadow-xl overflow-hidden transform transition-all duration-300 hover:shadow-2xl">
      <div className={`h-2 bg-gradient-to-r ${skill.color}`}>
        <div className="h-full w-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <div className={`p-3 rounded-xl bg-gradient-to-r ${skill.color} shadow-lg mr-4 transform transition-transform hover:scale-110`}>
              <IconComponent className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                {skill.name} Learning Path ✨
              </h3>
              <p className="text-sm text-gray-500 mt-1">Track your progress step by step</p>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
            aria-label="Close checklist"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>
        
        <div className="space-y-3">
          {localModules.map((module, index) => (
            <div 
              key={module.id}
              className={`group flex items-center p-4 rounded-xl transition-all duration-300 transform cursor-pointer ${
                module.completed 
                  ? 'bg-green-50 hover:bg-green-100/70' 
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => handleModuleToggle(module.id)}
              style={{ 
                animationDelay: `${index * 100}ms`,
                animation: 'slide-up 0.5s ease-out forwards'
              }}
            >
              <div className="relative flex-shrink-0">
                {module.completed ? (
                  <CheckCircle2 className="h-6 w-6 text-green-500 transition-transform duration-300 transform group-hover:scale-110" />
                ) : (
                  <Circle className="h-6 w-6 text-gray-300 transition-all duration-300 group-hover:text-gray-400 group-hover:scale-110" />
                )}
              </div>
              <div className="ml-4 flex-1">
                <span className={`text-lg transition-all duration-300 ${
                  module.completed 
                    ? 'line-through text-gray-400' 
                    : 'text-gray-700 group-hover:text-gray-900'
                }`}>
                  {module.title}
                </span>
                <div className={`h-0.5 mt-1 transition-all duration-500 ${
                  module.completed ? 'w-full bg-green-200' : 'w-0'
                }`} />
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-100">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center">
              {skill.progress === 100 ? (
                <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
              ) : (
                <CheckCircle2 className="h-5 w-5 mr-2 text-gray-400" />
              )}
              <span className="text-sm font-medium text-gray-500">
                {localModules.filter(m => m.completed).length} of {localModules.length} completed
              </span>
            </div>
            <span className={`text-lg font-bold transition-all duration-300 ${
              skill.progress === 100 
                ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                : `bg-gradient-to-r ${skill.color}`
            } bg-clip-text text-transparent`}>
              {skill.progress}% Complete
            </span>
          </div>
          <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ease-out relative ${
                skill.progress === 100 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                  : `bg-gradient-to-r ${skill.color}`
              }`}
              style={{ width: `${skill.progress}%` }}
            >
              <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </div>
          </div>
          {showCelebration && (
            <div className="mt-4 text-center animate-bounce">
              <p className="text-lg font-semibold text-green-600">
                🎉 Congratulations! You've mastered {skill.name}! 🎉
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Keep up the great work!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MicrolearningChecklist;