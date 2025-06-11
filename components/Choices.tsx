
import React from 'react';

interface ChoicesProps {
  choices: string[];
  onChoiceSelected: (choice: string) => void;
}

const Choices: React.FC<ChoicesProps> = ({ choices, onChoiceSelected }) => {
  if (!choices || choices.length === 0) return null;

  return (
    <div className="mt-6 space-y-3 md:space-y-4">
      <h3 className="text-xl font-semibold text-purple-300 mb-3">ତୁମେ କ'ଣ କରିବ?</h3>
      {choices.map((choice, index) => (
        <button
          key={index}
          onClick={() => onChoiceSelected(choice)}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-lg shadow-md transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-75 transform hover:scale-105"
        >
          {choice}
        </button>
      ))}
    </div>
  );
};

export default Choices;
