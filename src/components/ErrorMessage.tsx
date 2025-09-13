import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorMessageProps {
  error: string;
  onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ error, onRetry }) => {
  return (
    <div className="bg-red-50 border-l-4 border-red-400 border-b border-gray-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
          <div className="flex-1">
            <h3 className="text-sm font-medium text-red-800 mb-1">Something went wrong</h3>
            <p className="text-sm text-red-700 mb-3">{error}</p>
            {onRetry && (
              <button
                onClick={onRetry}
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm transition-colors duration-200"
              >
                <RefreshCw size={14} />
                Try again
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};