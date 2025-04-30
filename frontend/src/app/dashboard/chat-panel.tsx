'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { MessageSquare, Send, Copy, Check, Code } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import websocketService from '../../services/webSocketService';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  codeBlocks?: string[];
}

interface ChatPanelProps {
  currentCode: string;
  onInsertCode?: (code: string) => void;
}

export default function ChatPanel({
  currentCode,
  onInsertCode,
}: ChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        "Hello! I'm your AI coding assistant. I can help with Python code suggestions, explanations, or improvements. What would you like help with today?",
      timestamp: new Date(),
    },
  ]);

  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle sending a message using the WebSocket service
  const handleSendMessage = useCallback(async () => {
    if (!input.trim() || isProcessing) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsProcessing(true);

    try {
      
      const suggestResult = await websocketService.processSingleChunk(
        currentCode,
        'completion', // using the completion type as in your buttons
        input // Using the user's input as the context/prompt
      );

      // Extract the response from the result
      let aiResponseText = '';

      if (suggestResult && suggestResult.length > 0) {
        // Use the replacement field from the first suggestion as the response
        aiResponseText =
          suggestResult[0].replacement ||
          suggestResult[0].description ||
          "I've analyzed your code but don't have a specific suggestion.";
      } else {
        aiResponseText =
          "I couldn't generate a response based on your request.";
      }

      // Extract code blocks from response
      const codeBlocks = extractCodeBlocks(aiResponseText);

      // Add AI response
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: aiResponseText,
        timestamp: new Date(),
        codeBlocks: codeBlocks.length > 0 ? codeBlocks : undefined,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);

      // Add error message
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content:
          "I'm sorry, I encountered an error processing your request. Please try again.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
      inputRef.current?.focus();
    }
  }, [input, isProcessing, currentCode]);

  // Handle pressing Enter to send message
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    },
    [handleSendMessage]
  );

  // Extract code blocks from markdown
  const extractCodeBlocks = (text: string): string[] => {
    const codeBlockRegex = /```(?:python)?\n([\s\S]*?)```/g;
    const blocks: string[] = [];

    let match;
    while ((match = codeBlockRegex.exec(text)) !== null) {
      blocks.push(match[1].trim());
    }

    return blocks;
  };

  // Handle copying code
  const handleCopyCode = useCallback((code: string, messageId: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeId(`${messageId}-${code.substring(0, 10)}`);

    setTimeout(() => {
      setCopiedCodeId(null);
    }, 2000);
  }, []);

  // Handle inserting code into editor
  const handleInsertCode = useCallback(
    (code: string) => {
      if (onInsertCode) {
        onInsertCode(code);
      }
    },
    [onInsertCode]
  );

  // Convert markdown to JSX
  const renderMessageContent = (content: string) => {
    // Split by code blocks
    const parts = content.split(/(```[\s\S]*?```)/g);

    return (
      <>
        {parts.map((part, i) => {
          if (part.startsWith('```') && part.endsWith('```')) {
            // Code block
            const codeContent = part.slice(3, -3).replace(/^python\n/, '');
            const id = `code-${i}`;

            return (
              <div
                key={id}
                className="my-2 bg-gray-900 rounded-md overflow-hidden"
              >
                <pre className="p-3 text-sm overflow-x-auto">
                  <code>{codeContent}</code>
                </pre>
                <div className="flex border-t border-gray-800 bg-gray-800/30">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1 h-8 text-xs text-gray-400 hover:text-white"
                    onClick={() => handleCopyCode(codeContent, id)}
                  >
                    {copiedCodeId ===
                    `${id}-${codeContent.substring(0, 10)}` ? (
                      <Check className="w-3.5 h-3.5 mr-1.5" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 mr-1.5" />
                    )}
                    {copiedCodeId === `${id}-${codeContent.substring(0, 10)}`
                      ? 'Copied!'
                      : 'Copy'}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1 h-8 text-xs text-indigo-400 hover:text-indigo-300"
                    onClick={() => handleInsertCode(codeContent)}
                  >
                    <Code className="w-3.5 h-3.5 mr-1.5" />
                    Insert into Editor
                  </Button>
                </div>
              </div>
            );
          } else {
            // Regular text - handle basic markdown
            return (
              <p key={i} className="mb-2 whitespace-pre-wrap">
                {part.split('\n').map((line, j) => {
                  // Bold
                  line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                  // Italic
                  line = line.replace(/\*(.*?)\*/g, '<em>$1</em>');

                  // Replace with HTML (safe in this controlled context)
                  return (
                    <span
                      key={j}
                      dangerouslySetInnerHTML={{ __html: line }}
                      className="block"
                    />
                  );
                })}
              </p>
            );
          }
        })}
      </>
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} gap-3`}
          >
            {message.role === 'assistant' && (
              <Avatar className="w-8 h-8 mt-0.5">
                <AvatarFallback className="bg-indigo-600 text-white text-xs">
                  AI
                </AvatarFallback>
              </Avatar>
            )}

            <div
              className={`rounded-lg p-3 max-w-[85%] ${
                message.role === 'user'
                  ? 'bg-indigo-600/20 text-white'
                  : 'bg-gray-800 text-gray-200'
              }`}
            >
              {renderMessageContent(message.content)}
            </div>

            {message.role === 'user' && (
              <Avatar className="w-8 h-8 mt-0.5">
                <AvatarFallback className="bg-gray-700 text-white text-xs">
                  You
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="border-t border-gray-800 p-4">
        <div className="flex items-center gap-2">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask coding questions or request help..."
            className="bg-gray-800/50 border-gray-700"
            disabled={isProcessing}
          />
          <Button
            onClick={handleSendMessage}
            disabled={isProcessing}
            size="icon"
            className="shrink-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        {isProcessing && (
          <p className="text-xs text-gray-400 mt-2">
            Processing your request...
          </p>
        )}
      </div>
    </div>
  );
}
