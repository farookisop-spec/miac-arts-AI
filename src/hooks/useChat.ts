import { useState, useCallback, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Message, ChatState, Chat } from '../types/chat';
import { openRouterService } from '../services/openrouter';

const getWelcomeMessage = (): Message => ({
  id: uuidv4(),
  content: "### 🎭 **Welcome to ArtBot!**\n\nI'm your **Arts Festival Assistant**, here to help you with:\n\n- **Event schedules** and performance timings\n- **Venue locations** and directions  \n- **Artist information** and meet & greet sessions\n- **Ticket booking** and registration\n- **Workshop details** and sign-ups\n- **Food courts** and vendor information\n- **Emergency contacts** and safety info\n\n*What would you like to know about the festival?* 🎨",
  sender: 'bot',
  timestamp: new Date()
});

export const useChat = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [chatState, setChatState] = useState<ChatState>({
    messages: [],
    isTyping: false,
    isLoading: false,
    error: null
  });

  const conversationRef = useRef<Array<{ role: string; content: string | Array<any> }>>([]);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Initialize with first chat if no chats exist
  useEffect(() => {
    if (chats.length === 0) {
      createNewChat();
    }
  }, []);

  // Update current chat state when switching chats
  useEffect(() => {
    if (currentChatId) {
      const currentChat = chats.find(chat => chat.id === currentChatId);
      if (currentChat) {
        setChatState(prev => ({
          ...prev,
          messages: currentChat.messages
        }));
        
        // Update conversation history for API
        conversationRef.current = currentChat.messages
          .filter(m => m.sender !== 'bot' || m.content !== '')
          .map(m => ({
            role: m.sender === 'user' ? 'user' : 'assistant',
            content: m.content
          }));
      }
    }
  }, [currentChatId, chats]);

  const createNewChat = useCallback(() => {
    const newChat: Chat = {
      id: uuidv4(),
      title: '',
      messages: [getWelcomeMessage()],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setChats(prev => [newChat, ...prev]);
    setCurrentChatId(newChat.id);
    conversationRef.current = [];
  }, []);

  const switchToChat = useCallback((chatId: string) => {
    setCurrentChatId(chatId);
    setChatState(prev => ({
      ...prev,
      isTyping: false,
      error: null
    }));
  }, []);

  const deleteChat = useCallback((chatId: string) => {
    setChats(prev => {
      const newChats = prev.filter(chat => chat.id !== chatId);
      
      // If deleting current chat, switch to another or create new
      if (chatId === currentChatId) {
        if (newChats.length > 0) {
          setCurrentChatId(newChats[0].id);
        } else {
          // Create a new chat if no chats left
          const newChat: Chat = {
            id: uuidv4(),
            title: '',
            messages: [getWelcomeMessage()],
            createdAt: new Date(),
            updatedAt: new Date()
          };
          setCurrentChatId(newChat.id);
          return [newChat];
        }
      }
      
      return newChats;
    });
  }, [currentChatId]);

  const updateChatTitle = useCallback((chatId: string, title: string) => {
    setChats(prev => prev.map(chat => 
      chat.id === chatId 
        ? { ...chat, title, updatedAt: new Date() }
        : chat
    ));
  }, []);

  const updateCurrentChat = useCallback((updater: (messages: Message[]) => Message[]) => {
    if (!currentChatId) return;

    setChats(prev => prev.map(chat => {
      if (chat.id === currentChatId) {
        const updatedMessages = updater(chat.messages);
        return {
          ...chat,
          messages: updatedMessages,
          updatedAt: new Date()
        };
      }
      return chat;
    }));
  }, [currentChatId]);

  const sendMessage = useCallback(async (content: string, imageFile?: File) => {
    // Prevent duplicate requests
    if (chatState.isTyping || !currentChatId) return;

    const userMessage: Message = {
      id: uuidv4(),
      content: imageFile ? `${content}\n\n📎 *Image uploaded: ${imageFile.name}*` : content,
      sender: 'user',
      timestamp: new Date()
    };

    // Add user message to current chat
    updateCurrentChat(messages => [...messages, userMessage]);

    setChatState(prev => ({
      ...prev,
      isTyping: true,
      error: null
    }));

    // Add to conversation history
    if (imageFile) {
      conversationRef.current.push({
        role: 'user',
        content: [
          { type: 'text', text: content },
          { type: 'image_url', image_url: { url: await fileToBase64(imageFile) } }
        ]
      });
    } else {
      conversationRef.current.push({ role: 'user', content });
    }

    // Create abort controller for this request
    abortControllerRef.current = new AbortController();

    try {
      let streamingResponse = '';
      const botMessageId = uuidv4();

      // Add empty bot message for streaming
      const emptyBotMessage: Message = {
        id: botMessageId,
        content: '',
        sender: 'bot',
        timestamp: new Date()
      };

      updateCurrentChat(messages => [...messages, emptyBotMessage]);

      const onStream = (chunk: string) => {
        streamingResponse += chunk;
        updateCurrentChat(messages => 
          messages.map(msg =>
            msg.id === botMessageId
              ? { ...msg, content: streamingResponse }
              : msg
          )
        );
      };

      let response: string;
      if (imageFile) {
        response = await openRouterService.sendMessageWithImage(
          content,
          imageFile,
          conversationRef.current.slice(0, -1), // Exclude the last message since we're handling it specially
          onStream
        );
      } else {
        response = await openRouterService.sendMessage(
          content,
          conversationRef.current.slice(0, -1),
          onStream
        );
      }

      // Ensure final response is set
      if (response && response !== streamingResponse) {
        updateCurrentChat(messages =>
          messages.map(msg =>
            msg.id === botMessageId
              ? { ...msg, content: response }
              : msg
          )
        );
      }

      conversationRef.current.push({ role: 'assistant', content: response || streamingResponse });

      setChatState(prev => ({
        ...prev,
        isTyping: false
      }));
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return; // Request was aborted, don't show error
      }

      const errorMessage = error instanceof Error ? error.message : 'Failed to send message. Please try again.';
      
      setChatState(prev => ({
        ...prev,
        isTyping: false,
        error: errorMessage,
      }));

      // Remove the empty bot message on error
      updateCurrentChat(messages => messages.filter(msg => msg.content !== ''));
    } finally {
      abortControllerRef.current = null;
    }
  }, [chatState.isTyping, currentChatId, updateCurrentChat]);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const rateMessage = useCallback((messageId: string, rating: number) => {
    updateCurrentChat(messages =>
      messages.map(msg =>
        msg.id === messageId ? { ...msg, rating } : msg
      )
    );
  }, [updateCurrentChat]);

  const likeMessage = useCallback((messageId: string) => {
    updateCurrentChat(messages =>
      messages.map(msg =>
        msg.id === messageId 
          ? { ...msg, liked: !msg.liked, disliked: false }
          : msg
      )
    );
  }, [updateCurrentChat]);

  const dislikeMessage = useCallback((messageId: string) => {
    updateCurrentChat(messages =>
      messages.map(msg =>
        msg.id === messageId 
          ? { ...msg, disliked: !msg.disliked, liked: false }
          : msg
      )
    );
  }, [updateCurrentChat]);

  const clearChat = useCallback(() => {
    // Abort any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    updateCurrentChat(() => [getWelcomeMessage()]);
    setChatState(prev => ({
      ...prev,
      isTyping: false,
      error: null
    }));
    conversationRef.current = [];
  }, [updateCurrentChat]);

  const exportChat = useCallback(() => {
    if (!currentChatId) return;
    
    const currentChat = chats.find(chat => chat.id === currentChatId);
    if (!currentChat) return;

    const chatData = {
      exportDate: new Date().toISOString(),
      chatTitle: currentChat.title || 'ArtBot Conversation',
      messages: currentChat.messages.map(msg => ({
        sender: msg.sender,
        content: msg.content,
        timestamp: msg.timestamp.toISOString(),
        rating: msg.rating,
        liked: msg.liked,
        disliked: msg.disliked
      }))
    };

    const blob = new Blob([JSON.stringify(chatData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `artbot-chat-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [chats, currentChatId]);

  const shareChat = useCallback(() => {
    if (!currentChatId) return;
    
    const currentChat = chats.find(chat => chat.id === currentChatId);
    if (!currentChat) return;

    const shareText = currentChat.messages
      .map(msg => `${msg.sender.toUpperCase()}: ${msg.content}`)
      .join('\n\n');
    
    if (navigator.share) {
      navigator.share({
        title: currentChat.title || 'My ArtBot Conversation',
        text: shareText
      });
    } else {
      navigator.clipboard.writeText(shareText);
      alert('Chat copied to clipboard!');
    }
  }, [chats, currentChatId]);

  const currentChat = currentChatId ? chats.find(chat => chat.id === currentChatId) : null;

  return {
    ...chatState,
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
  };
};