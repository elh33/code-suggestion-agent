'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Copy, Check, Code } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

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

  // Handle sending a message
  const handleSendMessage = async () => {
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
      // Simulate AI response - in a real app, this would call your API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Generate a response based on the user's input
      let aiResponse = generateMockResponse(input, currentCode);

      // Extract code blocks from response
      const codeBlocks = extractCodeBlocks(aiResponse);

      // Add AI response
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: aiResponse,
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
  };

  // Mock response generator
  const generateMockResponse = (prompt: string, code: string): string => {
    const promptLower = prompt.toLowerCase();

    // Simple pattern matching for common questions
    if (promptLower.includes('hello') || promptLower.includes('hi')) {
      return 'Hello! How can I assist you with your Python code today?';
    }

    if (promptLower.includes('optimize') || promptLower.includes('improve')) {
      return `I can suggest some optimizations for your code:

\`\`\`python
# Optimized version of your code
def calculate_sum(numbers):
    """Calculate the sum of a list of numbers more efficiently."""
    return sum(numbers)  # Using built-in sum() is more efficient

def main():
    hello()
    
    # Example calculation with list comprehension
    numbers = [i for i in range(1, 6)]
    result = calculate_sum(numbers)
    print(f"The sum of {numbers} is {result}")
    
    # Additional optimization
    print("Program completed successfully!")

if __name__ == "__main__":
    main()
\`\`\`

This version:
1. Uses list comprehension for creating the numbers list
2. Keeps the efficient sum() function
3. Maintains the same functionality`;
    }

    if (promptLower.includes('explain') || promptLower.includes('how does')) {
      return `Let me explain your Python code:

The code defines three functions:

1. \`hello()\`: A simple function that prints a greeting message.

2. \`calculate_sum(numbers)\`: A function that takes a list of numbers and returns their sum using Python's built-in \`sum()\` function.

3. \`main()\`: The main function that:
   - Calls \`hello()\` to print a greeting
   - Creates a list of numbers [1, 2, 3, 4, 5]
   - Calculates their sum using \`calculate_sum()\`
   - Prints the result
   - Prints a completion message

The \`if __name__ == "__main__":\` statement ensures that the \`main()\` function is only executed when the script is run directly, not when it's imported as a module.`;
    }

    if (
      promptLower.includes('bug') ||
      promptLower.includes('error') ||
      promptLower.includes('fix')
    ) {
      return `I don't see any obvious bugs in your code, but here are some potential improvements for robustness:

\`\`\`python
def calculate_sum(numbers):
    """Calculate the sum of a list of numbers."""
    if not numbers:
        return 0  # Handle empty list case
    return sum(numbers)

def main():
    """Main function that runs when the script is executed."""
    hello()
    
    try:
        # Example calculation
        numbers = [1, 2, 3, 4, 5]
        result = calculate_sum(numbers)
        print(f"The sum of {numbers} is {result}")
    except Exception as e:
        print(f"An error occurred: {e}")
    
    print("Program completed successfully!")
\`\`\`

The changes:
1. Added a check for empty lists in calculate_sum()
2. Added error handling with try/except
3. This makes the code more robust against potential errors`;
    }

    if (promptLower.includes('test') || promptLower.includes('unittest')) {
      return `Here's how you can add unit tests for your code:

\`\`\`python
import unittest

# Your existing code here
def hello():
    """Print a greeting message."""
    print("Hello, Python world!")

def calculate_sum(numbers):
    """Calculate the sum of a list of numbers."""
    return sum(numbers)

# Unit tests
class TestFunctions(unittest.TestCase):
    def test_calculate_sum(self):
        """Test the calculate_sum function."""
        self.assertEqual(calculate_sum([1, 2, 3, 4, 5]), 15)
        self.assertEqual(calculate_sum([]), 0)
        self.assertEqual(calculate_sum([-1, 1]), 0)
    
    # You can add more test methods here

if __name__ == "__main__":
    # Run the tests
    unittest.main()
\`\`\`

To use this:
1. Save this as test_main.py
2. Run it with \`python test_main.py\`
3. It will test your calculate_sum function with different inputs`;
    }

    // Default response for other questions
    return `I've analyzed your Python code. Your code looks well-structured with functions for specific tasks. 

Is there anything specific you'd like me to help with? I can:
- Explain how parts of your code work
- Suggest optimizations
- Help fix bugs
- Create unit tests
- Add features

Just let me know what you need!`;
  };

  // Handle pressing Enter to send message
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

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
  const handleCopyCode = (code: string, messageId: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeId(`${messageId}-${code.substring(0, 10)}`);

    setTimeout(() => {
      setCopiedCodeId(null);
    }, 2000);
  };

  // Handle inserting code into editor
  const handleInsertCode = (code: string) => {
    if (onInsertCode) {
      onInsertCode(code);
    }
  };

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
