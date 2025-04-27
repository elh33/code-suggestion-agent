'use client';

import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import MonacoEditor from './monaco-editor';
import { CodeSuggestion } from './suggestion-types';
import SkeletonLoader from './skeleton-loader';
import OptimizationSelector from './optimization-selector';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Code, Settings, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Dynamically import Monaco Editor
const DynamicMonacoEditor = dynamic(() => import('./monaco-editor'), {
  ssr: false,
  loading: () => <SkeletonLoader height="100%" />,
});

interface MonacoIntegrationProps {
  initialValue?: string;
  language?: string;
  onCodeChange?: (code: string) => void;
  onSuggestionsChange?: (suggestions: CodeSuggestion[]) => void;
  onRequestAIHelp?: (code: string, selection?: string) => Promise<string>;
  onExecuteCode?: (code: string) => Promise<string>; // New prop for code execution
  height?: string;
  onChange: (value: string) => void;
  width?: string;
  readOnly?: boolean;
  performAnalysis?: boolean;
}

export default function MonacoIntegration({
  initialValue = '# Write your Python code here\n\nprint("Hello, world!")',
  language = 'python', // Default to Python
  onCodeChange,
  onSuggestionsChange,
  onRequestAIHelp,
  onExecuteCode, // New prop
  height = '100%',
  width = '100%',
  readOnly = false,
  performAnalysis = true,
}: MonacoIntegrationProps) {
  // State for code and suggestions
  const [code, setCode] = useState(initialValue);
  const [suggestions, setSuggestions] = useState<CodeSuggestion[]>([]);
  const [optimizationTypes, setOptimizationTypes] = useState<string[]>([
    'performance',
    'bugfix',
  ]);
  // New states for code execution
  const [codeOutput, setCodeOutput] = useState<string>('');
  const [isExecuting, setIsExecuting] = useState<boolean>(false);

  // Handle code changes
  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    if (onCodeChange) {
      onCodeChange(newCode);
    }
  };

  // Handle internal suggestion changes from Monaco Editor
  const handleSuggestionsChange = (newSuggestions: CodeSuggestion[]) => {
    setSuggestions(newSuggestions);

    // Notify parent component if needed
    if (onSuggestionsChange) {
      onSuggestionsChange(newSuggestions);
    }
  };

  // Handle optimization type changes
  const handleOptimizationTypesChange = (types: string[]) => {
    setOptimizationTypes(types);
  };

  // New handler for executing code
  const handleExecuteCode = async () => {
    setIsExecuting(true);
    setCodeOutput('Running code...');

    try {
      if (onExecuteCode) {
        const output = await onExecuteCode(code);
        setCodeOutput(output);
      } else {
        // Fallback if no execution handler provided
        setCodeOutput('Code execution handler not configured.');
      }
    } catch (error) {
      setCodeOutput(
        `Error: ${error instanceof Error ? error.message : String(error)}`
      );
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full">
      <div
        className="monaco-integration-container flex flex-1 w-full overflow-hidden relative"
        style={{ height: '70%', width }}
      >
        {/* Main editor */}
        <div className="flex-grow overflow-hidden">
          <DynamicMonacoEditor
            value={code}
            language="python" // Force Python language
            onChange={handleCodeChange}
            onSuggestionsChange={handleSuggestionsChange}
            optimizationTypes={optimizationTypes}
            options={{
              readOnly,
              minimap: { enabled: true },
              scrollBeyondLastLine: false,
              fontFamily:
                "JetBrains Mono, Menlo, Monaco, 'Courier New', monospace",
              fontSize: 14,
              lineNumbers: 'on',
              wordWrap: 'on',
              glyphMargin: true,
            }}
          />
        </div>

        {/* Settings panel on the right */}
        <div className="w-64 border-l border-gray-800 bg-[#0a0a12] overflow-hidden shrink-0">
          <Tabs defaultValue="editor" className="w-full h-full">
            <TabsList className="grid grid-cols-3 h-10 bg-[#0a0a12] border-b border-gray-800">
              <TabsTrigger
                value="editor"
                className="flex items-center justify-center"
              >
                <Code className="w-4 h-4 mr-2" />
                Editor
              </TabsTrigger>
              <TabsTrigger
                value="optimization"
                className="flex items-center justify-center"
              >
                <Settings className="w-4 h-4 mr-2" />
                Optimize
              </TabsTrigger>
              <TabsTrigger
                value="execute"
                className="flex items-center justify-center"
              >
                <Play className="w-4 h-4 mr-2" />
                Run
              </TabsTrigger>
            </TabsList>
            <TabsContent
              value="editor"
              className="p-4 h-[calc(100%-2.5rem)] overflow-y-auto"
            >
              <div className="text-sm">
                <h3 className="font-medium mb-2">Python Editor</h3>
                <p className="text-gray-400 mb-4 text-xs">
                  Write and edit Python code.
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">
                      Language
                    </label>
                    <div className="text-sm font-medium">Python</div>
                  </div>

                  <div>
                    <label className="text-xs text-gray-400 block mb-1">
                      File Size
                    </label>
                    <div className="text-sm font-medium">
                      {code.length} characters
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent
              value="optimization"
              className="p-4 h-[calc(100%-2.5rem)] overflow-y-auto"
            >
              <OptimizationSelector
                selectedTypes={optimizationTypes}
                onChange={handleOptimizationTypesChange}
                currentCode={code}
                onSuggestionsReceived={(newSuggestions) => {
                  // Combine with existing suggestions
                  const combinedSuggestions = [...suggestions];

                  // Add only unique suggestions
                  newSuggestions.forEach((suggestion) => {
                    const isDuplicate = combinedSuggestions.some(
                      (existing) =>
                        existing.id === suggestion.id ||
                        (existing.lineNumber === suggestion.lineNumber &&
                          existing.type === suggestion.type)
                    );

                    if (!isDuplicate) {
                      combinedSuggestions.push(suggestion);
                    }
                  });

                  handleSuggestionsChange(combinedSuggestions);
                }}
              />
            </TabsContent>
            {/* New Tab Content for Code Execution */}
            <TabsContent
              value="execute"
              className="p-4 h-[calc(100%-2.5rem)] overflow-y-auto"
            >
              <div className="text-sm">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium">Run Python Code</h3>
                  <Button
                    size="sm"
                    onClick={handleExecuteCode}
                    disabled={isExecuting}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    {isExecuting ? 'Running...' : 'Execute Code'}
                  </Button>
                </div>

                <p className="text-gray-400 mb-4 text-xs">
                  Execute your Python code and see the output below.
                </p>

                <div className="mt-4">
                  <h4 className="text-xs text-gray-400 mb-2">
                    Python Features
                  </h4>
                  <ul className="text-xs text-gray-300 list-disc list-inside space-y-1">
                    <li>Standard library modules available</li>
                    <li>Basic Python operations supported</li>
                    <li>Security restrictions apply</li>
                  </ul>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Output Panel (New) */}
      <div className="h-[30%] border-t border-gray-800 bg-[#0a0a12] p-4 overflow-auto">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium">Output</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCodeOutput('')}
            className="h-6 text-xs"
          >
            Clear
          </Button>
        </div>
        <div className="bg-black/50 rounded p-3 h-[calc(100%-30px)] overflow-auto font-mono text-xs whitespace-pre">
          {codeOutput || 'Run your code to see output here.'}
        </div>
      </div>
    </div>
  );
}
