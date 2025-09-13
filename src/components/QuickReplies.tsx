import React from 'react';
import { Calendar, MapPin, Music, Palette, Theater, Coffee, Clock, Users } from 'lucide-react';
import { QuickReply } from '../types/chat';

interface QuickRepliesProps {
  onQuickReply: (text: string) => void;
}

export const QuickReplies: React.FC<QuickRepliesProps> = ({ onQuickReply }) => {
  const quickReplies: QuickReply[] = [
    { id: '1', text: 'Show me today\'s events', category: 'schedule' },
    { id: '2', text: 'Where is the main stage?', category: 'venue' },
    { id: '3', text: 'Tell me about music performances', category: 'music' },
    { id: '4', text: 'Art exhibition timings', category: 'art' },
    { id: '5', text: 'Theater show schedule', category: 'theater' },
    { id: '6', text: 'Food court locations', category: 'food' },
    { id: '7', text: 'Workshop registration', category: 'workshop' },
    { id: '8', text: 'Artist meet & greet sessions', category: 'artists' }
  ];

  const getIcon = (category: string) => {
    switch (category) {
      case 'schedule': return <Calendar size={16} />;
      case 'venue': return <MapPin size={16} />;
      case 'music': return <Music size={16} />;
      case 'art': return <Palette size={16} />;
      case 'theater': return <Theater size={16} />;
      case 'food': return <Coffee size={16} />;
      case 'workshop': return <Clock size={16} />;
      case 'artists': return <Users size={16} />;
      default: return <Calendar size={16} />;
    }
  };

  return (
    <div className="bg-white border-t border-gray-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-900 mb-2">Quick questions to get started:</h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {quickReplies.map((reply) => (
            <button
              key={reply.id}
              onClick={() => onQuickReply(reply.text)}
              className="flex items-center gap-2 px-3 py-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-sm text-gray-700 transition-colors duration-200 text-left"
            >
              <div className="text-gray-500 flex-shrink-0">
                {getIcon(reply.category)}
              </div>
              <span className="truncate">{reply.text}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};