import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Bot, 
  User, 
  Loader2, 
  Sparkles, 
  BookOpen, 
  Target, 
  Lightbulb,
  Code,
  Briefcase,
  MessageSquare,
  Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatMessage, Skill } from '../types';

interface AISkillCoachProps {
  skills: Skill[];
}

interface QuickAction {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  prompt: string;
  color: string;
}

const AISkillCoach: React.FC<AISkillCoachProps> = ({ skills }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: "Hello! I'm your AI Skill Coach. I'm here to help you with your coding journey. I can assist you with learning strategies, skill development, career advice, and coding help. What would you like to explore today?",
      sender: 'ai',
      timestamp: Date.now(),
      reactions: [],
      attachments: []
    }
  ]);
  
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickActions: QuickAction[] = [
    {
      id: 'learning-plan',
      label: 'Learning Plan',
      icon: BookOpen,
      prompt: 'Create a personalized learning plan based on my current skills',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'skill-help',
      label: 'Skill Help',
      icon: Target,
      prompt: 'Help me improve my weakest skill and provide specific guidance',
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'career-advice',
      label: 'Career Advice',
      icon: Briefcase,
      prompt: 'Give me career guidance and job market insights based on my skills',
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'code-help',
      label: 'Code Help',
      icon: Code,
      prompt: 'Help me with coding best practices, debugging, and technical challenges',
      color: 'from-orange-500 to-red-500'
    }
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Enhanced AI response generation with your improved logic
  const generateAIResponse = async (userMessage: string): Promise<string> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const lowerCaseMessage = userMessage.toLowerCase();
    
    // Enhanced skill analysis
    const totalProgress = skills.reduce((sum, skill) => sum + skill.progress, 0) / Math.max(skills.length, 1);
    const completedSkills = skills.filter(skill => skill.progress === 100).length;
    const strongestSkill = [...skills].sort((a, b) => b.progress - a.progress)[0];
    const weakestSkill = [...skills].sort((a, b) => a.progress - b.progress)[0];
    
    // More accurate skill mention detection
    const mentionedSkill = skills.find(skill => {
      const skillName = skill.name.toLowerCase();
      return (
        lowerCaseMessage.includes(skillName) ||
        lowerCaseMessage.includes(skillName.split(' ')[0]) // Match partial names
      );
    });

    // Skill-specific responses with more depth
    if (mentionedSkill) {
      const progress = mentionedSkill.progress;
      const completedModules = mentionedSkill.learningModules.filter(m => m.completed).length;
      const totalModules = mentionedSkill.learningModules.length;
      const nextModule = mentionedSkill.learningModules.find(m => !m.completed);
      
      // More detailed skill responses
      if (progress < 30) {
        return `Starting with ${mentionedSkill.name}? Excellent choice! Here's exactly what you should do:

**1. First Steps** (Week 1-2):
   - Complete: "${mentionedSkill.learningModules[0]?.title}"
   - Focus on: Core concepts and fundamentals
   - Practice: Basic examples and exercises

**2. Common Beginner Mistakes to Avoid**:
   - Rushing through concepts without practice
   - Skipping fundamentals to jump to advanced topics
   - Not setting up proper development environment
   - Comparing your progress to others

**3. Essential Resources**:
   - Official Documentation: Start here for accurate information
   - Interactive Tutorials: Hands-on learning approach
   - Community Forums: Get help when stuck
   - Practice Platforms: Reinforce your learning

**4. Daily Learning Schedule**:
   - 30 minutes theory/concepts
   - 30 minutes hands-on practice
   - 15 minutes review previous day's work

**5. Success Metrics**:
   - Complete 1 module per week
   - Build small practice projects
   - Explain concepts in your own words
   - Help others with basic questions

What specific part of ${mentionedSkill.name} are you starting with?`;
      }
      else if (progress < 70) {
        return `You're making great progress with ${mentionedSkill.name} (${progress}%)! 

**Immediate Next Steps**:
1. Complete: "${nextModule?.title}"
2. Practice: Building small projects using ${mentionedSkill.name}
3. Review: ${mentionedSkill.learningModules[Math.floor(completedModules/2)]?.title}

**Key Concepts to Master Now**:
- Advanced patterns and best practices
- Error handling and debugging
- Performance optimization
- Integration with other technologies

**Recommended Project Ideas**:
Build a ${getProjectSuggestion(mentionedSkill.name)} using:
- What you've learned so far
- Best practices for ${mentionedSkill.name}
- Modern development tools
- Version control (Git)

**Learning Acceleration Tips**:
- Join ${mentionedSkill.name} communities
- Contribute to open source projects
- Write technical blog posts
- Mentor beginners in ${mentionedSkill.name}

**Weekly Goals**:
- Complete 2-3 modules
- Build one practical project
- Review and refactor previous code
- Learn one new advanced concept

What challenges are you facing with ${mentionedSkill.name} currently?`;
      }
      else {
        return `You're advanced with ${mentionedSkill.name} (${progress}%)! 

**Mastery Path**:
1. Complete: "${nextModule?.title}"
2. Deep Dive Into: Advanced architectural patterns
3. Contribute to: Open-source projects using ${mentionedSkill.name}

**Expert-Level Challenges**:
- Optimize performance and scalability
- Implement complex design patterns
- Lead technical discussions and code reviews
- Create reusable libraries and frameworks

**Career Application**:
This skill qualifies you for:
- Senior Developer positions
- Technical Lead roles
- Architecture and design positions
- Competitive salaries: $80,000 - $150,000+

**Knowledge Sharing Opportunities**:
- Write technical articles and tutorials
- Speak at conferences and meetups
- Mentor junior developers
- Create educational content

**Advanced Learning Path**:
- System design and architecture
- Performance optimization techniques
- Security best practices
- Emerging trends in ${mentionedSkill.name}

**Portfolio Enhancement**:
- Build complex, production-ready applications
- Showcase advanced features and optimizations
- Document your architectural decisions
- Demonstrate leadership in technical projects

What advanced aspect of ${mentionedSkill.name} interests you?`;
      }
    }

    // More precise intent detection
    const isLearningQuery = /learn(ing)?|study|plan|curriculum|pathway/.test(lowerCaseMessage);
    const isCareerQuery = /career|job|interview|resume|salary/.test(lowerCaseMessage);
    const isCodeQuery = /code|debug|error|fix|problem|issue/.test(lowerCaseMessage);
    const isProgressQuery = /progress|how am i doing|improve/.test(lowerCaseMessage);

    // Enhanced response logic
    if (isLearningQuery) {
      return `Based on your ${Math.round(totalProgress)}% average progress, here's your optimized learning plan:

**Daily Focus Areas**:
1. ${weakestSkill?.name || 'Foundation skills'} (${weakestSkill?.progress || 0}%): 30 minutes practice
2. ${strongestSkill?.name || 'Current skills'} (${strongestSkill?.progress || 0}%): 15 minutes review

**Weekly Milestones**:
- Complete: ${skills.slice(0, 2).map(s => `${s.name} modules`).join(' + ')}
- Build: A small integrated project
- Review: Previous week's concepts

**Learning Efficiency Tips**:
1. Practice consistently every day
2. Build projects to apply knowledge
3. Teach others to reinforce learning
4. Join coding communities for support
5. Set specific, measurable goals

**Personalized Study Schedule**:
- **Monday-Wednesday**: Focus on weakest skill
- **Thursday-Friday**: Strengthen your best skill
- **Weekend**: Build projects and review

**Progress Tracking**:
- Complete modules systematically
- Build increasingly complex projects
- Document your learning journey
- Celebrate small wins regularly

**Resource Recommendations**:
- Official documentation for each technology
- Interactive coding platforms
- Project-based learning courses
- Developer communities and forums

What specific learning challenge would you like help with?`;
    }
    else if (isCareerQuery) {
      return `**Career Roadmap** (${Math.round(totalProgress)}% ready):

**Current Market Value**: ${completedSkills >= 3 ? 'Entry-Level Ready' : 'Junior Developer Track'} positions
**Recommended Roles**: 
${skills.filter(s => s.progress > 70).length > 0 ? 
  `- ${skills.filter(s => s.progress > 70).map(s => `${s.name} Developer`).slice(0, 3).join('\n- ')}` :
  '- Focus on completing skills to 70%+ first'
}

**90-Day Career Preparation**:
1. **Portfolio Development**:
   ${skills.filter(s => s.progress > 50).slice(0, 2).map(s => 
     `- Build a ${getProjectSuggestion(s.name)} project`
   ).join('\n   ')}

2. **Interview Preparation**:
   - Master data structures and algorithms
   - Practice system design basics
   - Prepare behavioral interview answers
   - Mock interview sessions

3. **Professional Networking**:
   - Update LinkedIn profile
   - Attend local meetups and conferences
   - Contribute to open source projects
   - Build professional relationships

**Market Insights**:
- **High Demand**: Full-stack development, cloud technologies
- **Growing Fields**: AI/ML, cybersecurity, mobile development
- **Salary Ranges**: 
  - Junior: $50,000 - $70,000
  - Mid-level: $70,000 - $100,000
  - Senior: $100,000 - $150,000+

**Job Search Strategy**:
- Target companies using your strongest skills
- Customize applications for each role
- Showcase projects relevant to job requirements
- Prepare for technical assessments

**Professional Development**:
- Obtain relevant certifications
- Attend industry conferences
- Build thought leadership through content
- Develop soft skills alongside technical skills

What specific career aspect would you like detailed guidance on?`;
    }
    else if (isCodeQuery) {
      return `**Technical Assistance**:

**1. Debugging Approach**:
   - **Isolate**: Use browser dev tools or IDE debuggers
   - **Test**: Small components first, then integrate
   - **Verify**: Check common issues like syntax errors, typos, logic flaws

**2. Code Quality Checklist**:
   - Follow consistent naming conventions
   - Write clean, readable code with proper indentation
   - Add meaningful comments for complex logic
   - Use version control effectively
   - Implement proper error handling

**3. When Stuck**:
   - **Search Strategy**: "${skills.map(s => s.name).join(' ')} ${lowerCaseMessage.split(' ').slice(-2).join(' ')}"
   - **Community Help**: Stack Overflow, Reddit, Discord servers
   - **Documentation**: Official docs are your best friend
   - **Rubber Duck Debugging**: Explain the problem out loud

**4. Best Practices by Technology**:
${skills.slice(0, 3).map(skill => 
  `   - **${skill.name}**: ${getBestPractices(skill.name)}`
).join('\n')}

**5. Performance Optimization**:
   - Profile your code to identify bottlenecks
   - Optimize algorithms and data structures
   - Minimize network requests and database queries
   - Use caching strategies effectively

**6. Security Considerations**:
   - Validate all user inputs
   - Use HTTPS for data transmission
   - Implement proper authentication
   - Keep dependencies updated

**7. Testing Strategy**:
   - Write unit tests for individual functions
   - Implement integration tests for workflows
   - Use automated testing tools
   - Test edge cases and error conditions

**Common Issues & Solutions**:
- **Syntax Errors**: Use linting tools and IDE extensions
- **Logic Errors**: Step through code with debugger
- **Performance Issues**: Profile and optimize critical paths
- **Integration Problems**: Test components in isolation first

What specific coding issue are you facing? Feel free to share your code or describe the problem in detail!`;
    }
    else if (isProgressQuery) {
      return `**Progress Analysis**:

${skills.map(skill => 
  `**${skill.name}**: ${skill.progress}% | ${
    skill.progress < 30 ? 'Beginner' : 
    skill.progress < 70 ? 'Intermediate' : 'Advanced'
  } | Next: ${skill.learningModules.find(m => !m.completed)?.title || 'Complete!'}`
).join('\n')}

**Overall Assessment**:
- **Average Progress**: ${Math.round(totalProgress)}%
- **Completed Skills**: ${completedSkills}/${skills.length}
- **Learning Velocity**: ${totalProgress > 60 ? 'Excellent' : totalProgress > 30 ? 'Good' : 'Building momentum'}

**Strengths**:
- **Strongest Skill**: ${strongestSkill?.name} (${strongestSkill?.progress}%)
- **Consistent Areas**: ${skills.filter(s => s.progress > 50).map(s => s.name).join(', ') || 'Building foundations'}

**Growth Opportunities**:
- **Focus Area**: ${weakestSkill?.name} (${weakestSkill?.progress}%)
- **Quick Wins**: Complete modules in ${skills.filter(s => s.progress > 80 && s.progress < 100).map(s => s.name).join(', ') || 'current skills'}

**Recommendations**:
${totalProgress < 30 ? 
  '- Focus on one skill at a time to build momentum\n- Set daily learning goals\n- Join beginner-friendly communities' :
  totalProgress < 70 ?
  '- Balance learning new concepts with building projects\n- Start contributing to open source\n- Begin building your portfolio' :
  '- Focus on advanced topics and specialization\n- Mentor others and share knowledge\n- Prepare for senior-level opportunities'
}

**Next 30 Days Action Plan**:
1. **Week 1-2**: Focus on ${weakestSkill?.name || 'foundation skills'}
2. **Week 3-4**: Build a project using ${strongestSkill?.name || 'your best skill'}
3. **Daily Goal**: Complete 1 learning module
4. **Weekly Goal**: Build something practical

**Motivation Boost**:
- You've made ${Math.round(totalProgress)}% progress - that's significant!
- Every completed module makes you more valuable
- Your consistency is building real expertise
- You're closer to your goals than when you started

What specific area would you like to focus on improving next?`;
    }

    // Default response with more actionable guidance
    return `I'll provide precise guidance based on your ${skills.length} skills:

**Your Learning Profile**:
- **Total Skills**: ${skills.length} technologies
- **Average Progress**: ${Math.round(totalProgress)}%
- **Strongest Area**: ${strongestSkill?.name || 'Getting started'} (${strongestSkill?.progress || 0}%)
- **Focus Area**: ${weakestSkill?.name || 'All skills'} (${weakestSkill?.progress || 0}%)

**1. Immediate Action Items**:
   - Complete: ${skills.find(s => s.progress > 80)?.learningModules.find(m => !m.completed)?.title || 'Next available module'}
   - Practice: Core concepts in ${weakestSkill?.name || 'your chosen technology'}
   - Build: A small project using ${strongestSkill?.name || 'your skills'}

**2. Quick Wins** (This Week):
   - Finish any modules above 80% completion
   - Review and practice fundamental concepts
   - Set up a proper development environment
   - Join relevant developer communities

**3. Long-Term Growth** (Next Month):
   - Complete 2-3 full skill modules
   - Build a portfolio project
   - Start contributing to open source
   - Network with other developers

**4. Learning Strategy**:
   - **Daily**: 45-60 minutes focused learning
   - **Weekly**: Build something practical
   - **Monthly**: Review progress and adjust goals
   - **Quarterly**: Major project or skill addition

**5. Success Metrics**:
   - Module completion rate
   - Project complexity increase
   - Community involvement
   - Technical interview readiness

**How I Can Help You**:
- **Specific Skill Guidance**: Ask about any technology you're learning
- **Learning Plans**: Get personalized study schedules
- **Career Advice**: Job market insights and preparation
- **Technical Help**: Debugging and best practices
- **Motivation**: Progress reviews and goal setting

What specific question can I answer about your current learning journey?`;
  };

  // Helper functions for enhanced responses
  const getProjectSuggestion = (skillName: string): string => {
    const projects: Record<string, string> = {
      'JavaScript': 'interactive web application',
      'React': 'dynamic single-page application',
      'TypeScript': 'type-safe web application',
      'CSS': 'responsive portfolio website',
      'HTML': 'semantic web page',
      'Python': 'data analysis tool',
      'Java': 'object-oriented application',
      'Go': 'concurrent web service',
      'Ruby': 'web application with Rails',
      'PHP': 'dynamic web application',
      'Rust': 'systems programming project',
      'Swift': 'iOS mobile application',
      'C#': '.NET web application',
      'C++': 'performance-critical application'
    };
    return projects[skillName] || 'practical application';
  };

  const getBestPractices = (skillName: string): string => {
    const practices: Record<string, string> = {
      'JavaScript': 'Use const/let, avoid global variables, handle errors properly',
      'React': 'Use hooks, keep components small, manage state effectively',
      'TypeScript': 'Define proper types, use interfaces, enable strict mode',
      'CSS': 'Use flexbox/grid, follow BEM methodology, optimize for performance',
      'HTML': 'Use semantic elements, ensure accessibility, validate markup',
      'Python': 'Follow PEP 8, use virtual environments, write docstrings',
      'Java': 'Follow naming conventions, use proper OOP principles, handle exceptions',
      'Go': 'Use goroutines wisely, handle errors explicitly, follow Go conventions',
      'Ruby': 'Follow Ruby style guide, use gems appropriately, write tests',
      'PHP': 'Use modern PHP features, follow PSR standards, sanitize inputs',
      'Rust': 'Understand ownership, use pattern matching, handle errors with Result',
      'Swift': 'Use optionals properly, follow Swift conventions, leverage protocols',
      'C#': 'Use LINQ effectively, follow .NET conventions, implement IDisposable',
      'C++': 'Manage memory carefully, use RAII, prefer smart pointers'
    };
    return practices[skillName] || 'Follow language conventions and best practices';
  };

  const handleSendMessage = async (messageContent?: string) => {
    const content = messageContent || inputValue;
    if (!content.trim() || isLoading) return;
    
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: Date.now(),
      reactions: [],
      attachments: []
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    
    try {
      const response = await generateAIResponse(content);
      
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: response,
        sender: 'ai',
        timestamp: Date.now(),
        reactions: [],
        attachments: []
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: "I apologize, but I'm experiencing technical difficulties. Please try again in a moment.",
        sender: 'ai',
        timestamp: Date.now(),
        reactions: [],
        attachments: []
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (action: QuickAction) => {
    handleSendMessage(action.prompt);
  };

  const clearChat = () => {
    setMessages([{
      id: '1',
      content: "Hello! I'm your AI Skill Coach. I'm here to help you with your coding journey. What would you like to explore today?",
      sender: 'ai',
      timestamp: Date.now(),
      reactions: [],
      attachments: []
    }]);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="p-2 bg-white/20 backdrop-blur-sm rounded-xl"
            >
              <Bot className="h-6 w-6 text-white" />
            </motion.div>
            
            <div>
              <h2 className="text-xl font-bold text-white flex items-center">
                AI Skill Coach
                <Sparkles className="h-5 w-5 ml-2 text-yellow-300" />
              </h2>
              <div className="flex items-center space-x-3 text-blue-100 text-sm">
                <span>{skills.length} skills tracked</span>
                <span>•</span>
                <span>Enhanced AI</span>
              </div>
            </div>
          </div>
          
          <button
            onClick={clearChat}
            className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
            title="Clear chat"
          >
            <Trash2 className="h-5 w-5 text-white" />
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center space-x-2 mb-3">
          <Lightbulb className="h-4 w-4 text-blue-600" />
          <span className="text-sm font-medium text-gray-700">Quick Help</span>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          {quickActions.map((action) => (
            <motion.button
              key={action.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleQuickAction(action)}
              className={`p-3 rounded-lg bg-gradient-to-r ${action.color} text-white text-sm font-medium flex flex-col items-center space-y-1 hover:shadow-md transition-all duration-200`}
            >
              <action.icon className="h-4 w-4" />
              <span className="text-center leading-tight">{action.label}</span>
            </motion.button>
          ))}
        </div>
      </div>
      
      {/* Messages - Larger Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.sender === 'user'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-tr-md'
                    : 'bg-white text-gray-800 rounded-tl-md shadow-sm border border-gray-200'
                }`}
              >
                <div className="flex items-center mb-2">
                  {message.sender === 'ai' ? (
                    <Bot className="h-4 w-4 mr-2 text-blue-600" />
                  ) : (
                    <User className="h-4 w-4 mr-2 text-white" />
                  )}
                  <span className={`text-xs font-medium ${message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                    {message.sender === 'ai' ? 'AI Coach' : 'You'}
                  </span>
                  <span className={`text-xs ml-2 ${message.sender === 'user' ? 'text-blue-200' : 'text-gray-400'}`}>
                    {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                
                <div className="whitespace-pre-wrap leading-relaxed text-sm">
                  {message.content}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {/* Typing Indicator */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="max-w-[80%] rounded-2xl px-4 py-3 bg-white text-gray-800 rounded-tl-md shadow-sm border border-gray-200">
              <div className="flex items-center mb-2">
                <Bot className="h-4 w-4 mr-2 text-blue-600" />
                <span className="text-xs font-medium text-gray-500">AI Coach</span>
              </div>
              <div className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-gray-600 text-sm">Analyzing...</span>
              </div>
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-200">
        <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask me about learning, skills, career advice, or coding help..."
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-gray-50 placeholder-gray-500"
                disabled={isLoading}
              />
            </div>
            
            <button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 ${
                isLoading || !inputValue.trim()
                  ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
              }`}
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
              <span>Send</span>
            </button>
          </div>
          
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-4">
              <span>💡 Ask about specific skills, learning tips, or career guidance</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <MessageSquare className="h-3 w-3 text-blue-500" />
                <span>Enhanced AI</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AISkillCoach;