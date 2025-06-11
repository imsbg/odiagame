
import React from 'react';

interface StartScreenProps {
  onStart: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  return (
    <div className="text-center py-10">
      <h2 className="text-2xl font-semibold mb-4 text-purple-300">ଦୁଃସାହସିକ ଖେଳକୁ ସ୍ଵାଗତ!</h2>
      <p className="text-gray-300 mb-8 max-w-md mx-auto">
        ଏକ ରହସ୍ୟମୟ ଯାତ୍ରାରେ ବାହାରନ୍ତୁ ଯେଉଁଠାରେ ଆପଣଙ୍କ ପସନ୍ଦ କାହାଣୀକୁ ଆକାର ଦେବ। ଆପଣ ପ୍ରସ୍ତୁତ କି?
      </p>
      <button
        onClick={onStart}
        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-8 rounded-lg shadow-xl transition-all duration-200 ease-in-out transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-purple-400 focus:ring-opacity-50"
      >
        ଖେଳ ଆରମ୍ଭ କରନ୍ତୁ
      </button>
    </div>
  );
};

export default StartScreen;
