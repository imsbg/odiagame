
import React from 'react';

interface StoryDisplayProps {
  story: string;
}

const StoryDisplay: React.FC<StoryDisplayProps> = ({ story }) => {
  if (!story) return null;

  return (
    <div className="bg-gray-700 bg-opacity-50 p-4 md:p-6 rounded-lg shadow-inner">
      <p className="text-lg md:text-xl leading-relaxed text-gray-200 whitespace-pre-wrap">
        {story}
      </p>
    </div>
  );
};

export default StoryDisplay;
