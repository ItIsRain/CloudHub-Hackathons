import React from 'react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ExperienceLevelSelectProps {
  value: string;
  onValueChange: (value: string) => void;
}

interface ExperienceLevel {
  value: string;
  label: string;
  description: string;
}

const experienceLevels: ExperienceLevel[] = [
  {
    value: "beginner",
    label: "Beginner",
    description: "0-2 years of experience"
  },
  {
    value: "intermediate",
    label: "Intermediate",
    description: "2-5 years of experience"
  },
  {
    value: "advanced",
    label: "Advanced",
    description: "5-8 years of experience"
  },
  {
    value: "expert",
    label: "Expert",
    description: "8+ years of experience"
  }
];

const ExperienceLevelSelect: React.FC<ExperienceLevelSelectProps> = ({ value, onValueChange }) => {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="border-slate-200 dark:border-slate-700 focus:border-blue-500 hover:border-blue-400 dark:hover:border-blue-500 transition-colors h-11 rounded-lg shadow-sm">
        <SelectValue placeholder="Select level" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {experienceLevels.map((level) => (
            <SelectItem key={level.value} value={level.value}>
              <div className="flex flex-col">
                <span className="font-medium">{level.label}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">{level.description}</span>
              </div>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default ExperienceLevelSelect; 