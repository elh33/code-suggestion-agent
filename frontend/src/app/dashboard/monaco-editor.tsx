'use client';

import { useRef, useEffect } from 'react';
import * as monaco from 'monaco-editor';

interface MonacoEditorProps {
  language?: string;
  value: string;
  onChange?: (value: string) => void;
  theme?: string;
  options?: monaco.editor.IStandaloneEditorConstructionOptions;
}

export default function MonacoEditor({
  language = 'javascript',
  value,
  onChange,
  theme = 'vs-dark',
  options = {},
}: MonacoEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const monacoEditorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(
    null
  );
  // Track if we're handling an internal change to avoid cursor jumps
  const isInternalChangeRef = useRef(false);

  useEffect(() => {
    if (editorRef.current) {
      // Define custom theme
      monaco.editor.defineTheme('ensaai-dark', {
        base: 'vs-dark',
        inherit: true,
        rules: [
          { token: 'comment', foreground: '6272a4' },
          { token: 'keyword', foreground: 'ff79c6' },
          { token: 'string', foreground: 'f1fa8c' },
          { token: 'number', foreground: 'bd93f9' },
          { token: 'operator', foreground: 'ff79c6' },
        ],
        colors: {
          'editor.background': '#0a0a12',
          'editor.foreground': '#f8f8f2',
          'editorCursor.foreground': '#f8f8f2',
          'editor.lineHighlightBackground': '#1e1e2e',
          'editorLineNumber.foreground': '#6272a4',
          'editor.selectionBackground': '#44475a',
          'editor.inactiveSelectionBackground': '#44475a80',
        },
      });

      // Initialize Monaco Editor
      monacoEditorRef.current = monaco.editor.create(editorRef.current, {
        value,
        language,
        theme: 'ensaai-dark',
        automaticLayout: true,
        minimap: { enabled: true },
        scrollBeyondLastLine: false,
        fontSize: 14,
        fontFamily: "JetBrains Mono, Menlo, Monaco, 'Courier New', monospace",
        lineNumbers: 'on',
        wordWrap: 'on',
        ...options,
      });

      // Add change event listener
      if (onChange) {
        monacoEditorRef.current.onDidChangeModelContent((event) => {
          isInternalChangeRef.current = true;
          onChange(monacoEditorRef.current?.getValue() || '');
          // Reset after the current call stack completes
          setTimeout(() => {
            isInternalChangeRef.current = false;
          }, 0);
        });
      }

      // Cleanup
      return () => {
        monacoEditorRef.current?.dispose();
      };
    }
  }, [language, options, onChange]);

  // Update editor value when prop changes, but only if it's not from an internal change
  useEffect(() => {
    if (monacoEditorRef.current && !isInternalChangeRef.current) {
      const currentValue = monacoEditorRef.current.getValue();
      if (value !== currentValue) {
        // Get current cursor position and selection before updating
        const position = monacoEditorRef.current.getPosition();
        const selection = monacoEditorRef.current.getSelection();

        // Instead of replacing the entire content, we'll use the editor model's edit operation
        const model = monacoEditorRef.current.getModel();
        if (model) {
          // We'll use a more direct approach to preserve cursor position
          const edits = [
            {
              range: model.getFullModelRange(),
              text: value,
              forceMoveMarkers: true, // This helps preserve cursor position
            },
          ];

          model.pushEditOperations(
            [], // No selection changes
            edits, // Our edits
            () => [] // No cursor changes
          );
        }

        // Restore cursor position and selection after the edit
        if (position) {
          monacoEditorRef.current.setPosition(position);
        }
        if (selection) {
          monacoEditorRef.current.setSelection(selection);
        }
      }
    }
  }, [value]);

  // Update language when it changes
  useEffect(() => {
    if (monacoEditorRef.current) {
      const model = monacoEditorRef.current.getModel();
      if (model) {
        monaco.editor.setModelLanguage(model, language);
      }
    }
  }, [language]);

  return <div ref={editorRef} className="h-full w-full" />;
}
