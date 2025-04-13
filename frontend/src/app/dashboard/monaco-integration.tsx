'use client';

import { useRef, useEffect, useState, useCallback, memo } from 'react';
import dynamic from 'next/dynamic';
import type { CodeSuggestion } from './suggestion-types';

// Dynamically import Monaco Editor to avoid SSR issues
const MonacoEditor = dynamic(() => import('./monaco-editor'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-[#0a0a12]">
      <div className="text-gray-400">Loading editor...</div>
    </div>
  ),
});

// Interface for the component props
interface MonacoIntegrationProps {
  initialValue: string;
  language?: string;
  onChange?: (value: string) => void;
  onSuggestionsChange?: (suggestions: CodeSuggestion[]) => void;
}

function BaseMonacoIntegration({
  initialValue,
  language = 'javascript',
  onChange,
  onSuggestionsChange,
}: MonacoIntegrationProps) {
  // Use refs to store values without causing re-renders
  const editorValueRef = useRef(initialValue);
  const onChangeRef = useRef(onChange);
  const languageRef = useRef(language);
  const onSuggestionsChangeRef = useRef(onSuggestionsChange);

  // Track editor state for optimization
  const lastUpdateTimeRef = useRef(Date.now());
  const typingBufferRef = useRef<string[]>([]);

  // This key is only changed when we need to remount the editor
  const [editorKey, setEditorKey] = useState(`editor-${Date.now()}`);

  // If initial content is very different, we set a new key
  useEffect(() => {
    // Only remount editor for major content changes
    if (
      initialValue !== editorValueRef.current &&
      (Math.abs(initialValue.length - editorValueRef.current.length) > 100 ||
        initialValue === '' ||
        editorValueRef.current === '')
    ) {
      editorValueRef.current = initialValue;
      setEditorKey(`editor-${Date.now()}`);
    } else {
      editorValueRef.current = initialValue;
    }
  }, [initialValue]);

  // Update refs when props change without re-rendering
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    languageRef.current = language;
  }, [language]);

  useEffect(() => {
    onSuggestionsChangeRef.current = onSuggestionsChange;
  }, [onSuggestionsChange]);

  // Add event listener for showing a suggestion in the panel
  useEffect(() => {
    const handleShowSuggestionInPanel = (event: CustomEvent) => {
      const suggestionId = event.detail?.suggestionId;
      if (suggestionId && onSuggestionsChangeRef.current) {
        // Find the suggestion and highlight it in the panel
        const suggestion = suggestionsRef.current?.find(
          (s) => s.id === suggestionId
        );
        if (suggestion) {
          // Create a custom event to focus on this suggestion in the panel
          const focusEvent = new CustomEvent('focusSuggestion', {
            detail: { suggestion },
          });
          window.dispatchEvent(focusEvent);
        }
      }
    };

    // Add event listener
    window.addEventListener(
      'showSuggestionInPanel',
      handleShowSuggestionInPanel as EventListener
    );

    // Clean up
    return () => {
      window.removeEventListener(
        'showSuggestionInPanel',
        handleShowSuggestionInPanel as EventListener
      );
    };
  }, []);

  // Use memoized handler to prevent creating new function on every render
  const handleEditorChange = useCallback((value: string) => {
    const now = Date.now();
    const timeSinceLastUpdate = now - lastUpdateTimeRef.current;

    // Update internal value immediately
    editorValueRef.current = value;

    // Store change time
    lastUpdateTimeRef.current = now;

    // Notify parent component with change
    if (onChangeRef.current) {
      onChangeRef.current(value);
    }
  }, []);

  // Handle suggestions change
  const handleSuggestionsChange = useCallback(
    (suggestions: CodeSuggestion[]) => {
      if (onSuggestionsChangeRef.current) {
        onSuggestionsChangeRef.current(suggestions);
      }
    },
    []
  );

  const suggestionsRef = useRef<CodeSuggestion[] | undefined>([]);

  useEffect(() => {
    suggestionsRef.current = []; // Reset suggestions when component mounts/updates
  }, []);

  return (
    <div className="h-full w-full">
      <MonacoEditor
        key={editorKey}
        value={editorValueRef.current}
        language={languageRef.current}
        onChange={handleEditorChange}
        onSuggestionsChange={handleSuggestionsChange}
      />
    </div>
  );
}

// Memoize the entire component for improved performance
export default memo(BaseMonacoIntegration);
