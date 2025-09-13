import React, { useState } from 'react';
import { MoreHorizontal, Share, Download, Trash2, MessageSquare, Menu, X } from 'lucide-react';

interface ChatHeaderProps {
  onClearChat: () => void;
  onExportChat: () => void;
  onShareChat: () => void;
  messageCount: number;
  chatTitle?: string;
  onToggleSidebar: () => void;
  sidebarOpen: boolean;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  onClearChat,
  onExportChat,
  onShareChat,
  messageCount,
  chatTitle,
  onToggleSidebar,
  sidebarOpen
}) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
      <div className="px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onToggleSidebar}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200 lg:hidden"
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
            
            <img
              src="https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop"
              alt="ArtBot"
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-green-500"
            />
            <div>
              <h1 className="font-semibold text-gray-900 text-sm sm:text-base">
                {chatTitle || 'ArtBot'}
              </h1>
              <p className="text-xs sm:text-sm text-gray-500">Arts Festival Assistant</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded-md">
              {messageCount} messages
            </span>
            
            {/* Desktop Menu */}
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                aria-label="Menu"
              >
                <MoreHorizontal size={18} />
              </button>
              
              {showMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setShowMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-20">
                    <button
                      onClick={() => {
                        onShareChat();
                        setShowMenu(false);
                      }}
                      className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Share size={16} />
                      Share conversation
                    </button>
                    
                    <button
                      onClick={() => {
                        onExportChat();
                        setShowMenu(false);
                      }}
                      className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Download size={16} />
                      Export chat
                    </button>
                    
                    <hr className="my-2 border-gray-200" />
                    
                    <button
                      onClick={() => {
                        onClearChat();
                        setShowMenu(false);
                      }}
                      className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 size={16} />
                      Clear conversation
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};