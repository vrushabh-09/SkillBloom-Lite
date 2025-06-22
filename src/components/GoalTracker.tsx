import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Target, 
  Plus, 
  Calendar, 
  CheckCircle2, 
  Circle, 
  Trash2, 
  Edit3,
  Flag,
  Clock,
  TrendingUp,
  Award,
  Zap
} from 'lucide-react';
import { LearningGoal, Milestone } from '../types';

interface GoalTrackerProps {
  skills: any[];
}

const GoalTracker: React.FC<GoalTrackerProps> = ({ skills }) => {
  const [goals, setGoals] = useState<LearningGoal[]>([
    {
      id: '1',
      title: 'Master React Development',
      description: 'Become proficient in React with hooks, context, and advanced patterns',
      targetDate: new Date('2024-06-01'),
      progress: 65,
      milestones: [
        { id: '1-1', title: 'Complete React Basics', completed: true },
        { id: '1-2', title: 'Learn React Hooks', completed: true },
        { id: '1-3', title: 'Build Portfolio Project', completed: false },
        { id: '1-4', title: 'Deploy to Production', completed: false }
      ]
    },
    {
      id: '2',
      title: 'Full-Stack Developer Ready',
      description: 'Build complete web applications with frontend and backend',
      targetDate: new Date('2024-08-15'),
      progress: 30,
      milestones: [
        { id: '2-1', title: 'Frontend Mastery', completed: false },
        { id: '2-2', title: 'Backend Development', completed: false },
        { id: '2-3', title: 'Database Design', completed: false },
        { id: '2-4', title: 'Full-Stack Project', completed: false }
      ]
    }
  ]);

  const [showAddGoal, setShowAddGoal] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    targetDate: '',
    milestones: ['']
  });

  const handleAddGoal = () => {
    if (newGoal.title && newGoal.description && newGoal.targetDate) {
      const goal: LearningGoal = {
        id: Date.now().toString(),
        title: newGoal.title,
        description: newGoal.description,
        targetDate: new Date(newGoal.targetDate),
        progress: 0,
        milestones: newGoal.milestones
          .filter(m => m.trim())
          .map((title, index) => ({
            id: `${Date.now()}-${index}`,
            title: title.trim(),
            completed: false
          }))
      };
      
      setGoals([...goals, goal]);
      setNewGoal({ title: '', description: '', targetDate: '', milestones: [''] });
      setShowAddGoal(false);
    }
  };

  const toggleMilestone = (goalId: string, milestoneId: string) => {
    setGoals(goals.map(goal => {
      if (goal.id === goalId) {
        const updatedMilestones = goal.milestones.map(milestone =>
          milestone.id === milestoneId
            ? { ...milestone, completed: !milestone.completed }
            : milestone
        );
        
        const completedCount = updatedMilestones.filter(m => m.completed).length;
        const progress = Math.round((completedCount / updatedMilestones.length) * 100);
        
        return { ...goal, milestones: updatedMilestones, progress };
      }
      return goal;
    }));
  };

  const deleteGoal = (goalId: string) => {
    setGoals(goals.filter(goal => goal.id !== goalId));
  };

  const getDaysRemaining = (targetDate: Date) => {
    const today = new Date();
    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'from-green-500 to-emerald-500';
    if (progress >= 60) return 'from-blue-500 to-cyan-500';
    if (progress >= 40) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-pink-500';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl">
            <Target className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Learning Goals</h2>
            <p className="text-gray-600">Track your progress towards mastery</p>
          </div>
        </div>
        
        <button
          onClick={() => setShowAddGoal(true)}
          className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <Plus className="h-5 w-5" />
          <span>New Goal</span>
        </button>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnimatePresence>
          {goals.map((goal, index) => {
            const daysRemaining = getDaysRemaining(goal.targetDate);
            const isOverdue = daysRemaining < 0;
            
            return (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-6 border border-gray-200 hover:shadow-2xl transition-all duration-300"
              >
                {/* Goal Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{goal.title}</h3>
                    <p className="text-gray-600 text-sm mb-3">{goal.description}</p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{goal.targetDate.toLocaleDateString()}</span>
                      </div>
                      <div className={`flex items-center space-x-1 ${isOverdue ? 'text-red-500' : 'text-blue-500'}`}>
                        <Clock className="h-4 w-4" />
                        <span>
                          {isOverdue ? `${Math.abs(daysRemaining)} days overdue` : `${daysRemaining} days left`}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => deleteGoal(goal.id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Progress</span>
                    <span className={`text-lg font-bold bg-gradient-to-r ${getProgressColor(goal.progress)} bg-clip-text text-transparent`}>
                      {goal.progress}%
                    </span>
                  </div>
                  <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${goal.progress}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className={`h-full rounded-full bg-gradient-to-r ${getProgressColor(goal.progress)} relative`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                    </motion.div>
                  </div>
                </div>

                {/* Milestones */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Flag className="h-4 w-4 text-purple-500" />
                    <span className="text-sm font-medium text-gray-700">Milestones</span>
                  </div>
                  
                  {goal.milestones.map((milestone) => (
                    <div
                      key={milestone.id}
                      onClick={() => toggleMilestone(goal.id, milestone.id)}
                      className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-all duration-200 group"
                    >
                      {milestone.completed ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                      ) : (
                        <Circle className="h-5 w-5 text-gray-300 group-hover:text-gray-400 flex-shrink-0" />
                      )}
                      <span className={`text-sm ${milestone.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                        {milestone.title}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Achievement Badge */}
                {goal.progress === 100 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="mt-4 p-3 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl text-center"
                  >
                    <div className="flex items-center justify-center space-x-2 text-white">
                      <Award className="h-5 w-5" />
                      <span className="font-bold">Goal Achieved! 🎉</span>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Add Goal Modal */}
      <AnimatePresence>
        {showAddGoal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowAddGoal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">New Learning Goal</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Goal Title</label>
                  <input
                    type="text"
                    value={newGoal.title}
                    onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                    placeholder="e.g., Master React Development"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={newGoal.description}
                    onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                    placeholder="Describe what you want to achieve..."
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Target Date</label>
                  <input
                    type="date"
                    value={newGoal.targetDate}
                    onChange={(e) => setNewGoal({ ...newGoal, targetDate: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Milestones</label>
                  {newGoal.milestones.map((milestone, index) => (
                    <div key={index} className="flex items-center space-x-2 mb-2">
                      <input
                        type="text"
                        value={milestone}
                        onChange={(e) => {
                          const updated = [...newGoal.milestones];
                          updated[index] = e.target.value;
                          setNewGoal({ ...newGoal, milestones: updated });
                        }}
                        placeholder={`Milestone ${index + 1}`}
                        className="flex-1 px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none text-sm"
                      />
                      {index === newGoal.milestones.length - 1 && (
                        <button
                          onClick={() => setNewGoal({ ...newGoal, milestones: [...newGoal.milestones, ''] })}
                          className="p-2 text-purple-500 hover:bg-purple-50 rounded-lg transition-colors"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex space-x-3 mt-8">
                <button
                  onClick={() => setShowAddGoal(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddGoal}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
                >
                  Create Goal
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State */}
      {goals.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <div className="p-6 bg-gradient-to-r from-purple-100 to-pink-100 rounded-3xl inline-block mb-4">
            <Target className="h-12 w-12 text-purple-500" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">No Learning Goals Yet</h3>
          <p className="text-gray-600 mb-6">Set your first learning goal to start tracking your progress!</p>
          <button
            onClick={() => setShowAddGoal(true)}
            className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Create Your First Goal
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default GoalTracker;