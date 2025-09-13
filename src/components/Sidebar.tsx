import React, { useState } from 'react';
import { Plus, MessageSquare, Trash2, Edit3, X, Check, Menu } from 'lucide-react';
import { Chat } from '../types/chat';
import { format } from 'date-fns';

interface SidebarProps {
  chats: Chat[];
  currentChatId: string | null;
  onNewChat: () => void;
  onSwitchChat: (chatId: string) => void;
  onDeleteChat: (chatId: string) => void;
  onUpdateChatTitle: (chatId: string, title: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  chats,
  currentChatId,
  onNewChat,
  onSwitchChat,
  onDeleteChat,
  onUpdateChatTitle,
  isOpen,
  onClose
}) => {
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const handleEditStart = (chat: Chat) => {
    setEditingChatId(chat.id);
    setEditTitle(chat.title);
  };

  const handleEditSave = () => {
    if (editingChatId && editTitle.trim()) {
      onUpdateChatTitle(editingChatId, editTitle.trim());
    }
    setEditingChatId(null);
    setEditTitle('');
  };

  const handleEditCancel = () => {
    setEditingChatId(null);
    setEditTitle('');
  };

  const generateChatTitle = (messages: any[]) => {
    const firstUserMessage = messages.find(m => m.sender === 'user');
    if (firstUserMessage) {
      return firstUserMessage.content.slice(0, 30) + (firstUserMessage.content.length > 30 ? '...' : '');
    }
    return 'New Chat';
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full w-80 bg-white border-r border-gray-200 z-50 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:relative lg:translate-x-0 lg:z-auto
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 bg-white">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Chats</h2>
              <button
                onClick={onClose}
                className="lg:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Close sidebar"
              >
                <X size={20} />
              </button>
            </div>
            
            <button
              onClick={() => {
                onNewChat();
                onClose();
              }}
              className="w-full flex items-center gap-3 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
            >
              <Plus size={18} />
              <span>New Chat</span>
            </button>
          </div>

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto bg-white">
            {chats.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <MessageSquare size={48} className="mx-auto mb-3 text-gray-300" />
                <p className="font-medium text-gray-600">No chats yet</p>
                <p className="text-sm text-gray-500 mt-1">Start a new conversation</p>
              </div>
            ) : (
              <div className="p-2">
                {chats.map((chat) => (
                  <div
                    key={chat.id}
                    className={`
                      group relative mb-1 rounded-lg transition-all cursor-pointer border
                      ${currentChatId === chat.id 
                        ? 'bg-blue-50 border-blue-200 shadow-sm' 
                        : 'hover:bg-gray-50 border-transparent hover:border-gray-200'
                      }
                    `}
                  >
                    <div
                      onClick={() => {
                        onSwitchChat(chat.id);
                        onClose();
                      }}
                      className="flex items-center gap-3 p-3 pr-12"
                    >
                      <MessageSquare 
                        size={16} 
                        className={`flex-shrink-0 ${
                          currentChatId === chat.id ? 'text-blue-600' : 'text-gray-400'
                        }`} 
                      />
                      <div className="flex-1 min-w-0">
                        {editingChatId === chat.id ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') handleEditSave();
                                if (e.key === 'Escape') handleEditCancel();
                              }}
                              className="flex-1 bg-white border border-gray-300 text-gray-900 px-2 py-1 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              autoFocus
                            />
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditSave();
                              }}
                              className="p-1 text-green-600 hover:bg-green-100 rounded"
                            >
                              <Check size={14} />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditCancel();
                              }}
                              className="p-1 text-gray-500 hover:bg-gray-100 rounded"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ) : (
                          <>
                            <div className={`font-medium text-sm truncate ${
                              currentChatId === chat.id ? 'text-blue-900' : 'text-gray-900'
                            }`}>
                              {chat.title || generateChatTitle(chat.messages)}
                            </div>
                            <div className="text-xs text-gray-500 truncate mt-1">
                              {chat.messages.length} messages • {format(chat.updatedAt, 'MMM d')}
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    {editingChatId !== chat.id && (
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditStart(chat);
                            }}
                            className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded"
                            title="Rename chat"
                          >
                            <Edit3 size={14} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm('Delete this chat?')) {
                                onDeleteChat(chat.id);
                              }
                            }}
                            className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-100 rounded"
                            title="Delete chat"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="text-xs text-gray-600 text-center">
              <div className="font-medium">ArtBot</div>
              <div>Arts Festival Assistant</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};