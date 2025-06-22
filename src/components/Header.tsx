import React from 'react';
import { Sprout, BarChart2, MessageCircle, Target, Trophy, Calendar, Settings } from 'lucide-react';

interface HeaderProps {
  activeTab: 'garden' | 'dashboard' | 'coach';
  setActiveTab: (tab: 'garden' | 'dashboard' | 'coach') => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  return (
    <header className="bg-white shadow-lg border-b-2 border-gradient-to-r from-emerald-400 to-teal-500">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-center justify-between py-4">
          <div className="flex items-center mb-4 sm:mb-0 group">
            <div className="relative">
              <Sprout className="h-10 w-10 text-emerald-500 mr-3 transform transition-transform group-hover:scale-110 group-hover:rotate-12" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-500 via-teal-600 to-blue-600 bg-clip-text text-transparent">
                SkillBloom Lite
              </h1>
              <p className="text-sm text-gray-500 font-medium">Enhanced Learning Platform</p>
            </div>
          </div>
          
          <nav className="flex space-x-1 sm:space-x-2 bg-gray-50 rounded-2xl p-2">
            <button
              onClick={() => setActiveTab('garden')}
              className={`px-4 py-3 rounded-xl flex items-center transition-all duration-300 transform hover:scale-105 ${
                activeTab === 'garden'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg'
                  : 'hover:bg-white hover:shadow-md text-gray-600'
              }`}
            >
              <Sprout className="h-5 w-5 mr-2" />
              <span className="hidden sm:inline font-medium">Skill Garden</span>
              <span className="sm:hidden font-medium">Garden</span>
              {activeTab === 'garden' && (
                <div className="ml-2 w-2 h-2 bg-white rounded-full animate-pulse"></div>
              )}
            </button>
            
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-3 rounded-xl flex items-center transition-all duration-300 transform hover:scale-105 ${
                activeTab === 'dashboard'
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
                  : 'hover:bg-white hover:shadow-md text-gray-600'
              }`}
            >
              <BarChart2 className="h-5 w-5 mr-2" />
              <span className="hidden sm:inline font-medium">Dashboard</span>
              <span className="sm:hidden font-medium">Stats</span>
              {activeTab === 'dashboard' && (
                <div className="ml-2 w-2 h-2 bg-white rounded-full animate-pulse"></div>
              )}
            </button>
            
            <button
              onClick={() => setActiveTab('coach')}
              className={`px-4 py-3 rounded-xl flex items-center transition-all duration-300 transform hover:scale-105 relative ${
                activeTab === 'coach'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : 'hover:bg-white hover:shadow-md text-gray-600'
              }`}
            >
              <MessageCircle className="h-5 w-5 mr-2" />
              <span className="hidden sm:inline font-medium">AI Coach</span>
              <span className="sm:hidden font-medium">Coach</span>
              {activeTab === 'coach' && (
                <div className="ml-2 w-2 h-2 bg-white rounded-full animate-pulse"></div>
              )}
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full animate-bounce">
                <div className="w-full h-full bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full animate-ping"></div>
              </div>
            </button>
          </nav>
        </div>
        
        {/* Enhanced Status Bar */}
        <div className="pb-4">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>System Online</span>
              </div>
              <div className="flex items-center space-x-1">
                <Trophy className="h-4 w-4 text-yellow-500" />
                <span>Enhanced Features Active</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>{new Date().toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Target className="h-4 w-4 text-blue-500" />
                <span>Learning Mode</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;