
import React from 'react';
import LoadingSpinner from './LoadingSpinner';

interface ImageDisplayProps {
  imageUrl: string | null;
  altText: string;
  isLoading?: boolean;
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({ imageUrl, altText, isLoading }) => {
  return (
    <div className="w-full aspect-video bg-gray-700 rounded-lg shadow-lg overflow-hidden flex items-center justify-center relative">
      {isLoading && !imageUrl && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-700 bg-opacity-75 z-10">
          <LoadingSpinner />
          <p className="mt-2 text-purple-300">ଚିତ୍ର ଲୋଡ୍ କରୁଛି...</p>
        </div>
      )}
      {imageUrl && (
        <img 
          src={imageUrl} 
          alt={altText} 
          className="w-full h-full object-cover transition-opacity duration-500 ease-in-out"
          style={{ opacity: isLoading ? 0.5 : 1 }}
        />
      )}
      {!isLoading && !imageUrl && (
        <div className="text-gray-400 text-center p-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="mt-2">କୌଣସି ଚିତ୍ର ଉପଲବ୍ଧ ନାହିଁ</p>
        </div>
      )}
    </div>
  );
};

export default ImageDisplay;
