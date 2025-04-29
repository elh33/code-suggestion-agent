'use client';

import React, { useRef, useEffect, forwardRef, memo } from 'react';
import Editor from '@monaco-editor/react';
import { CodeSuggestion } from './suggestion-types';

// Define editor ref type for external use
export type MonacoEditorRef = {
  createPythonFile: (filename: string) => {
    success: boolean;
    message?: string;
  };
  getCurrentValue: () => string;
};

interface MonacoEditorProps {
  language?: string;
  value: string;
  onChange?: (value: string) => void;
  theme?: string;
  options?: any; // monaco.editor.IStandaloneEditorConstructionOptions
  onSuggestionsChange?: (suggestions: CodeSuggestion[]) => void;
  optimizationTypes?: string[];
  filepath?: string;
  onEditorReady?: (editorAPI: MonacoEditorRef) => void;
  editorRef?: React.MutableRefObject<any>; // Added this line
}

// Python file extension validation
function isPythonFile(filepath: string | undefined): boolean {
  if (!filepath) return false;
  return filepath.toLowerCase().endsWith('.py');
}

// Ensure Python extension on filenames
function ensurePythonExtension(filepath: string | undefined): string {
  if (!filepath) return '';
  if (filepath.toLowerCase().endsWith('.py')) return filepath;
  return `${filepath}.py`;
}

// Validate Python filenames
function validatePythonFilename(filename: string): {
  valid: boolean;
  message?: string;
} {
  if (!filename) {
    return { valid: false, message: 'Filename is required' };
  }

  // Check for invalid characters in filenames
  const invalidChars = /[<>:"/\\|?*\x00-\x1F]/g;
  if (invalidChars.test(filename)) {
    return {
      valid: false,
      message: 'Filename contains invalid characters',
    };
  }

  return { valid: true };
}

// Get Python template based on file type
function getPythonTemplate(filename: string): string {
  // Simple template for new Python files
  return `# ${filename}\n\ndef main():\n    print("Hello, World!")\n\nif __name__ == "__main__":\n    main()\n`;
}

const BaseMonacoEditor = forwardRef(function BaseMonacoEditor(
  {
    language = 'python',
    value,
    onChange,
    theme = 'vs-dark',
    options = {},
    onSuggestionsChange,
    optimizationTypes = ['performance', 'bugfix', 'refactoring', 'completion'],
    filepath,
    onEditorReady,
    editorRef, // Added this prop
  }: MonacoEditorProps,
  ref
) {
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const monacoEditorRef = useRef<any>(null);
  const initializedRef = useRef<boolean>(false);

  // Handle editor mount
  const handleEditorDidMount = (editor: any, monaco: any) => {
    // Store the editor instance for external access
    monacoEditorRef.current = editor;

    // If editorRef is provided, store the editor instance there as well
    if (editorRef) {
      editorRef.current = editor;
    }

    // Rest of your existing editor setup code...

    // Set up your existing functionality

    initializedRef.current = true;
  };

  // Handle editor changes
  const handleEditorChange = (value: string | undefined) => {
    if (onChange && value !== undefined) {
      onChange(value);
    }
  };

  return (
    <div className="h-full w-full" ref={editorContainerRef}>
      <Editor
        height="100%"
        width="100%"
        language={language}
        value={value}
        theme={theme}
        options={options}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
      />
    </div>
  );
});

// Export wrapped component with memo for better performance
export default memo(BaseMonacoEditor, (prevProps, nextProps) => {
  // Only re-render if these props actually change in a significant way
  return (
    prevProps.value === nextProps.value &&
    prevProps.language === nextProps.language &&
    prevProps.theme === nextProps.theme &&
    JSON.stringify(prevProps.options) === JSON.stringify(nextProps.options)
  );
});
