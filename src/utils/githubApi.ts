import axios from 'axios';
import { Skill } from '../types';
import { v4 as uuidv4 } from './crypto';

// Map file extensions to skills
const extensionToSkill: Record<string, { 
  name: string; 
  description: string; 
  color: string;
  icon: string;
  learningModules: { title: string }[];
}> = {
  // JavaScript
  'js': {
    name: 'JavaScript',
    description: 'High-level programming language for web development',
    color: 'from-yellow-400 to-yellow-500',
    icon: 'FileCode',
    learningModules: [
      { title: 'Master JavaScript fundamentals' },
      { title: 'Learn ES6+ features' },
      { title: 'Understand asynchronous programming' },
      { title: 'Work with DOM manipulation' },
      { title: 'Build a JavaScript project' }
    ]
  },
  // TypeScript
  'ts': {
    name: 'TypeScript',
    description: 'Strongly typed programming language that builds on JavaScript',
    color: 'from-blue-500 to-indigo-500',
    icon: 'FileCode',
    learningModules: [
      { title: 'Learn basic types' },
      { title: 'Understand interfaces' },
      { title: 'Master generics' },
      { title: 'Use with frameworks' },
      { title: 'Advanced type utilities' }
    ]
  },
  // React
  'jsx': {
    name: 'React',
    description: 'A JavaScript library for building user interfaces',
    color: 'from-blue-400 to-cyan-400',
    icon: 'Code',
    learningModules: [
      { title: 'Understand React components' },
      { title: 'Master React hooks' },
      { title: 'Learn state management' },
      { title: 'Build a small project' },
      { title: 'Implement routing' }
    ]
  },
  'tsx': {
    name: 'React with TypeScript',
    description: 'React with TypeScript for type-safe components',
    color: 'from-blue-500 to-cyan-500',
    icon: 'Code',
    learningModules: [
      { title: 'Set up TypeScript with React' },
      { title: 'Create typed components' },
      { title: 'Use typed hooks' },
      { title: 'Implement typed props' },
      { title: 'Advanced TypeScript patterns in React' }
    ]
  },
  // CSS
  'css': {
    name: 'CSS',
    description: 'Cascading Style Sheets for web design',
    color: 'from-pink-400 to-rose-400',
    icon: 'Paintbrush',
    learningModules: [
      { title: 'Master flexbox layout' },
      { title: 'Learn CSS Grid' },
      { title: 'Implement responsive design' },
      { title: 'Use CSS animations' },
      { title: 'Understand CSS variables' }
    ]
  },
  // HTML
  'html': {
    name: 'HTML',
    description: 'HyperText Markup Language for web pages',
    color: 'from-orange-400 to-red-400',
    icon: 'FileCode',
    learningModules: [
      { title: 'Learn semantic HTML' },
      { title: 'Understand document structure' },
      { title: 'Master forms and inputs' },
      { title: 'Implement accessibility' },
      { title: 'Use HTML5 features' }
    ]
  },
  // Python
  'py': {
    name: 'Python',
    description: 'High-level programming language for general-purpose programming',
    color: 'from-blue-400 to-green-400',
    icon: 'FileCode',
    learningModules: [
      { title: 'Learn Python basics' },
      { title: 'Understand data structures' },
      { title: 'Master functions and modules' },
      { title: 'Work with libraries' },
      { title: 'Build a Python project' }
    ]
  },
  // Java
  'java': {
    name: 'Java',
    description: 'Object-oriented programming language',
    color: 'from-red-500 to-orange-500',
    icon: 'Coffee',
    learningModules: [
      { title: 'Learn Java syntax' },
      { title: 'Understand OOP principles' },
      { title: 'Master exception handling' },
      { title: 'Work with collections' },
      { title: 'Build a Java application' }
    ]
  },
  // Go
  'go': {
    name: 'Go',
    description: 'Statically typed, compiled programming language',
    color: 'from-blue-400 to-teal-400',
    icon: 'FileCode',
    learningModules: [
      { title: 'Learn Go basics' },
      { title: 'Understand concurrency' },
      { title: 'Master error handling' },
      { title: 'Work with packages' },
      { title: 'Build a Go application' }
    ]
  },
  // Ruby
  'rb': {
    name: 'Ruby',
    description: 'Dynamic, object-oriented programming language',
    color: 'from-red-500 to-pink-500',
    icon: 'Gem',
    learningModules: [
      { title: 'Learn Ruby syntax' },
      { title: 'Understand object-oriented programming' },
      { title: 'Master blocks and procs' },
      { title: 'Work with gems' },
      { title: 'Build a Ruby application' }
    ]
  },
  // PHP
  'php': {
    name: 'PHP',
    description: 'Server-side scripting language for web development',
    color: 'from-indigo-400 to-purple-500',
    icon: 'FileCode',
    learningModules: [
      { title: 'Learn PHP basics' },
      { title: 'Understand web integration' },
      { title: 'Master database operations' },
      { title: 'Work with frameworks' },
      { title: 'Build a PHP application' }
    ]
  },
  // Rust
  'rs': {
    name: 'Rust',
    description: 'Systems programming language focused on safety and performance',
    color: 'from-orange-500 to-red-600',
    icon: 'FileCode',
    learningModules: [
      { title: 'Learn Rust syntax' },
      { title: 'Understand ownership and borrowing' },
      { title: 'Master error handling' },
      { title: 'Work with crates' },
      { title: 'Build a Rust application' }
    ]
  },
  // Swift
  'swift': {
    name: 'Swift',
    description: 'Programming language for iOS, macOS, and more',
    color: 'from-orange-400 to-red-500',
    icon: 'FileCode',
    learningModules: [
      { title: 'Learn Swift basics' },
      { title: 'Understand optionals' },
      { title: 'Master closures' },
      { title: 'Work with UIKit/SwiftUI' },
      { title: 'Build an iOS application' }
    ]
  },
  // C#
  'cs': {
    name: 'C#',
    description: 'Object-oriented programming language by Microsoft',
    color: 'from-purple-500 to-indigo-600',
    icon: 'Hash',
    learningModules: [
      { title: 'Learn C# syntax' },
      { title: 'Understand .NET framework' },
      { title: 'Master LINQ' },
      { title: 'Work with ASP.NET' },
      { title: 'Build a C# application' }
    ]
  },
  // C++
  'cpp': {
    name: 'C++',
    description: 'General-purpose programming language with performance and flexibility',
    color: 'from-blue-600 to-indigo-700',
    icon: 'FileCode',
    learningModules: [
      { title: 'Learn C++ syntax' },
      { title: 'Understand memory management' },
      { title: 'Master templates' },
      { title: 'Work with STL' },
      { title: 'Build a C++ application' }
    ]
  }
};

// Function to extract owner and repo from GitHub URL
const extractRepoInfo = (url: string): { owner: string; repo: string } => {
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname !== 'github.com') {
      throw new Error('Not a valid GitHub URL');
    }
    
    const pathParts = urlObj.pathname.split('/').filter(Boolean);
    if (pathParts.length < 2) {
      throw new Error('Invalid repository path');
    }
    
    return {
      owner: pathParts[0],
      repo: pathParts[1]
    };
  } catch (error) {
    throw new Error('Please enter a valid GitHub repository URL');
  }
};

// Function to analyze repository and detect skills
export const analyzeRepository = async (repoUrl: string): Promise<Skill[]> => {
  try {
    const { owner, repo } = extractRepoInfo(repoUrl);
    
    // Get repository contents (limited to root directory for simplicity)
    const response = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/contents`
    );
    
    // Get languages used in the repository
    const languagesResponse = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/languages`
    );
    
    const detectedSkills = new Map<string, Skill>();
    
    // Process files to detect skills based on extensions
    if (Array.isArray(response.data)) {
      response.data.forEach((item: any) => {
        if (item.type === 'file') {
          const extension = item.name.split('.').pop()?.toLowerCase();
          if (extension && extensionToSkill[extension]) {
            const skillInfo = extensionToSkill[extension];
            if (!detectedSkills.has(skillInfo.name)) {
              detectedSkills.set(skillInfo.name, {
                id: uuidv4(),
                name: skillInfo.name,
                description: skillInfo.description,
                progress: 0,
                color: skillInfo.color,
                icon: skillInfo.icon,
                learningModules: skillInfo.learningModules.map((module, index) => ({
                  id: `${uuidv4()}-${index}`,
                  title: module.title,
                  completed: false
                }))
              });
            }
          }
        }
      });
    }
    
    // Add skills based on languages
    Object.keys(languagesResponse.data).forEach(language => {
      const normalizedLang = language.toLowerCase();
      let skillName = '';
      
      // Map language names to skill names
      switch (normalizedLang) {
        case 'javascript':
          skillName = 'JavaScript';
          break;
        case 'typescript':
          skillName = 'TypeScript';
          break;
        case 'html':
          skillName = 'HTML';
          break;
        case 'css':
          skillName = 'CSS';
          break;
        case 'python':
          skillName = 'Python';
          break;
        case 'java':
          skillName = 'Java';
          break;
        case 'go':
          skillName = 'Go';
          break;
        case 'ruby':
          skillName = 'Ruby';
          break;
        case 'php':
          skillName = 'PHP';
          break;
        case 'rust':
          skillName = 'Rust';
          break;
        case 'swift':
          skillName = 'Swift';
          break;
        case 'c#':
          skillName = 'C#';
          break;
        case 'c++':
          skillName = 'C++';
          break;
        default:
          break;
      }
      
      if (skillName && !detectedSkills.has(skillName)) {
        const extension = Object.keys(extensionToSkill).find(ext => 
          extensionToSkill[ext].name === skillName
        );
        
        if (extension) {
          const skillInfo = extensionToSkill[extension];
          detectedSkills.set(skillInfo.name, {
            id: uuidv4(),
            name: skillInfo.name,
            description: skillInfo.description,
            progress: 0,
            color: skillInfo.color,
            icon: skillInfo.icon,
            learningModules: skillInfo.learningModules.map((module, index) => ({
              id: `${uuidv4()}-${index}`,
              title: module.title,
              completed: false
            }))
          });
        }
      }
    });
    
    return Array.from(detectedSkills.values());
  } catch (error) {
    console.error('Error analyzing repository:', error);
    throw new Error('Failed to analyze repository. Please check the URL and try again.');
  }
};