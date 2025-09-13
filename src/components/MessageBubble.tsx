import React from 'react';
import { format } from 'date-fns';
import { ThumbsUp, ThumbsDown, Copy, User } from 'lucide-react';
import { Message } from '../types/chat';

interface MessageBubbleProps {
  message: Message;
  onRate: (messageId: string, rating: number) => void;
  onLike: (messageId: string) => void;
  onDislike: (messageId: string) => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  onRate,
  onLike,
  onDislike
}) => {
  const isBot = message.sender === 'bot';
  const timeString = format(message.timestamp, 'HH:mm');

  const copyToClipboard = () => {
    navigator.clipboard.writeText(message.content);
  };

  // Enhanced text formatting function with better markdown parsing
  const formatText = (text: string) => {
    if (!text) return '';

    // Split by code blocks first to preserve them
    const codeBlockRegex = /```([\s\S]*?)```/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(text)) !== null) {
      // Add text before code block
      if (match.index > lastIndex) {
        parts.push({ type: 'text', content: text.slice(lastIndex, match.index) });
      }
      // Add code block
      parts.push({ type: 'codeblock', content: match[1].trim() });
      lastIndex = match.index + match[0].length;
    }
    
    // Add remaining text
    if (lastIndex < text.length) {
      parts.push({ type: 'text', content: text.slice(lastIndex) });
    }

    return parts.map((part, index) => {
      if (part.type === 'codeblock') {
        return (
          <pre key={index} className="bg-gray-100 border border-gray-200 rounded-lg p-4 my-4 overflow-x-auto">
            <code className="text-sm font-mono text-gray-800 whitespace-pre-wrap">{part.content}</code>
          </pre>
        );
      }

      // Format regular text with improved regex patterns
      let formattedText = part.content;
      
      // Headers (must come before bold formatting)
      formattedText = formattedText.replace(/^#### (.*$)/gm, '<h4 class="text-base font-semibold text-gray-900 mt-4 mb-2 border-l-4 border-blue-500 pl-3">$1</h4>');
      formattedText = formattedText.replace(/^### (.*$)/gm, '<h3 class="text-lg font-semibold text-gray-900 mt-5 mb-3 border-l-4 border-green-500 pl-3">$1</h3>');
      formattedText = formattedText.replace(/^## (.*$)/gm, '<h2 class="text-xl font-semibold text-gray-900 mt-6 mb-4 border-l-4 border-blue-600 pl-3">$1</h2>');
      formattedText = formattedText.replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold text-gray-900 mt-6 mb-4 border-l-4 border-green-600 pl-3">$1</h1>');
      
      // Bold text (avoid matching already processed headers)
      formattedText = formattedText.replace(/\*\*((?!.*<\/h[1-6]>).*?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>');
      
      // Italic text
      formattedText = formattedText.replace(/\*([^*\n]+)\*/g, '<em class="italic text-gray-700">$1</em>');
      
      // Inline code
      formattedText = formattedText.replace(/`([^`\n]+)`/g, '<code class="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-800 border">$1</code>');
      
      // Blockquotes
      formattedText = formattedText.replace(/^> (.*$)/gm, '<blockquote class="border-l-4 border-blue-400 pl-4 py-2 my-3 bg-blue-50 italic text-gray-700">$1</blockquote>');
      
      // Horizontal rules
      formattedText = formattedText.replace(/^---$/gm, '<hr class="my-6 border-gray-300" />');
      
      // Unordered lists (improved pattern)
      formattedText = formattedText.replace(/^- (.+$)/gm, '<li class="ml-6 mb-2 relative"><span class="absolute -left-4 text-blue-600">•</span>$1</li>');
      
      // Ordered lists
      formattedText = formattedText.replace(/^\d+\. (.+$)/gm, '<li class="ml-6 mb-2 list-decimal list-inside">$1</li>');
      
      // Links
      formattedText = formattedText.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:text-blue-800 underline font-medium" target="_blank" rel="noopener noreferrer">$1</a>');
      
      // Line breaks (convert double newlines to paragraphs, single to br)
      formattedText = formattedText.replace(/\n\n/g, '</p><p class="mb-3">');
      formattedText = formattedText.replace(/\n/g, '<br />');
      
      // Wrap in paragraph if not already wrapped
      if (!formattedText.includes('<h') && !formattedText.includes('<li') && !formattedText.includes('<blockquote')) {
        formattedText = `<p class="mb-3">${formattedText}</p>`;
      }

      return (
        <div 
          key={index} 
          className="prose prose-sm max-w-none leading-relaxed"
          dangerouslySetInnerHTML={{ __html: formattedText }}
        />
      );
    });
  };

  return (
    <div className={`group ${isBot ? 'bg-gray-50' : 'bg-white'} border-b border-gray-100`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex gap-3 sm:gap-4">
          <div className="flex-shrink-0">
            {isBot ? (
              <img
                src="https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop"
                alt="ArtBot Assistant"
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-green-500 shadow-sm"
              />
            ) : (
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-full flex items-center justify-center shadow-sm">
                <User size={16} className="text-white" />
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-semibold text-gray-900 text-sm sm:text-base">
                {isBot ? 'ArtBot' : 'You'}
              </span>
              <span className="text-xs text-gray-500">{timeString}</span>
            </div>
            
            <div className="text-gray-800 leading-relaxed text-sm sm:text-base">
              {formatText(message.content)}
            </div>
            
            {isBot && (
              <div className="flex items-center gap-1 mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button
                  onClick={copyToClipboard}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                  aria-label="Copy message"
                  title="Copy message"
                >
                  <Copy size={14} />
                </button>
                
                <button
                  onClick={() => onLike(message.id)}
                  className={`p-2 rounded-lg transition-colors duration-200 ${
                    message.liked
                      ? 'text-green-600 bg-green-100'
                      : 'text-gray-400 hover:text-green-600 hover:bg-gray-200'
                  }`}
                  aria-label="Like message"
                  title="Like message"
                >
                  <ThumbsUp size={14} />
                </button>
                
                <button
                  onClick={() => onDislike(message.id)}
                  className={`p-2 rounded-lg transition-colors duration-200 ${
                    message.disliked
                      ? 'text-red-600 bg-red-100'
                      : 'text-gray-400 hover:text-red-600 hover:bg-gray-200'
                  }`}
                  aria-label="Dislike message"
                  title="Dislike message"
                >
                  <ThumbsDown size={14} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};