import React, { useState } from 'react';
import Header from './components/Header';
import RepoAnalyzer from './components/RepoAnalyzer';
import SkillGarden from './components/SkillGarden';
import ProgressDashboard from './components/ProgressDashboard';
import AISkillCoach from './components/AISkillCoach';
import GoalTracker from './components/GoalTracker';
import StudyTimer from './components/StudyTimer';
import { Skill } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { defaultSkills } from './data/defaultSkills';

function App() {
  const [activeTab, setActiveTab] = useState<'garden' | 'dashboard' | 'coach'>('garden');
  const [skills, setSkills] = useLocalStorage<Skill[]>('skills', defaultSkills);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [showGoalTracker, setShowGoalTracker] = useState(false);
  const [showStudyTimer, setShowStudyTimer] = useState(false);

  const handleSkillUpdate = (updatedSkill: Skill) => {
    setSkills(skills.map(skill => 
      skill.id === updatedSkill.id ? updatedSkill : skill
    ));
  };

  const handleAddSkills = (newSkills: Skill[]) => {
    const existingSkillNames = skills.map(skill => skill.name.toLowerCase());
    const filteredNewSkills = newSkills.filter(
      skill => !existingSkillNames.includes(skill.name.toLowerCase())
    );
    
    setSkills([...skills, ...filteredNewSkills]);
  };

  const handleStudySessionComplete = (duration: number, skillId?: string) => {
    // Here you could track study sessions and update skill progress
    console.log(`Study session completed: ${duration} minutes for skill ${skillId}`);
  };

  return (
    <div className="min-h-screen gradient-bg">
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"></div>
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{ animationDelay: '-2s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{ animationDelay: '-4s' }}></div>
      </div>

      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="container mx-auto px-4 py-8 relative">
        {activeTab === 'garden' && (
          <div className="space-y-8 animate-slide-in">
            {/* Enhanced Navigation */}
            <div className="flex flex-wrap gap-4 justify-center mb-8">
              <button
                onClick={() => {
                  setShowGoalTracker(false);
                  setShowStudyTimer(false);
                }}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 ${
                  !showGoalTracker && !showStudyTimer
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg'
                    : 'bg-white/80 text-gray-700 hover:bg-white hover:shadow-md'
                }`}
              >
                <span>🌱 Skill Garden</span>
              </button>
              
              <button
                onClick={() => {
                  setShowGoalTracker(true);
                  setShowStudyTimer(false);
                }}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 ${
                  showGoalTracker
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                    : 'bg-white/80 text-gray-700 hover:bg-white hover:shadow-md'
                }`}
              >
                <span>🎯 Learning Goals</span>
              </button>
              
              <button
                onClick={() => {
                  setShowStudyTimer(true);
                  setShowGoalTracker(false);
                }}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 ${
                  showStudyTimer
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg'
                    : 'bg-white/80 text-gray-700 hover:bg-white hover:shadow-md'
                }`}
              >
                <span>⏱️ Study Timer</span>
              </button>
            </div>

            {/* Content based on selection */}
            {!showGoalTracker && !showStudyTimer && (
              <>
                <RepoAnalyzer onAddSkills={handleAddSkills} />
                <SkillGarden 
                  skills={skills} 
                  onSkillSelect={setSelectedSkill} 
                  selectedSkill={selectedSkill}
                  onSkillUpdate={handleSkillUpdate}
                />
              </>
            )}
            
            {showGoalTracker && (
              <GoalTracker skills={skills} />
            )}
            
            {showStudyTimer && (
              <StudyTimer onSessionComplete={handleStudySessionComplete} />
            )}
          </div>
        )}
        
        {activeTab === 'dashboard' && (
          <div className="animate-slide-in">
            <ProgressDashboard skills={skills} />
          </div>
        )}
        
        {activeTab === 'coach' && (
          <div className="animate-slide-in">
            <AISkillCoach skills={skills} />
          </div>
        )}
      </main>
    </div>
  );
}

export default App