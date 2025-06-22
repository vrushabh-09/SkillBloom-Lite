import React from 'react';
import SkillCard from './SkillCard';
import MicrolearningChecklist from './MicrolearningChecklist';
import { Skill } from '../types';

interface SkillGardenProps {
  skills: Skill[];
  selectedSkill: Skill | null;
  onSkillSelect: (skill: Skill | null) => void;
  onSkillUpdate: (skill: Skill) => void;
}

const SkillGarden: React.FC<SkillGardenProps> = ({
  skills,
  selectedSkill,
  onSkillSelect,
  onSkillUpdate
}) => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Skill Garden</h2>
        
        {skills.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <p className="text-gray-600">
              No skills added yet. Analyze a GitHub repository to get started!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {skills.map((skill) => (
              <SkillCard
                key={skill.id}
                skill={skill}
                onClick={() => onSkillSelect(skill)}
                isSelected={selectedSkill?.id === skill.id}
              />
            ))}
          </div>
        )}
      </div>
      
      {selectedSkill && (
        <MicrolearningChecklist
          skill={selectedSkill}
          onSkillUpdate={onSkillUpdate}
          onClose={() => onSkillSelect(null)}
        />
      )}
    </div>
  );
};

export default SkillGarden;