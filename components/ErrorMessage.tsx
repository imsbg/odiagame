
import React from 'react';

interface ErrorMessageProps {
  message: string;
  onClear?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onClear }) => {
  if (!message) return null;

  return (
    <div className="bg-red-500 bg-opacity-30 border border-red-700 text-red-200 px-4 py-3 rounded-lg relative shadow-md" role="alert">
      <strong className="font-bold">ତ୍ରୁଟି! </strong>
      <span className="block sm:inline">{message}</span>
      {onClear && (
         <button 
            onClick={onClear} 
            className="absolute top-0 bottom-0 right-0 px-4 py-3 text-red-200 hover:text-red-100"
            aria-label="Close error message"
          >
           <svg className="fill-current h-6 w-6" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>ବନ୍ଦ କରନ୍ତୁ</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
         </button>
      )}
    </div>
  );
};

export default ErrorMessage;
