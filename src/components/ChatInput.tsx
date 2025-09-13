import React, { useState, useRef } from 'react';
import { Send, Paperclip, X, FileText, Image as ImageIcon } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string, imageFile?: File) => void;
  disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  disabled = false
}) => {
  const [message, setMessage] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((message.trim() || uploadedFile) && !disabled) {
      const finalMessage = message.trim() || 'Please analyze this image for me.';
      
      onSendMessage(finalMessage, uploadedFile || undefined);
      
      setMessage('');
      setUploadedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check if it's an image for vision capabilities
      if (file.type.startsWith('image/')) {
        setUploadedFile(file);
      } else {
        setUploadedFile(file);
      }
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <ImageIcon size={16} className="text-green-600" />;
    }
    return <FileText size={16} className="text-blue-600" />;
  };

  const isImageFile = (file: File) => file.type.startsWith('image/');

  return (
    <div className="bg-white border-t border-gray-200 sticky bottom-0 shadow-lg">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
        {uploadedFile && (
          <div className="mb-3 p-3 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getFileIcon(uploadedFile)}
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-700 truncate max-w-xs">
                  {uploadedFile.name}
                </span>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>({(uploadedFile.size / 1024).toFixed(2)} KB)</span>
                  {isImageFile(uploadedFile) && (
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                      Vision Enabled
                    </span>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={removeFile}
              className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded transition-colors"
              aria-label="Remove file"
            >
              <X size={16} />
            </button>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="relative">
          <div className="flex items-end gap-2 bg-white border border-gray-300 rounded-xl shadow-sm focus-within:border-blue-500 focus-within:shadow-md transition-all duration-200">
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={message}
                onChange={handleInput}
                onKeyPress={handleKeyPress}
                placeholder={uploadedFile ? "Ask me about this file..." : "Message ArtBot..."}
                disabled={disabled}
                className="w-full px-4 py-3 pr-12 resize-none focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed max-h-48 min-h-[52px] bg-transparent text-gray-900 placeholder-gray-500"
                rows={1}
              />
              
              <div className="absolute right-2 bottom-2 flex items-center gap-1">
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileSelect}
                  className="hidden"
                  accept="image/*,.pdf,.doc,.docx,.txt,.json,.csv"
                />
                
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  aria-label="Attach file"
                  disabled={disabled}
                  title="Upload image or document"
                >
                  <Paperclip size={16} />
                </button>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={(!message.trim() && !uploadedFile) || disabled}
              className="m-2 p-2.5 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-black flex-shrink-0"
              aria-label="Send message"
            >
              <Send size={16} />
            </button>
          </div>
        </form>
        
        <div className="mt-2 text-xs text-gray-500 text-center">
          Press Enter to send • Shift+Enter for new line • Upload images for AI vision analysis
        </div>
      </div>
    </div>
  );
};