'use client';

import { useState, useEffect } from 'react';
import { Rocket, Bug, RefreshCw, Sparkles, Zap } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import websocketService from '../../services/webSocketService';
import { CodeSuggestion } from './suggestion-types';

interface OptimizationOption {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
}

interface OptimizationSelectorProps {
  selectedTypes: string[];
  onChange: (types: string[]) => void;
  currentCode?: string; // Add current code prop
  onSuggestionsReceived?: (suggestions: CodeSuggestion[]) => void; // Add suggestions callback
}

export default function OptimizationSelector({
  selectedTypes,
  onChange,
  currentCode = '', // Default to empty string
  onSuggestionsReceived,
}: OptimizationSelectorProps) {
  const [processingOption, setProcessingOption] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<
    'connected' | 'disconnected' | 'connecting'
  >('disconnected');

  // Check connection on mount
  useEffect(() => {
    const checkConnection = () => {
      const isConnected = websocketService.isConnectedToServer();
      setConnectionStatus(isConnected ? 'connected' : 'disconnected');
    };

    // Check immediately and then on interval
    checkConnection();
    const interval = setInterval(checkConnection, 5000);

    return () => clearInterval(interval);
  }, []);

  const optimizationOptions: OptimizationOption[] = [
    {
      id: 'performance',
      name: 'Performance Optimization',
      description: 'Find ways to improve the speed and efficiency of your code',
      icon: <Zap className="w-4 h-4 text-green-400" />,
    },
    {
      id: 'bugfix',
      name: 'Bug Detection',
      description: 'Identify and fix potential bugs or errors in your code',
      icon: <Bug className="w-4 h-4 text-red-400" />,
    },
    {
      id: 'refactoring',
      name: 'Code Refactoring',
      description: 'Suggestions to improve code readability and structure',
      icon: <RefreshCw className="w-4 h-4 text-blue-400" />,
    },
    {
      id: 'completion',
      name: 'Code Completion',
      description: 'Suggest ways to complete partially written code',
      icon: <Sparkles className="w-4 h-4 text-purple-400" />,
    },
  ];

  const toggleOptimization = (optionId: string) => {
    if (selectedTypes.includes(optionId)) {
      onChange(selectedTypes.filter((id) => id !== optionId));
    } else {
      onChange([...selectedTypes, optionId]);
    }
  };

  const handleOptimizationClick = async (optionId: string) => {
    // Guard against no code or already processing
    if (!currentCode || processingOption) {
      return;
    }

    setProcessingOption(optionId);

    try {
      console.log(`Requesting ${optionId} analysis from AI...`);

      // Send the request to our WebSocket service
      const suggestions = await websocketService.requestSuggestion(
        currentCode,
        optionId
      );

      // Handle the response
      console.log(`Received ${suggestions.length} suggestions from AI`);

      // Pass suggestions to parent component if callback provided
      if (onSuggestionsReceived && suggestions.length > 0) {
        onSuggestionsReceived(suggestions);

        // Dispatch an event to focus on the first suggestion
        const event = new CustomEvent('focusSuggestion', {
          detail: { suggestion: suggestions[0] },
        });
        window.dispatchEvent(event);
      }
    } catch (error) {
      console.error(`Error during ${optionId} analysis:`, error);
    } finally {
      setProcessingOption(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium text-sm mb-2">Optimization Settings</h3>
        <p className="text-gray-400 text-xs mb-4">
          Choose which types of optimizations to display in your code editor or
          click to request immediate analysis
        </p>
        {connectionStatus !== 'connected' && (
          <div className="p-2 bg-amber-900/30 border border-amber-800/50 rounded-md mb-4">
            <p className="text-amber-300 text-xs flex items-center">
              <span className="inline-block h-2 w-2 rounded-full bg-amber-400 mr-2"></span>
              AI server{' '}
              {connectionStatus === 'connecting'
                ? 'connecting...'
                : 'disconnected'}
            </p>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {optimizationOptions.map((option) => (
          <div
            key={option.id}
            className="flex flex-col border border-gray-800 rounded-md p-3 bg-gray-900/20 transition-all hover:bg-gray-800/20"
          >
            <div className="flex items-start space-x-3">
              <div className="pt-0.5">{option.icon}</div>
              <div className="flex-1 space-y-1 min-w-0">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor={`switch-${option.id}`}
                    className="font-medium text-sm"
                  >
                    {option.name}
                  </Label>
                  <Switch
                    id={`switch-${option.id}`}
                    checked={selectedTypes.includes(option.id)}
                    onCheckedChange={() => toggleOptimization(option.id)}
                  />
                </div>
                <p className="text-gray-400 text-xs">{option.description}</p>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-gray-800/50">
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs h-8"
                onClick={() => handleOptimizationClick(option.id)}
                disabled={
                  processingOption === option.id ||
                  !currentCode ||
                  connectionStatus !== 'connected'
                }
              >
                {processingOption === option.id ? (
                  <>
                    <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-solid border-current border-r-transparent mr-2"></span>
                    Processing...
                  </>
                ) : (
                  <>
                    {option.icon}
                    <span className="ml-1.5">Run {option.name}</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-800 pt-4 mt-6">
        <p className="text-xs text-gray-400">
          Stars will appear next to lines that have potential optimizations
          based on your selections above. Click on a star to see available
          actions.
        </p>
      </div>
    </div>
  );
}
