import React, { useEffect, useRef, useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { ChatHeader } from './components/ChatHeader';
import { MessageBubble } from './components/MessageBubble';
import { TypingIndicator } from './components/TypingIndicator';
import { ChatInput } from './components/ChatInput';
import { QuickReplies } from './components/QuickReplies';
import { ErrorMessage } from './components/ErrorMessage';
import { useChat } from './hooks/useChat';

function App() {
  const {
    messages,
    isTyping,
    error,
    chats,
    currentChatId,
    currentChat,
    sendMessage,
    rateMessage,
    likeMessage,
    dislikeMessage,
    clearChat,
    exportChat,
    shareChat,
    createNewChat,
    switchToChat,
    deleteChat,
    updateChatTitle
  } = useChat();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar
        chats={chats}
        currentChatId={currentChatId}
        onNewChat={createNewChat}
        onSwitchChat={switchToChat}
        onDeleteChat={deleteChat}
        onUpdateChatTitle={updateChatTitle}
        isOpen={sidebarOpen}
        onClose={closeSidebar}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-white">
        <ChatHeader
          onClearChat={clearChat}
          onExportChat={exportChat}
          onShareChat={shareChat}
          messageCount={messages.length}
          chatTitle={currentChat?.title}
          onToggleSidebar={toggleSidebar}
          sidebarOpen={sidebarOpen}
        />

        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto"
          role="log"
          aria-live="polite"
          aria-label="Chat messages"
        >
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              onRate={rateMessage}
              onLike={likeMessage}
              onDislike={dislikeMessage}
            />
          ))}

          {isTyping && <TypingIndicator />}
          
          {error && (
            <ErrorMessage 
              error={error} 
              onRetry={() => window.location.reload()} 
            />
          )}

          <div ref={messagesEndRef} />
        </div>

        {messages.length <= 1 && (
          <QuickReplies onQuickReply={sendMessage} />
        )}

        <ChatInput
          onSendMessage={sendMessage}
          disabled={isTyping}
        />
      </div>
    </div>
  );
}

export default App;