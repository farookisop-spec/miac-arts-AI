import React from 'react';

export const TypingIndicator: React.FC = () => {
  return (
    <div className="bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex gap-3 sm:gap-4">
          <div className="flex-shrink-0">
            <img
              src="https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop"
              alt="ArtBot Assistant"
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-green-500"
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-semibold text-gray-900 text-sm sm:text-base">ArtBot</span>
            </div>
            
            <div className="flex items-center gap-1">
              <div className="flex gap-1 bg-gray-200 rounded-full px-4 py-2">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};