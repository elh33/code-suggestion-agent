'use client';

import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import MonacoEditor from './monaco-editor';
import { CodeSuggestion } from './suggestion-types';
import SuggestionPanel from './suggestion-panel';
import SkeletonLoader from './skeleton-loader';
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
  const [visibleSuggestions, setVisibleSuggestions] = useState<
    CodeSuggestion[]
  >([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [panelWidth, setPanelWidth] = useState(320);
  const [isResizing, setIsResizing] = useState(false);
  const resizeStartXRef = useRef(0);
  const initialPanelWidthRef = useRef(panelWidth);

  // Function to filter suggestions based on type
  const filterSuggestions = () => {
    // Calculate visible suggestions with emphasis on optimization and bugfix
    const optimizationAndBugfixSuggestions = suggestions.filter(
      (suggestion) =>
        suggestion.type === 'optimization' || suggestion.type === 'bugfix'
    );

    // Set these as top priority in the visible suggestions panel
    setVisibleSuggestions([
      ...optimizationAndBugfixSuggestions,
      ...suggestions.filter(
        (suggestion) =>
          suggestion.type !== 'optimization' && suggestion.type !== 'bugfix'
      ),
    ]);
  };

  // Update visible suggestions when suggestions change
  useEffect(() => {
    filterSuggestions();

    // Notify parent component if needed
    if (onSuggestionsChange) {
      onSuggestionsChange(suggestions);
    }

    // Auto-show suggestions panel if we have optimization or bugfix suggestions
    const hasImportantSuggestions = suggestions.some(
      (suggestion) =>
        suggestion.type === 'optimization' || suggestion.type === 'bugfix'
    );

    if (hasImportantSuggestions && !showSuggestions && performAnalysis) {
      setShowSuggestions(true);
    }
  }, [suggestions, onSuggestionsChange, performAnalysis]);

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
  };

  // Handle panel resize
  const startResize = (e: React.MouseEvent) => {
    setIsResizing(true);
    resizeStartXRef.current = e.clientX;
    initialPanelWidthRef.current = panelWidth;
    document.body.style.cursor = 'col-resize';
    document.addEventListener('mousemove', handleResize);
    document.addEventListener('mouseup', stopResize);
  };

  const handleResize = (e: MouseEvent) => {
    if (isResizing) {
      const deltaX = resizeStartXRef.current - e.clientX;
      const newWidth = Math.min(
        Math.max(initialPanelWidthRef.current + deltaX, 250),
        500
      );
      setPanelWidth(newWidth);
    }
  };

  const stopResize = () => {
    setIsResizing(false);
    document.body.style.cursor = 'default';
    document.removeEventListener('mousemove', handleResize);
    document.removeEventListener('mouseup', stopResize);
  };

  // Handle applying a suggestion
  const handleApplySuggestion = (suggestion: CodeSuggestion) => {
    if (!suggestion.replacement) return;

    // Create a new code with the suggestion applied
    const lines = code.split('\n');
    lines[suggestion.lineNumber - 1] = suggestion.replacement;
    const newCode = lines.join('\n');
    handleCodeChange(newCode);

    // Remove this suggestion from the list
    setSuggestions((prev) => prev.filter((s) => s.id !== suggestion.id));
  };

  // Handle toggling the suggestions panel
  const toggleSuggestionsPanel = () => {
    setShowSuggestions((prev) => !prev);
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

      {/* Toggle button with indicator for optimization/bugfix suggestions */}
      <button
        onClick={toggleSuggestionsPanel}
        className="absolute right-0 top-0 z-10 m-2 p-2 bg-[#1e1e2e] rounded-md shadow-md"
        style={{
          right: showSuggestions ? `${panelWidth + 8}px` : '8px',
        }}
      >
        {suggestions.some(
          (s) => s.type === 'optimization' || s.type === 'bugfix'
        ) ? (
          <span className="inline-flex items-center">
            <span className="animation-pulse text-yellow-400 mr-1">⭐</span>
            {showSuggestions ? 'Hide' : 'Show'} Suggestions
          </span>
        ) : (
          <span>{showSuggestions ? 'Hide' : 'Show'} Suggestions</span>
        )}
      </button>

      {/* Suggestions panel */}
      {showSuggestions && (
        <>
          <div
            className="resize-handle w-1 bg-gray-700 hover:bg-blue-500 cursor-col-resize h-full"
            onMouseDown={startResize}
          ></div>
          <div
            className="suggestions-panel bg-[#0e0d14] overflow-auto"
            style={{ width: `${panelWidth}px` }}
          >
            <SuggestionPanel
              suggestions={visibleSuggestions}
              onApplySuggestion={handleApplySuggestion}
              highlightOptimizationAndBugfix={true}
            />
          </div>
        </>
      )}
    </div>
  );
}
