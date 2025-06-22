import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Target, 
  Award, 
  Calendar, 
  Clock, 
  Star,
  Trophy,
  Zap,
  BookOpen,
  CheckCircle2,
  BarChart3,
  PieChart as PieChartIcon
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  RadialBarChart,
  RadialBar,
  AreaChart,
  Area
} from 'recharts';
import { Skill } from '../types';

interface ProgressDashboardProps {
  skills: Skill[];
}

const ProgressDashboard: React.FC<ProgressDashboardProps> = ({ skills }) => {
  const [activeChart, setActiveChart] = useState<'pie' | 'bar' | 'radial' | 'area'>('pie');

  // Enhanced color palette
  const colorPalette = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
    '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#D7BDE2'
  ];

  // Transform skills data for different chart types
  const pieChartData = skills.map((skill, index) => ({
    name: skill.name,
    value: skill.progress,
    color: colorPalette[index % colorPalette.length],
    completedModules: skill.learningModules.filter(m => m.completed).length,
    totalModules: skill.learningModules.length
  }));

  const barChartData = skills.map((skill, index) => ({
    name: skill.name.length > 8 ? skill.name.substring(0, 8) + '...' : skill.name,
    progress: skill.progress,
    completed: skill.learningModules.filter(m => m.completed).length,
    total: skill.learningModules.length,
    color: colorPalette[index % colorPalette.length]
  }));

  const radialData = skills.map((skill, index) => ({
    name: skill.name,
    progress: skill.progress,
    fill: colorPalette[index % colorPalette.length]
  }));

  // Calculate statistics
  const totalSkills = skills.length;
  const averageProgress = skills.length > 0 
    ? Math.round(skills.reduce((sum, skill) => sum + skill.progress, 0) / skills.length)
    : 0;
  const completedSkills = skills.filter(skill => skill.progress === 100).length;
  const totalModules = skills.reduce((sum, skill) => sum + skill.learningModules.length, 0);
  const completedModules = skills.reduce((sum, skill) => 
    sum + skill.learningModules.filter(m => m.completed).length, 0
  );

  // Mock data for learning streak and weekly progress
  const weeklyProgressData = [
    { day: 'Mon', modules: 3, hours: 2.5 },
    { day: 'Tue', modules: 5, hours: 3.2 },
    { day: 'Wed', modules: 2, hours: 1.8 },
    { day: 'Thu', modules: 4, hours: 2.9 },
    { day: 'Fri', modules: 6, hours: 4.1 },
    { day: 'Sat', modules: 3, hours: 2.3 },
    { day: 'Sun', modules: 4, hours: 3.0 }
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-xl border border-gray-200">
          <p className="font-semibold text-gray-800">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {entry.value}%
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const StatCard = ({ icon: Icon, title, value, subtitle, color, delay }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 group hover:scale-105"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
          <p className="text-xs text-gray-500">{subtitle}</p>
        </div>
        <div className={`p-4 rounded-2xl ${color} group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="h-8 w-8 text-white" />
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-2">
          Progress Dashboard
        </h1>
        <p className="text-gray-600 text-lg">Track your learning journey and celebrate achievements</p>
      </motion.div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={BookOpen}
          title="Total Skills"
          value={totalSkills}
          subtitle="Skills in your garden"
          color="bg-gradient-to-br from-blue-500 to-blue-600"
          delay={0.1}
        />
        <StatCard
          icon={Target}
          title="Average Progress"
          value={`${averageProgress}%`}
          subtitle="Across all skills"
          color="bg-gradient-to-br from-green-500 to-green-600"
          delay={0.2}
        />
        <StatCard
          icon={Trophy}
          title="Completed Skills"
          value={completedSkills}
          subtitle="Fully mastered"
          color="bg-gradient-to-br from-yellow-500 to-orange-500"
          delay={0.3}
        />
        <StatCard
          icon={CheckCircle2}
          title="Modules Done"
          value={`${completedModules}/${totalModules}`}
          subtitle="Learning modules"
          color="bg-gradient-to-br from-purple-500 to-pink-500"
          delay={0.4}
        />
      </div>

      {/* Chart Selection Tabs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="flex justify-center"
      >
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-gray-200">
          {[
            { key: 'pie', icon: PieChartIcon, label: 'Distribution' },
            { key: 'bar', icon: BarChart3, label: 'Progress' },
            { key: 'radial', icon: Target, label: 'Radial' },
            { key: 'area', icon: TrendingUp, label: 'Trend' }
          ].map(({ key, icon: Icon, label }) => (
            <button
              key={key}
              onClick={() => setActiveChart(key as any)}
              className={`px-6 py-3 rounded-xl flex items-center space-x-2 transition-all duration-300 ${
                activeChart === key
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{label}</span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Primary Chart */}
        <motion.div
          key={activeChart}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-gray-200 hover:shadow-2xl transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-800">
              {activeChart === 'pie' && 'Skill Distribution'}
              {activeChart === 'bar' && 'Skills Progress'}
              {activeChart === 'radial' && 'Radial Progress'}
              {activeChart === 'area' && 'Progress Trend'}
            </h3>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-500">Live Data</span>
            </div>
          </div>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              {activeChart === 'pie' && (
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    innerRadius={40}
                    dataKey="value"
                    nameKey="name"
                    animationDuration={1500}
                    animationBegin={0}
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        stroke="#fff"
                        strokeWidth={2}
                        className="hover:opacity-80 cursor-pointer transition-opacity duration-300"
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    formatter={(value) => (
                      <span className="text-sm font-medium text-gray-700">{value}</span>
                    )}
                  />
                </PieChart>
              )}

              {activeChart === 'bar' && (
                <BarChart data={barChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: '#6B7280', fontSize: 12 }}
                    axisLine={{ stroke: '#E5E7EB' }}
                  />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fill: '#6B7280', fontSize: 12 }}
                    axisLine={{ stroke: '#E5E7EB' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="progress"
                    radius={[8, 8, 0, 0]}
                    animationDuration={1500}
                  >
                    {barChartData.map((entry, index) => (
                      <Cell
                        key={`bar-${index}`}
                        fill={entry.color}
                        className="hover:opacity-80 cursor-pointer transition-opacity duration-300"
                      />
                    ))}
                  </Bar>
                </BarChart>
              )}

              {activeChart === 'radial' && (
                <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="90%" data={radialData}>
                  <RadialBar
                    dataKey="progress"
                    cornerRadius={10}
                    animationDuration={1500}
                  />
                  <Tooltip content={<CustomTooltip />} />
                </RadialBarChart>
              )}

              {activeChart === 'area' && (
                <AreaChart data={weeklyProgressData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="day"
                    tick={{ fill: '#6B7280', fontSize: 12 }}
                    axisLine={{ stroke: '#E5E7EB' }}
                  />
                  <YAxis
                    tick={{ fill: '#6B7280', fontSize: 12 }}
                    axisLine={{ stroke: '#E5E7EB' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="modules"
                    stroke="#8B5CF6"
                    fill="url(#colorGradient)"
                    strokeWidth={3}
                    animationDuration={1500}
                  />
                  <defs>
                    <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                </AreaChart>
              )}
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Weekly Activity Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-gray-200 hover:shadow-2xl transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-800">Weekly Activity</h3>
            <div className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              <span className="text-sm font-medium text-gray-600">7-day streak</span>
            </div>
          </div>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyProgressData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="day"
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                  axisLine={{ stroke: '#E5E7EB' }}
                />
                <YAxis
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                  axisLine={{ stroke: '#E5E7EB' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: '12px',
                    border: 'none',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                    padding: '12px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="modules"
                  stroke="#10B981"
                  strokeWidth={4}
                  dot={{ fill: '#10B981', strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8, stroke: '#10B981', strokeWidth: 2, fill: '#fff' }}
                  animationDuration={1500}
                />
                <Line
                  type="monotone"
                  dataKey="hours"
                  stroke="#3B82F6"
                  strokeWidth={4}
                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8, stroke: '#3B82F6', strokeWidth: 2, fill: '#fff' }}
                  animationDuration={1500}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Achievement Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-3xl p-8 text-white shadow-xl"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold mb-2">Recent Achievements</h3>
            <p className="text-purple-100">Celebrate your learning milestones</p>
          </div>
          <Award className="h-12 w-12 text-yellow-300" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-center">
            <Star className="h-8 w-8 text-yellow-300 mx-auto mb-3" />
            <h4 className="font-bold text-lg mb-1">First Skill Completed</h4>
            <p className="text-purple-100 text-sm">Mastered your first skill</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-center">
            <Calendar className="h-8 w-8 text-green-300 mx-auto mb-3" />
            <h4 className="font-bold text-lg mb-1">7-Day Streak</h4>
            <p className="text-purple-100 text-sm">Consistent learning habit</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-center">
            <Clock className="h-8 w-8 text-blue-300 mx-auto mb-3" />
            <h4 className="font-bold text-lg mb-1">50 Hours Logged</h4>
            <p className="text-purple-100 text-sm">Dedicated learning time</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProgressDashboard;