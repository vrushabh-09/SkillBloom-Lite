import { Skill } from '../types';

export const defaultSkills: Skill[] = [
  {
    id: '1',
    name: 'React',
    description: 'A JavaScript library for building user interfaces',
    progress: 0,
    color: 'from-blue-400 to-cyan-400',
    icon: 'Code',
    learningModules: [
      { id: '1-1', title: 'Understand React components', completed: false },
      { id: '1-2', title: 'Master React hooks', completed: false },
      { id: '1-3', title: 'Learn state management', completed: false },
      { id: '1-4', title: 'Build a small project', completed: false },
      { id: '1-5', title: 'Implement routing', completed: false }
    ]
  },
  {
    id: '2',
    name: 'TypeScript',
    description: 'Strongly typed programming language that builds on JavaScript',
    progress: 0,
    color: 'from-blue-500 to-indigo-500',
    icon: 'FileCode',
    learningModules: [
      { id: '2-1', title: 'Learn basic types', completed: false },
      { id: '2-2', title: 'Understand interfaces', completed: false },
      { id: '2-3', title: 'Master generics', completed: false },
      { id: '2-4', title: 'Use with React', completed: false },
      { id: '2-5', title: 'Advanced type utilities', completed: false }
    ]
  },
  {
    id: '3',
    name: 'CSS',
    description: 'Cascading Style Sheets for web design',
    progress: 0,
    color: 'from-pink-400 to-rose-400',
    icon: 'Paintbrush',
    learningModules: [
      { id: '3-1', title: 'Master flexbox layout', completed: false },
      { id: '3-2', title: 'Learn CSS Grid', completed: false },
      { id: '3-3', title: 'Implement responsive design', completed: false },
      { id: '3-4', title: 'Use CSS animations', completed: false },
      { id: '3-5', title: 'Understand CSS variables', completed: false }
    ]
  }
];