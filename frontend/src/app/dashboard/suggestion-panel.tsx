'use client';

import { useState, useEffect } from 'react';
import { type CodeSuggestion, getSeverityColor } from './suggestion-types';
import { Button } from '@/components/ui/button';
import { Sparkles, AlertTriangle, Bug, Rocket, RefreshCw } from 'lucide-react';

interface SuggestionPanelProps {
  suggestions: CodeSuggestion[];
  onApplySuggestion: (suggestion: CodeSuggestion) => void;
  onJumpToLine: (lineNumber: number) => void;
}

export default function SuggestionPanel({
  suggestions,
  onApplySuggestion,
  onJumpToLine,
}: SuggestionPanelProps) {
  const [filteredSuggestions, setFilteredSuggestions] =
    useState<CodeSuggestion[]>(suggestions);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  // Add a style element for the highlight effect
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
    @keyframes suggestionHighlight {
      0% { background-color: rgba(99, 102, 241, 0.2); }
      100% { background-color: transparent; }
    }
    .suggestion-highlight {
      animation: suggestionHighlight 2s ease;
    }
  `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Add event listener for focusing on a specific suggestion
  useEffect(() => {
    const handleFocusSuggestion = (event: CustomEvent) => {
      const suggestion = event.detail?.suggestion;
      if (suggestion) {
        // Set active filter to match this suggestion's type
        setActiveFilter(suggestion.type);

        // Scroll to this suggestion (using setTimeout to ensure DOM is updated)
        setTimeout(() => {
          const element = document.getElementById(
            `suggestion-${suggestion.id}`
          );
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            // Add a highlight effect
            element.classList.add('suggestion-highlight');
            setTimeout(() => {
              element.classList.remove('suggestion-highlight');
            }, 2000);
          }
        }, 100);
      }
    };

    // Add event listener
    window.addEventListener(
      'focusSuggestion',
      handleFocusSuggestion as EventListener
    );

    // Clean up
    return () => {
      window.removeEventListener(
        'focusSuggestion',
        handleFocusSuggestion as EventListener
      );
    };
  }, []);

  // Update filtered suggestions when suggestions change
  useEffect(() => {
    if (activeFilter) {
      setFilteredSuggestions(
        suggestions.filter((s) => s.type === activeFilter)
      );
    } else {
      setFilteredSuggestions(suggestions);
    }
  }, [suggestions, activeFilter]);

  // Get icon component for suggestion type
  const getIconComponent = (type: string) => {
    switch (type) {
      case 'completion':
        return <Sparkles className="w-4 h-4" />;
      case 'bugfix':
        return <Bug className="w-4 h-4" />;
      case 'optimization':
        return <Rocket className="w-4 h-4" />;
      case 'refactoring':
        return <RefreshCw className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  // Get count of each suggestion type
  const getCounts = () => {
    const counts: Record<string, number> = {};
    suggestions.forEach((s) => {
      counts[s.type] = (counts[s.type] || 0) + 1;
    });
    return counts;
  };

  const counts = getCounts();

  return (
    <div className="flex flex-col h-full">
      {/* Filter tabs */}
      <div className="flex space-x-1 p-2 border-b border-gray-800">
        <Button
          variant={activeFilter === null ? 'default' : 'outline'}
          size="sm"
          className="text-xs h-7"
          onClick={() => setActiveFilter(null)}
        >
          All ({suggestions.length})
        </Button>
        {Object.entries(counts).map(([type, count]) => (
          <Button
            key={type}
            variant={activeFilter === type ? 'default' : 'outline'}
            size="sm"
            className="text-xs h-7 flex items-center"
            onClick={() => setActiveFilter(type)}
          >
            {getIconComponent(type)}
            <span className="ml-1 capitalize">
              {type} ({count})
            </span>
          </Button>
        ))}
      </div>

      {/* Suggestions list */}
      <div className="flex-1 overflow-y-auto p-2 space-y-3">
        {filteredSuggestions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 text-sm">
            <Sparkles className="w-8 h-8 mb-2 opacity-50" />
            <p>No suggestions available</p>
          </div>
        ) : (
          filteredSuggestions.map((suggestion) => (
            <div
              key={suggestion.id}
              id={`suggestion-${suggestion.id}`}
              className="rounded-lg border border-gray-800 overflow-hidden"
            >
              <div
                className={`px-3 py-2 flex items-center justify-between ${getSeverityColor(suggestion.severity)} bg-gray-800/50`}
              >
                <div className="flex items-center">
                  {getIconComponent(suggestion.type)}
                  <span className="text-sm font-medium ml-2 capitalize">
                    {suggestion.type}
                  </span>
                  <span className="ml-2 text-xs text-gray-400">
                    Line {suggestion.lineNumber}
                  </span>
                </div>
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs hover:bg-gray-700"
                    onClick={() => onJumpToLine(suggestion.lineNumber)}
                  >
                    Go to
                  </Button>
                  {suggestion.replacement && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs text-indigo-400 hover:text-indigo-300 hover:bg-gray-700"
                      onClick={() => onApplySuggestion(suggestion)}
                    >
                      Apply
                    </Button>
                  )}
                </div>
              </div>
              <div className="p-3 bg-gray-900/50">
                <pre className="text-xs text-gray-300 overflow-x-auto whitespace-pre-wrap">
                  {suggestion.code}
                </pre>
              </div>
              <div className="px-3 py-2 text-xs text-gray-400">
                {suggestion.description}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
