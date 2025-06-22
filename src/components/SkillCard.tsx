import React from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Skill } from '../types';
import * as Icons from 'lucide-react';

interface SkillCardProps {
  skill: Skill;
  onClick: () => void;
  isSelected: boolean;
}

const SkillCard: React.FC<SkillCardProps> = ({ skill, onClick, isSelected }) => {
  // Dynamically get the icon component
  const IconComponent = Icons[skill.icon as keyof typeof Icons] || Icons.Code;
  
  return (
    <div 
      className={`bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg cursor-pointer ${
        isSelected ? 'ring-2 ring-indigo-500 scale-[1.02]' : ''
      }`}
      onClick={onClick}
    >
      <div className={`h-2 bg-gradient-to-r ${skill.color}`}></div>
      <div className="p-5">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="font-bold text-lg text-gray-800">{skill.name}</h3>
            <p className="text-gray-600 text-sm mt-1">{skill.description}</p>
          </div>
          
          <div className="w-14 h-14 ml-4">
            <CircularProgressbar
              value={skill.progress}
              text={`${skill.progress}%`}
              styles={buildStyles({
                textSize: '28px',
                pathColor: `rgba(62, 152, 199, ${skill.progress / 100})`,
                textColor: '#3e98c7',
                trailColor: '#d6d6d6',
              })}
            />
          </div>
        </div>
        
        <div className="mt-4 flex justify-between items-center">
          <div className="bg-gray-100 p-2 rounded-full">
            <IconComponent className="h-5 w-5 text-gray-600" />
          </div>
          
          <button 
            className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
};

export default SkillCard;