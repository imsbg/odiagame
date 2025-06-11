
import React from 'react';

interface RestartButtonProps {
  onRestart: () => void;
}

const RestartButton: React.FC<RestartButtonProps> = ({ onRestart }) => {
  return (
    <button
      onClick={onRestart}
      className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold py-2 px-6 rounded-lg shadow-md transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-75 transform hover:scale-105"
    >
      ପୁଣି ଆରମ୍ଭ କରନ୍ତୁ
    </button>
  );
};

export default RestartButton;
