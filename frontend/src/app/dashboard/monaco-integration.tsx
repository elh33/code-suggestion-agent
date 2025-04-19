'use client';

import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import MonacoEditor from './monaco-editor';
import { CodeSuggestion } from './suggestion-types';
import SkeletonLoader from './skeleton-loader';
import OptimizationSelector from './optimization-selector';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Code, Settings } from 'lucide-react';

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
  height?: string;
  onChange: (value: string) => void;
  width?: string;
  readOnly?: boolean;
  performAnalysis?: boolean;
}

export default function MonacoIntegration({
  initialValue = '',
  language = 'javascript',
  onCodeChange,
  onSuggestionsChange,
  onRequestAIHelp,
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

  return (
    <div
      className="monaco-integration-container flex h-full w-full overflow-hidden relative"
      style={{ height, width }}
    >
      {/* Main editor */}
      <div className="flex-grow overflow-hidden">
        <DynamicMonacoEditor
          value={code}
          language={language}
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
          <TabsList className="grid grid-cols-2 h-10 bg-[#0a0a12] border-b border-gray-800">
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
          </TabsList>

          <TabsContent
            value="editor"
            className="p-4 h-[calc(100%-2.5rem)] overflow-y-auto"
          >
            <div className="text-sm">
              <h3 className="font-medium mb-2">Editor Settings</h3>
              <p className="text-gray-400 mb-4 text-xs">
                Configure editor behavior and appearance.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="text-xs text-gray-400 block mb-1">
                    Language
                  </label>
                  <div className="text-sm font-medium">{language}</div>
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
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
