export interface Skill {
  id: string;
  name: string;
  description: string;
  progress: number;
  color: string;
  icon: string;
  learningModules: LearningModule[];
}

export interface LearningModule {
  id: string;
  title: string;
  completed: boolean;
}

export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: number;
  reactions?: MessageReaction[];
  attachments?: MessageAttachment[];
}

export interface MessageReaction {
  emoji: string;
  count: number;
}

export interface MessageAttachment {
  id: string;
  name: string;
  type: 'image' | 'file' | 'code';
  url?: string;
  content?: string;
}

export interface LearningGoal {
  id: string;
  title: string;
  description: string;
  targetDate: Date;
  progress: number;
  milestones: Milestone[];
}

export interface Milestone {
  id: string;
  title: string;
  completed: boolean;
  completedDate?: Date;
}

export interface StudySession {
  id: string;
  skillId: string;
  duration: number; // in minutes
  date: Date;
  notes?: string;
  productivity: 1 | 2 | 3 | 4 | 5; // 1-5 rating
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedDate: Date;
  category: 'skill' | 'streak' | 'project' | 'community';
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  joinDate: Date;
  totalStudyTime: number;
  currentStreak: number;
  longestStreak: number;
  achievements: Achievement[];
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  studyReminders: boolean;
  weeklyGoals: boolean;
  publicProfile: boolean;
  coachPersonality: 'friendly' | 'professional' | 'motivational' | 'technical';
}