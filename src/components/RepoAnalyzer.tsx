import React, { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { Skill } from '../types';
import { analyzeRepository } from '../utils/githubApi';

interface RepoAnalyzerProps {
  onAddSkills: (skills: Skill[]) => void;
}

const RepoAnalyzer: React.FC<RepoAnalyzerProps> = ({ onAddSkills }) => {
  const [repoUrl, setRepoUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!repoUrl.trim()) {
      setError('Please enter a GitHub repository URL');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const detectedSkills = await analyzeRepository(repoUrl);
      onAddSkills(detectedSkills);
      setRepoUrl('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze repository');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-8">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Analyze GitHub Repository</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <input
            type="text"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            placeholder="Enter GitHub repository URL (e.g., https://github.com/user/repo)"
            className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-400 focus:border-transparent outline-none transition"
            disabled={isLoading}
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {isLoading ? (
              <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />
            ) : (
              <Search className="h-5 w-5 text-gray-400" />
            )}
          </div>
        </div>
        
        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}
        
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
            isLoading
              ? 'bg-indigo-300 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white'
          }`}
        >
          {isLoading ? 'Analyzing...' : 'Analyze Repository'}
        </button>
      </form>
      
      <p className="text-sm text-gray-500 mt-4">
        We'll analyze the repository and suggest skills based on the technologies used.
      </p>
    </div>
  );
};

export default RepoAnalyzer;