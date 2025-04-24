'use client';

import { useState } from 'react';
import { Rocket, Bug, RefreshCw, Sparkles, Zap } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface OptimizationOption {
  id: string;
  name: string;
  description: string;
  icon: JSX.Element;
}

interface OptimizationSelectorProps {
  selectedTypes: string[];
  onChange: (types: string[]) => void;
}

export default function OptimizationSelector({
  selectedTypes,
  onChange,
}: OptimizationSelectorProps) {
  const [processingOption, setProcessingOption] = useState<string | null>(null);

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

  const handleOptimizationClick = (optionId: string) => {
    setProcessingOption(optionId);

    console.log(`Requesting ${optionId} analysis from server...`);

    // Simulate a websocket request with a timeout
    setTimeout(() => {
      console.log(`Received ${optionId} analysis results from server!`);

      // The following would be where you handle the websocket response
      console.log({
        type: 'optimization_request',
        optimizationType: optionId,
        timestamp: new Date().toISOString(),
      });

      setProcessingOption(null);
    }, 1500);

    // Here is where you would send the actual websocket message
    // Example:
    // socket.send(JSON.stringify({
    //   type: 'optimization_request',
    //   optimizationType: optionId,
    //   code: editorContent
    // }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium text-sm mb-2">Optimization Settings</h3>
        <p className="text-gray-400 text-xs mb-4">
          Choose which types of optimizations to display in your code editor or
          click to request immediate analysis
        </p>
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
                disabled={processingOption === option.id}
              >
                {processingOption === option.id ? (
                  <>
                    <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-solid border-current border-r-transparent mr-2"></span>
                    Processing...
                  </>
                ) : (
                  <>
                    {option.icon}
                    <span>Run {option.name}</span>
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
