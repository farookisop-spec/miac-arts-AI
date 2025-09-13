# Arts Festival Chatbot

A modern, responsive chatbot application designed specifically for college arts festivals. Built with React, TypeScript, and integrated with OpenRouter API for intelligent responses.

## Features

### Core Functionality
- **Real-time messaging** with AI-powered responses
- **Festival-specific knowledge base** covering events, venues, artists, and logistics
- **Interactive elements** including like/dislike buttons and rating system
- **Quick reply buttons** for common queries
- **File sharing capability** with support for images and documents

### Advanced Features
- **Chat history management** with search functionality
- **Export conversations** to JSON format
- **Share conversations** via native sharing API
- **Accessibility compliant** with ARIA labels and keyboard navigation
- **Responsive design** optimized for all device sizes
- **Real-time typing indicators** and loading states

### Festival Information Covered
- Event schedules and timings
- Venue locations and directions
- Artist and performer details
- Workshop registration
- Ticket booking information
- Food courts and vendor info
- Emergency contacts and safety information
- Campus maps and parking

## Setup Instructions

### 1. Environment Configuration

Create a `.env` file in the root directory with your OpenRouter API key:

```env
VITE_OPENROUTER_API_KEY=your_openrouter_api_key_here
VITE_OPENROUTER_MODEL=anthropic/claude-3-haiku
```

### 2. Get OpenRouter API Key

1. Visit [OpenRouter](https://openrouter.ai/)
2. Sign up for an account
3. Navigate to the API Keys section
4. Generate a new API key
5. Add the key to your `.env` file

### 3. Install Dependencies

The required dependencies are already configured in the project. The chatbot uses:

- **@headlessui/react** - For accessible UI components
- **date-fns** - For date formatting
- **uuid** - For unique message IDs
- **lucide-react** - For modern icons
- **@supabase/supabase-js** - Already included for potential future enhancements

### 4. Available Models

You can use any model available on OpenRouter. Popular options include:

- `anthropic/claude-3-haiku` (fast, cost-effective)
- `anthropic/claude-3-sonnet` (balanced performance)
- `openai/gpt-4o-mini` (OpenAI's efficient model)
- `meta-llama/llama-3.1-8b-instruct` (open-source alternative)

## Usage

### Starting the Application

The development server should start automatically. If not, run:

```bash
npm run dev
```

### Using the Chatbot

1. **Send messages** by typing in the input field and pressing Enter
2. **Use quick replies** for common questions about the festival
3. **Rate responses** using the star rating system
4. **Like/dislike messages** to provide feedback
5. **Upload files** using the paperclip icon
6. **Export conversations** via the menu in the header
7. **Share conversations** using the native sharing feature

### Keyboard Shortcuts

- **Enter** - Send message
- **Shift + Enter** - New line in message
- **Tab** - Navigate between interactive elements

## Architecture

### File Structure

```
src/
├── components/           # React components
│   ├── ChatHeader.tsx   # Header with menu and controls
│   ├── MessageBubble.tsx # Individual message display
│   ├── TypingIndicator.tsx # Loading animation
│   ├── ChatInput.tsx    # Message input with file upload
│   ├── QuickReplies.tsx # Preset question buttons
│   └── ErrorMessage.tsx # Error handling display
├── hooks/
│   └── useChat.ts       # Custom hook for chat logic
├── services/
│   └── openrouter.ts    # API integration service
├── types/
│   └── chat.ts          # TypeScript interfaces
└── App.tsx              # Main application component
```

### Key Components

- **useChat Hook**: Manages chat state, API calls, and user interactions
- **OpenRouterService**: Handles API communication with proper error handling
- **MessageBubble**: Displays messages with interactive elements
- **ChatInput**: Handles user input with file upload and voice recording UI

## Customization

### Modifying the AI Assistant

Edit the system prompt in `src/services/openrouter.ts` to customize the chatbot's knowledge base and behavior:

```typescript
const systemPrompt = `You are ArtBot, a helpful assistant for the Annual College Arts Festival...`;
```

### Adding New Quick Replies

Update the `quickReplies` array in `src/components/QuickReplies.tsx`:

```typescript
const quickReplies: QuickReply[] = [
  { id: 'new', text: 'Your new quick reply', category: 'custom' }
];
```

### Styling

The application uses Tailwind CSS with a modern gradient design. Key color schemes:

- **Primary**: Blue to purple gradients
- **Secondary**: Purple to pink gradients
- **Accents**: Green for positive actions, red for negative actions
- **Backgrounds**: Subtle blue-to-purple gradient overlay

## Error Handling

The application includes comprehensive error handling:

- **API errors** are displayed with retry options
- **Network issues** show user-friendly messages
- **Invalid inputs** are prevented at the UI level
- **Missing configuration** shows setup instructions

## Accessibility Features

- **ARIA labels** for all interactive elements
- **Keyboard navigation** support throughout
- **High contrast** color ratios for readability
- **Screen reader compatibility** with proper semantic markup
- **Focus management** for improved navigation

## Performance Optimizations

- **Lazy loading** for large chat histories
- **Debounced API calls** to prevent spam
- **Efficient re-renders** with React.memo and useCallback
- **Optimized bundle size** with modern build tools

## Production Deployment

For production deployment:

1. Build the application: `npm run build`
2. Deploy the `dist` folder to your hosting provider
3. Ensure environment variables are set on the server
4. Configure HTTPS for security (required for some features)

## Browser Support

- **Modern browsers** (Chrome, Firefox, Safari, Edge)
- **Mobile browsers** with responsive design
- **Progressive Web App** capabilities ready for enhancement

## Contributing

This is a production-ready template that can be extended with additional features such as:

- Voice recording and transcription
- Multi-language support
- Advanced file processing
- Integration with festival management systems
- Push notifications for event updates

## License

This project is designed as a comprehensive solution for educational institutions hosting arts festivals. Feel free to customize and extend based on your specific requirements.