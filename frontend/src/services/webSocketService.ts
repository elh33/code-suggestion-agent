import { CodeSuggestion } from '../app/dashboard/suggestion-types';

// Maximum length for code chunks to send to the AI service
const MAX_CHUNK_LENGTH = 350;

class WebSocketService {
  private ws: WebSocket | null = null;
  private pendingRequests: Map<string, (suggestion: any) => void> = new Map();
  private isConnected: boolean = false;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectTimeout: number = 1000;
  private url: string;

  constructor(url: string = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8001') {
    this.url = url;
    this.connect();
  }

// Add this method to your existing WebSocketService class

/**
 * Generate AI response for chat
 */
async generateAIResponse(
  prompt: string,
  context: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!this.isConnectedToServer()) {
      this.connect();
      reject(new Error('Not connected to AI server. Please try again in a moment.'));
      return;
    }

    const requestId = `chat-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    
    // Set a timeout for the request
    const timeout = setTimeout(() => {
      this.pendingRequests.delete(requestId);
      reject(new Error('Request timed out'));
    }, 30000);
    
    // Register callback for this request
    this.pendingRequests.set(requestId, (response) => {
      clearTimeout(timeout);
      
      if (response.status === 'success') {
        resolve(response.message || response.suggestion || 'No response generated.');
      } else {
        reject(new Error(response.message || 'Failed to generate response'));
      }
    });

    // Send request to the server
    this.ws!.send(JSON.stringify({
      id: requestId,
      action: "completion",
      prompt: prompt,
      context: context
    }));
  });
}


  /**
   * Connect to the WebSocket server
   */
  private connect() {
    console.log('Attempting to connect to suggestion server...');
    if (this.ws) {
      this.ws.close();
    }

    try {
      this.ws = new WebSocket(this.url);

      this.ws.onopen = () => {
        console.log('Connected to AI suggestion server');
        this.isConnected = true;
        this.reconnectAttempts = 0;
      };

      this.ws.onmessage = (event) => {
        try {
          const response = JSON.parse(event.data);
          console.log('Received response:', response);
          
          // Processing acknowledgment
          if (response.status === 'processing') {
            console.log(`Processing request ${response.id}...`);
            return;
          }
          
          // Handle final response
          const callback = this.pendingRequests.get(response.id);
          if (callback) {
            callback(response);
            this.pendingRequests.delete(response.id);
          } else {
            console.warn('Received response for unknown request:', response);
          }
        } catch (err) {
          console.error('Error parsing WebSocket message:', err);
        }
      };

      this.ws.onclose = () => {
        console.log('Disconnected from suggestion server');
        this.isConnected = false;
        
        // Attempt to reconnect
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
          this.reconnectAttempts++;
          const delay = this.reconnectTimeout * this.reconnectAttempts;
          console.log(`Reconnecting in ${delay}ms...`);
          setTimeout(() => this.connect(), delay);
        } else {
          console.error('Max reconnection attempts reached.');
        }
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    } catch (error) {
      console.error('Error establishing WebSocket connection:', error);
    }
  }

  /**
   * Check if connected to the WebSocket server
   */
  isConnectedToServer(): boolean {
    return this.isConnected && this.ws?.readyState === WebSocket.OPEN;
  }

  /**
   * Maps frontend button types to backend expected types
   * This is the key function to match button clicks to test_ws.py expectations
   */
  private mapOptimizationType(frontendType: string): string {
    // Map frontend optimization types to what the backend expects
    switch (frontendType.toLowerCase()) {
      case 'performance':
        return 'optimization'; // Backend expects "optimization" for performance button
      case 'bugfix':
        return 'bug_fix'; // Backend expects "bug_fix" for bugfix button
      case 'refactoring':
        return 'refactoring'; // Keep as is
      case 'completion':
        return 'completion'; // Keep as is
      default:
        return frontendType;
    }
  }

  /**
   * Generate fallback suggestions when the LLM fails
   */
  private generateFallbackSuggestions(code: string, type: string): CodeSuggestion[] {
    // If server fails, provide some basic suggestions
    const lines = code.split('\n');
    const suggestions: CodeSuggestion[] = [];
    
    // Create a single fallback suggestion based on type
    const fallbackSuggestion: CodeSuggestion = {
      id: `fallback-${type}-${Date.now()}`,
      type: this.mapToFrontendType(type),
      lineNumber: 1,
      code: lines[0] || code.substring(0, 50),
      replacement: `# Improved ${type} version would go here`,
      description: `The AI couldn't process your code completely. Consider simplifying or breaking down your code for better ${type} suggestions.`,
      severity: 'info'
    };
    
    return [fallbackSuggestion];
  }

  /**
   * Maps backend types back to frontend types for consistency
   */
  private mapToFrontendType(backendType: string): any {
    switch (backendType.toLowerCase()) {
      case 'optimization':
        return 'optimization';
      case 'bug_fix':
        return 'bugfix';
      case 'refactoring':
        return 'refactoring';
      case 'completion':
        return 'completion';
      default:
        return backendType;
    }
  }

  /**
   * Split code into manageable chunks
   */
  private splitCodeIntoChunks(code: string): string[] {
    if (code.length <= MAX_CHUNK_LENGTH) {
      return [code];
    }

    // Try to split intelligently at function boundaries
    const chunks: string[] = [];
    const lines = code.split('\n');
    let currentChunk: string[] = [];
    let currentLength = 0;
    
    const isCodeBoundary = (line: string): boolean => {
      // Check for function or class definitions, which are good places to split
      return /^\s*(def|class|function|export|import|from|if __name__|#)/.test(line);
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const lineLength = line.length + 1; // +1 for newline
      
      if (currentLength + lineLength > MAX_CHUNK_LENGTH && currentChunk.length > 0) {
        // Before creating a chunk, check if we're in the middle of a function
        // If next line is not a boundary and we're close to the limit, look ahead
        // for a better split point
        if (!isCodeBoundary(line) && currentLength > MAX_CHUNK_LENGTH * 0.7) {
          let j = i;
          const lookAheadLimit = 10; // Don't look too far ahead
          
          while (j < i + lookAheadLimit && j < lines.length) {
            if (isCodeBoundary(lines[j])) {
              // Found a better split point
              break;
            }
            j++;
          }
          
          // If we found a better split within reasonable distance, use it
          if (j < i + lookAheadLimit && j < lines.length && isCodeBoundary(lines[j])) {
            // Add all lines up to (but not including) the boundary
            for (let k = i; k < j; k++) {
              currentChunk.push(lines[k]);
              currentLength += lines[k].length + 1;
            }
            chunks.push(currentChunk.join('\n'));
            currentChunk = [];
            currentLength = 0;
            i = j - 1; // -1 because the loop will increment i
            continue;
          }
        }
        
        // If we didn't find a better split point or we're at a good place already
        chunks.push(currentChunk.join('\n'));
        currentChunk = [line];
        currentLength = lineLength;
      } else {
        currentChunk.push(line);
        currentLength += lineLength;
      }
    }
    
    // Add the last chunk if it's not empty
    if (currentChunk.length > 0) {
      chunks.push(currentChunk.join('\n'));
    }
    
    return chunks;
  }

  /**
   * Request suggestions from the AI model
   */
  async requestSuggestion(
    code: string,
    type: string
  ): Promise<CodeSuggestion[]> {
    if (!this.isConnectedToServer()) {
      console.warn('Not connected to AI server. Attempting to reconnect...');
      this.connect();
      return this.generateFallbackSuggestions(code, type);
    }

    try {
      // Map the frontend type to what the backend expects
      const backendType = this.mapOptimizationType(type);
      console.log(`Mapped frontend type '${type}' to backend type '${backendType}'`);

      const chunks = this.splitCodeIntoChunks(code);
      console.log(`Split code into ${chunks.length} chunks for processing`);

      // For smaller context window models, only process a subset of chunks
      const maxChunksToProcess = Math.min(10, chunks.length);
      const chunksToProcess = chunks.slice(0, maxChunksToProcess);
      
      if (chunks.length > maxChunksToProcess) {
        console.log(`Processing only first ${maxChunksToProcess} chunks due to context limitations`);
      }

      // If there's only one chunk, process it directly
      if (chunksToProcess.length === 1) {
        return await this.processSingleChunk(chunksToProcess[0], backendType);
      }

      // Otherwise, process all chunks and combine results
      const allSuggestions: CodeSuggestion[] = [];
      let lineOffset = 0;

      for (let i = 0; i < chunksToProcess.length; i++) {
        const chunk = chunksToProcess[i];
        console.log(`Processing chunk ${i+1}/${chunksToProcess.length} (${chunk.length} characters)`);
        
        // The context lets the AI know this is part of a larger file
        const context = chunksToProcess.length > 1 
          ? `This is chunk ${i+1} of ${chunksToProcess.length} from a larger file. Focus on this specific section.`
          : undefined;

        try {
          const chunkSuggestions = await this.processSingleChunk(chunk, backendType, context);
          
          // Adjust line numbers based on position in the file
          const adjustedSuggestions = chunkSuggestions.map(suggestion => ({
            ...suggestion,
            // Ensure the suggestion type matches our frontend expected types
            type: this.mapToFrontendType(suggestion.type),
            lineNumber: suggestion.lineNumber + lineOffset
          }));
          
          allSuggestions.push(...adjustedSuggestions);
        } catch (error) {
          console.error(`Error processing chunk ${i+1}:`, error);
        }
        
        // Update line offset for next chunk's line number calculations
        if (i < chunksToProcess.length - 1) {
          lineOffset += chunk.split('\n').length;
        }
      }

      if (allSuggestions.length === 0) {
        // If no suggestions were returned, generate a fallback
        return this.generateFallbackSuggestions(code, backendType);
      }

      return allSuggestions;
    } catch (error) {
      console.error('Error in requestSuggestion:', error);
      return this.generateFallbackSuggestions(code, type);
    }
  }

  /**
   * Count number of lines in a string
   */
  private getLineCount(text: string): number {
    return text.split('\n').length - 1; // -1 because we want line offset
  }

  /**
   * Process a single chunk of code
   */
  public async processSingleChunk(
    code: string, 
    type: string,
    context?: string
  ): Promise<CodeSuggestion[]> {
    return new Promise((resolve, reject) => {
      if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
        reject(new Error('WebSocket not connected'));
        return;
      }

      const requestId = `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Set timeout for this request (10 seconds)
      const timeout = setTimeout(() => {
        console.log(`Request ${requestId} timed out`);
        this.pendingRequests.delete(requestId);
        reject(new Error('Request timed out'));
      }, 90000);
      
      // Store callback to handle the response
      this.pendingRequests.set(requestId, (response) => {
        clearTimeout(timeout);
        
        if (response.status === 'success') {
          // Format test client response to match our app's expectations
          if (response.type === 'optimization_response' && response.suggestions) {
            resolve(response.suggestions.map((s: any) => ({
              ...s,
              // Ensure consistency with frontend types
              type: this.mapToFrontendType(s.type || type)
            })));
          } else if (response.suggestions) {
            // Handle array of suggestions directly
            resolve(response.suggestions.map((s: any) => ({
              ...s,
              type: this.mapToFrontendType(s.type || type)
            })));
          } else if (response.suggestion) {
            // Convert text suggestion to CodeSuggestion format
            const lines = code.split('\n');
            const suggestion: CodeSuggestion = {
              id: `ai-${Date.now()}`,
              type: this.mapToFrontendType(type),
              lineNumber: 1, // Default to first line
              code: lines[0] || code.substring(0, 50),
              replacement: response.suggestion,
              description: `AI-generated ${type} suggestion`,
              severity: 'info'
            };
            resolve([suggestion]);
          } else {
            resolve([]);
          }
        } else {
          reject(new Error(response.message || 'Failed to get suggestions'));
        }
      });

      // Use a simpler message format that matches test_ws.py expectations
      this.ws.send(JSON.stringify({
        id: requestId,
        action: "suggest",
        type: type,
        code: code,
        context: context || `Provide ${type} suggestions for this Python code`
      }));

      console.log(`Sent ${type} request with ${code.length} characters (Request ID: ${requestId})`);
    });
  }
}

// Create a singleton instance
const websocketService = new WebSocketService();
export default websocketService;