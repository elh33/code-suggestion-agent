'use client';

import {
  useRef,
  useEffect,
  memo,
  forwardRef,
  useImperativeHandle,
} from 'react';
import * as monaco from 'monaco-editor';

// Import the language data and suggestion types
import {
  type CodeSuggestion,
  type SuggestionType,
  getSuggestionIcon,
  getSeverityColor,
} from './suggestion-types';

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
  options?: monaco.editor.IStandaloneEditorConstructionOptions;
  onSuggestionsChange?: (suggestions: CodeSuggestion[]) => void;
  optimizationTypes?: string[]; // New prop for filtering optimization types
  filepath?: string; // New prop for file path
  onEditorReady?: (editorAPI: MonacoEditorRef) => void;
}

// Python file extension validation
function isPythonFile(filepath: string | undefined): boolean {
  if (!filepath) return true; // Default to true if no filepath provided
  return filepath.toLowerCase().endsWith('.py');
}

// Ensure Python extension on filenames
function ensurePythonExtension(filepath: string | undefined): string {
  if (!filepath) return 'untitled.py';
  if (filepath.toLowerCase().endsWith('.py')) return filepath;
  return `${filepath}.py`;
}

// Validate Python filenames
function validatePythonFilename(filename: string): {
  valid: boolean;
  message?: string;
} {
  if (!filename) {
    return { valid: false, message: 'Filename cannot be empty' };
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
  const baseTemplate = `"""
${filename}
Created: ${new Date().toLocaleDateString()}

Description:
    Python file for code operations
"""

`;

  // Different templates based on filename patterns
  if (filename.includes('test')) {
    return (
      baseTemplate +
      `import unittest

class Test${filename.replace(/test_|\.py/g, '').replace(/\b\w/g, (c) => c.toUpperCase())}(unittest.TestCase):
    def setUp(self):
        """Set up test fixtures, if any."""
        pass
        
    def tearDown(self):
        """Tear down test fixtures, if any."""
        pass
        
    def test_example(self):
        """Test example, will always pass."""
        self.assertEqual(1, 1)
        
if __name__ == '__main__':
    unittest.main()
`
    );
  } else if (filename.includes('main')) {
    return (
      baseTemplate +
      `def main():
    """Main entry point of the app."""
    print("Hello, Python World!")

if __name__ == "__main__":
    # This is executed when run from the command line
    main()
`
    );
  } else {
    return (
      baseTemplate +
      `def hello():
    """Simple function that returns a greeting."""
    return "Hello, Python World!"

# Add your code here
if __name__ == "__main__":
    print(hello())
`
    );
  }
}

// Function to get Python-specific keywords and builtins
function getPythonKeywords() {
  return {
    keywords: [
      'def',
      'class',
      'if',
      'else',
      'elif',
      'for',
      'while',
      'return',
      'import',
      'from',
      'as',
      'try',
      'except',
      'finally',
      'with',
      'lambda',
      'global',
      'nonlocal',
      'yield',
      'async',
      'await',
      'break',
      'continue',
      'pass',
      'None',
      'True',
      'False',
      'and',
      'or',
      'not',
      'is',
      'in',
    ],
    builtins: [
      'print',
      'len',
      'range',
      'list',
      'dict',
      'set',
      'tuple',
      'str',
      'int',
      'float',
      'bool',
      'map',
      'filter',
      'sum',
      'min',
      'max',
      'open',
      'zip',
      'enumerate',
      'sorted',
      'abs',
      'all',
      'any',
      'chr',
      'dir',
      'divmod',
      'hash',
      'hex',
      'id',
      'input',
      'isinstance',
      'issubclass',
      'iter',
      'next',
      'oct',
      'ord',
      'pow',
      'repr',
      'round',
      'slice',
      'vars',
      'type',
      'super',
    ],
    operators: [
      '+',
      '-',
      '*',
      '/',
      '=',
      '==',
      '!=',
      '>',
      '<',
      '>=',
      '<=',
      'and',
      'or',
      'not',
      'in',
      'is',
      '%',
      '**',
      '//',
      '+=',
      '-=',
      '*=',
      '/=',
      '%=',
      '**=',
      '//=',
    ],
  };
}

// Register Python language features
function registerPythonFeatures(monaco: typeof import('monaco-editor')) {
  const { keywords, builtins, operators } = getPythonKeywords();

  // Register Python completion provider
  monaco.languages.registerCompletionItemProvider('python', {
    provideCompletionItems: (model, position) => {
      const word = model.getWordUntilPosition(position);
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn,
      };

      const keywordSuggestions = keywords.map((keyword) => ({
        label: keyword,
        kind: monaco.languages.CompletionItemKind.Keyword,
        insertText: keyword,
        range,
      }));

      const builtinSuggestions = builtins.map((builtin) => ({
        label: builtin,
        kind: monaco.languages.CompletionItemKind.Function,
        insertText: builtin,
        range,
      }));

      return {
        suggestions: [...keywordSuggestions, ...builtinSuggestions],
      };
    },
  });

  // Add Python hover provider
  monaco.languages.registerHoverProvider('python', {
    provideHover: (model, position) => {
      const word = model.getWordAtPosition(position);

      if (!word) return null;

      const isKeyword = keywords.includes(word.word);
      const isBuiltin = builtins.includes(word.word);

      if (isKeyword) {
        return {
          contents: [
            { value: `**${word.word}**` },
            { value: `Python keyword` },
          ],
        };
      }

      if (isBuiltin) {
        return {
          contents: [
            { value: `**${word.word}**` },
            { value: `Python built-in function or object` },
          ],
        };
      }

      return null;
    },
  });
}

const BaseMonacoEditor = forwardRef(function BaseMonacoEditor(
  {
    language = 'python', // Default to Python
    value,
    onChange,
    theme = 'vs-dark',
    options = {},
    onSuggestionsChange,
    optimizationTypes = ['performance', 'bugfix', 'refactoring', 'completion'],
    filepath,
    onEditorReady,
  }: MonacoEditorProps,
  ref
) {
  // DOM element reference
  const editorRef = useRef<HTMLDivElement>(null);

  // Monaco editor instance reference
  const monacoEditorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(
    null
  );

  // Initialization tracking
  const initializedRef = useRef(false);

  // Store values in refs to avoid re-renders
  const valueRef = useRef(value);
  const languageRef = useRef('python'); // Force Python language
  const onChangeRef = useRef(onChange);
  const onSuggestionsChangeRef = useRef(onSuggestionsChange);
  const optimizationTypesRef = useRef(optimizationTypes);
  const filepathRef = useRef(filepath);

  // Store suggestions
  const suggestionsRef = useRef<CodeSuggestion[]>([]);
  const suggestionWidgetsRef =
    useRef<monaco.editor.IEditorDecorationsCollection | null>(null);
  const inlineButtonsRef =
    useRef<monaco.editor.IEditorDecorationsCollection | null>(null);

  // Create a Python file with template
  const createPythonFile = (
    filename: string
  ): { success: boolean; message?: string } => {
    // Validate the filename
    const validation = validatePythonFilename(filename);
    if (!validation.valid) {
      return { success: false, message: validation.message };
    }

    // Ensure it has .py extension
    const pythonFilename = ensurePythonExtension(filename);

    try {
      // Get appropriate template based on filename
      const pythonTemplate = getPythonTemplate(pythonFilename);

      // Create file URI
      const fileUri = monaco.Uri.parse(
        `file:///${pythonFilename.replace(/\\/g, '/')}`
      );

      // Check if a model already exists
      const existingModel = monaco.editor.getModel(fileUri);

      if (existingModel) {
        // Model exists - update content and switch to it
        existingModel.setValue(pythonTemplate);

        if (monacoEditorRef.current) {
          monacoEditorRef.current.setModel(existingModel);
        }
      } else {
        // Create new model with template
        const newModel = monaco.editor.createModel(
          pythonTemplate,
          'python',
          fileUri
        );

        if (monacoEditorRef.current) {
          // Get current model before switching
          const currentModel = monacoEditorRef.current.getModel();

          // Switch to new model
          monacoEditorRef.current.setModel(newModel);

          // Handle old model cleanup
          if (currentModel && !currentModel.isDisposed()) {
            // Only dispose if no other editors are using it
            const otherModels = monaco.editor.getModels();
            const isShared = otherModels.some(
              (m) =>
                m !== currentModel &&
                m.uri.toString() === currentModel.uri.toString()
            );

            if (!isShared) {
              currentModel.dispose();
            }
          }
        }
      }

      // Update internal state
      valueRef.current = pythonTemplate;
      filepathRef.current = pythonFilename;

      // Notify parent component if needed
      if (onChangeRef.current) {
        onChangeRef.current(pythonTemplate);
      }

      // Run analysis on the new file
      analyzeSuggestions();

      return { success: true };
    } catch (error) {
      console.error('Error creating Python file:', error);
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'Failed to create Python file',
      };
    }
  };

  // Get current editor content
  const getCurrentValue = (): string => {
    if (monacoEditorRef.current) {
      return monacoEditorRef.current.getValue();
    }
    return valueRef.current;
  };

  // Expose methods via ref
  useImperativeHandle(ref, () => ({
    createPythonFile,
    getCurrentValue,
  }));

  // Update refs when props change
  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  useEffect(() => {
    // Always force Python language for any file
    languageRef.current = 'python';

    // Update language model if editor already exists
    if (monacoEditorRef.current && initializedRef.current) {
      const model = monacoEditorRef.current.getModel();
      if (model) {
        monaco.editor.setModelLanguage(model, 'python');
        // Re-analyze code when language changes
        analyzeSuggestions();
      }
    }
  }, [language]);

  useEffect(() => {
    // Update filepath and ensure it has .py extension
    filepathRef.current = filepath;

    // If the filepath is not a Python file, log a warning
    if (filepath && !isPythonFile(filepath)) {
      console.warn(
        'Non-Python file detected. File will be treated as Python file.'
      );
    }

    // If editor is initialized and filepath changes, update the model
    if (monacoEditorRef.current && initializedRef.current && filepath) {
      const pythonFilepath = ensurePythonExtension(filepath);
      const fileUri = monaco.Uri.parse(
        `file:///${pythonFilepath.replace(/\\/g, '/')}`
      );

      // Get the current model
      const currentModel = monacoEditorRef.current.getModel();

      // Only update if the URI is different
      if (currentModel && currentModel.uri.toString() !== fileUri.toString()) {
        // Check if a model already exists for the new URI
        const existingModel = monaco.editor.getModel(fileUri);

        if (existingModel) {
          // Use existing model
          monacoEditorRef.current.setModel(existingModel);
        } else {
          // Create a new model
          const newModel = monaco.editor.createModel(
            valueRef.current,
            'python',
            fileUri
          );
          monacoEditorRef.current.setModel(newModel);

          // Dispose the old model if it's not being used by other editors
          if (currentModel && !currentModel.isDisposed()) {
            const otherModels = monaco.editor.getModels();
            const isShared = otherModels.some(
              (m) =>
                m !== currentModel &&
                m.uri.toString() === currentModel.uri.toString()
            );

            if (!isShared) {
              currentModel.dispose();
            }
          }
        }

        // Re-analyze when model changes
        analyzeSuggestions();
      }
    }
  }, [filepath]);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    onSuggestionsChangeRef.current = onSuggestionsChange;
  }, [onSuggestionsChange]);

  useEffect(() => {
    optimizationTypesRef.current = optimizationTypes;

    // Update stars based on new optimization types
    if (initializedRef.current) {
      // Re-filter and update the inline stars
      const filteredSuggestions = suggestionsRef.current.filter((suggestion) =>
        optimizationTypes.includes(
          suggestion.type === 'optimization' ? 'performance' : suggestion.type
        )
      );

      // Update decorations to show suggestion indicators
      updateSuggestionDecorations(filteredSuggestions);

      // Add inline buttons next to code lines with suggestions
      addInlineButtons(filteredSuggestions);
    }
  }, [optimizationTypes]);

  // Function to analyze code and update suggestions (Python-specific)
  const analyzeSuggestions = () => {
    if (!monacoEditorRef.current) return;

    const model = monacoEditorRef.current.getModel();
    if (!model) return;

    const code = model.getValue();
    const lines = code.split('\n');
    const pythonSuggestions: CodeSuggestion[] = [];

    // Create Python-specific suggestions
    lines.forEach((line, index) => {
      // Skip empty lines
      if (line.trim() === '') return;

      // Only create suggestions for specific Python patterns
      if (
        line.includes('print') &&
        !line.includes('f"') &&
        line.includes('"')
      ) {
        // Suggest f-strings for print statements
        pythonSuggestions.push({
          id: `python-fstring-${index}`,
          type: 'optimization' as SuggestionType,
          lineNumber: index + 1,
          code: line,
          replacement: line.replace(/print\("(.+?)"\)/, 'print(f"$1")'),
          description: 'Consider using f-strings for better string formatting',
          severity: 'info',
        });
      } else if (
        line.match(/for\s+\w+\s+in\s+range\(\d+\)/) &&
        !line.includes('enumerate')
      ) {
        // Suggest enumerate for indexed loops
        pythonSuggestions.push({
          id: `python-enumerate-${index}`,
          type: 'refactoring' as SuggestionType,
          lineNumber: index + 1,
          code: line,
          replacement: line.replace(
            /for\s+(\w+)\s+in\s+range\((.+?)\)/,
            'for i, $1 in enumerate(range($2))'
          ),
          description: 'Use enumerate() to get index and value in loops',
          severity: 'info',
        });
      } else if (
        line.includes('if') &&
        (line.includes('==') || line.includes('!=')) &&
        line.includes('None')
      ) {
        // Suggest proper None comparison
        pythonSuggestions.push({
          id: `python-none-${index}`,
          type: 'bugfix' as SuggestionType,
          lineNumber: index + 1,
          code: line,
          replacement: line
            .replace(/([^=!])==([\s]*)None/, '$1 is$2None')
            .replace(/([^=!])!=([\s]*)None/, '$1 is not$2None'),
          description: 'Use "is None" instead of "== None" for identity check',
          severity: 'warning',
        });
      } else if (index % 5 === 0) {
        // Add occasional hints
        // Add some random Python tips
        const tips = [
          {
            type: 'completion',
            text: '# Consider adding docstrings to document your code',
            replace:
              '"""Add your docstring here to describe function purpose"""\n' +
              line,
          },
          {
            type: 'optimization',
            text: '# Use list comprehension for more efficient code',
            replace:
              '# List comprehension example: [x for x in range(10)]\n' + line,
          },
          {
            type: 'refactoring',
            text: '# Extract this into a function for better reusability',
            replace:
              '# Consider refactoring this into a separate function\n' + line,
          },
        ];

        const tip = tips[index % tips.length];
        pythonSuggestions.push({
          id: `python-tip-${index}`,
          type: tip.type as SuggestionType,
          lineNumber: index + 1,
          code: line,
          replacement: tip.replace,
          description: tip.text,
          severity: 'info',
        });
      }
    });

    // Store all suggestions
    suggestionsRef.current = pythonSuggestions;

    // Filter based on optimization types
    const filteredSuggestions = pythonSuggestions.filter((suggestion) =>
      optimizationTypesRef.current.includes(
        suggestion.type === 'optimization' ? 'performance' : suggestion.type
      )
    );

    // Notify parent component of suggestions
    if (onSuggestionsChangeRef.current) {
      onSuggestionsChangeRef.current(filteredSuggestions);
    }

    // Update editor decorations to show suggestion indicators
    updateSuggestionDecorations(filteredSuggestions);

    // Add inline buttons next to code lines with suggestions
    addInlineButtons(filteredSuggestions);
  };

  // Function to update editor decorations for suggestions
  const updateSuggestionDecorations = (suggestions: CodeSuggestion[]) => {
    if (!monacoEditorRef.current) return;

    // Clear previous decorations
    if (suggestionWidgetsRef.current) {
      suggestionWidgetsRef.current.clear();
    }

    // Create new decorations for each suggestion
    const decorations = suggestions.map((suggestion) => {
      const icon = getSuggestionIcon(suggestion.type);
      const color = getSeverityColor(suggestion.severity);

      return {
        range: new monaco.Range(
          suggestion.lineNumber,
          1,
          suggestion.lineNumber,
          1
        ),
        options: {
          isWholeLine: true,
          className: `suggestion-line-${suggestion.severity}`,
          glyphMarginClassName: 'suggestion-icon',
          glyphMarginHoverMessage: {
            value: `**${suggestion.type}**: ${suggestion.description}`,
          },
          stickiness:
            monaco.editor.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
        },
      };
    });

    // Apply decorations to editor
    if (decorations.length > 0 && monacoEditorRef.current) {
      suggestionWidgetsRef.current =
        monacoEditorRef.current.createDecorationsCollection(decorations);
    }
  };

  // Function to add inline buttons next to code lines with optimization or bugfix suggestions
  const addInlineButtons = (suggestions: CodeSuggestion[]) => {
    if (!monacoEditorRef.current) return;

    // Clear previous inline buttons
    if (inlineButtonsRef.current) {
      inlineButtonsRef.current.clear();
    }

    const model = monacoEditorRef.current.getModel();
    if (!model) return;

    // Create inline buttons for filtered suggestions
    const inlineDecorations = suggestions.map((suggestion) => {
      // Get the line content to determine where to place the button
      const lineContent = model.getLineContent(suggestion.lineNumber);

      // Create a button that appears at the end of the line with type-specific class
      return {
        range: new monaco.Range(
          suggestion.lineNumber,
          Math.max(1, lineContent.length + 1),
          suggestion.lineNumber,
          Math.max(1, lineContent.length + 1)
        ),
        options: {
          afterContentClassName: 'suggestion-inline-button',
          after: {
            content: ' ⭐', // Star icon
            inlineClassName: `suggestion-inline-star suggestion-star-${suggestion.type}`,
          },
          stickiness:
            monaco.editor.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
        },
      };
    });

    // Apply inline button decorations
    if (inlineDecorations.length > 0) {
      inlineButtonsRef.current =
        monacoEditorRef.current.createDecorationsCollection(inlineDecorations);
    }
  };

  // Initialize the editor once
  useEffect(() => {
    if (editorRef.current && !initializedRef.current) {
      // Define custom theme with Python-friendly colors
      monaco.editor.defineTheme('python-dark', {
        base: 'vs-dark',
        inherit: true,
        rules: [
          { token: 'comment', foreground: '6A9955' },
          { token: 'keyword', foreground: 'CF9FFF' }, // Light purple for keywords
          { token: 'string', foreground: 'CE9178' },
          { token: 'number', foreground: 'B5CEA8' },
          { token: 'operator', foreground: 'D4D4D4' },
          { token: 'delimiter', foreground: 'D4D4D4' },
          { token: 'type', foreground: '4EC9B0' },
          { token: 'function', foreground: 'DCDCAA' },
        ],
        colors: {
          'editor.background': '#0a0a12',
          'editor.foreground': '#f8f8f2',
          'editorCursor.foreground': '#f8f8f2',
          'editor.lineHighlightBackground': '#1E1E2E',
          'editorLineNumber.foreground': '#6272a4',
          'editor.selectionBackground': '#264F78',
          'editor.inactiveSelectionBackground': '#264F7880',
        },
      });

      // Register Python language features
      registerPythonFeatures(monaco);

      // Ensure file has Python extension
      const pythonFilepath = ensurePythonExtension(filepathRef.current);

      try {
        // Create or reuse the model with the Python file path
        const fileUri = monaco.Uri.parse(
          `file:///${pythonFilepath.replace(/\\/g, '/')}`
        );

        // Check if a model already exists for this URI
        let model = monaco.editor.getModel(fileUri);

        if (model) {
          // If model exists, update its value
          model.setValue(valueRef.current);
        } else {
          // Create a new model
          model = monaco.editor.createModel(
            valueRef.current,
            'python',
            fileUri
          );
        }

        // Initialize Monaco Editor with Python settings
        monacoEditorRef.current = monaco.editor.create(editorRef.current, {
          model: model,
          theme: 'python-dark',
          automaticLayout: true,
          minimap: { enabled: true },
          scrollBeyondLastLine: false,
          fontSize: 14,
          fontFamily: "JetBrains Mono, Menlo, Monaco, 'Courier New', monospace",
          lineNumbers: 'on',
          wordWrap: 'on',
          glyphMargin: true, // Enable glyph margin for suggestion icons
          tabSize: 4, // Python standard
          insertSpaces: true, // Use spaces instead of tabs for Python
          ...options,
        });
      } catch (error) {
        // Fallback if there's any error with model creation
        console.error('Error creating model:', error);

        // Create without a specific model
        monacoEditorRef.current = monaco.editor.create(editorRef.current, {
          value: valueRef.current,
          language: 'python',
          theme: 'python-dark',
          automaticLayout: true,
          minimap: { enabled: true },
          scrollBeyondLastLine: false,
          fontSize: 14,
          fontFamily: "JetBrains Mono, Menlo, Monaco, 'Courier New', monospace",
          lineNumbers: 'on',
          wordWrap: 'on',
          glyphMargin: true,
          tabSize: 4,
          insertSpaces: true,
          ...options,
        });
      }

      // Add CSS for suggestion icons, line highlighting, and inline buttons
      const styleElement = document.createElement('style');
      styleElement.textContent = `
.suggestion-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  font-size: 14px;
}

.suggestion-inline-button {
  cursor: pointer;
}

.suggestion-inline-star {
  color: #f1c40f;
  font-size: 16px;
  margin-left: 8px;
  animation: pulse 2s infinite;
  cursor: pointer;
  display: inline-block;
  font-weight: bold;
  text-shadow: 0 0 5px rgba(241, 196, 15, 0.5);
  z-index: 100;
  position: relative;
}

/* Add specific styling for different suggestion types */
.suggestion-star-optimization {
  color: #10b981; /* Green color for optimization suggestions */
}

.suggestion-star-bugfix {
  color: #ef4444; /* Red color for bugfix suggestions */
}

.suggestion-star-refactoring {
  color: #3b82f6; /* Blue color for refactoring suggestions */
}

.suggestion-star-completion {
  color: #8b5cf6; /* Purple color for completion suggestions */
}

@keyframes pulse {
  0% { opacity: 0.6; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.1); }
  100% { opacity: 0.6; transform: scale(1); }
}

.suggestion-line-info {
  background-color: rgba(59, 130, 246, 0.05);
}
.suggestion-line-warning {
  background-color: rgba(245, 158, 11, 0.05);
}
.suggestion-line-error {
  background-color: rgba(239, 68, 68, 0.05);
}

/* Action menu styling */
.action-menu {
  position: absolute;
  background-color: #1e1e2e;
  border: 1px solid #333340;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  z-index: 9999;
  min-width: 180px;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-5px); }
  to { opacity: 1; transform: translateY(0); }
}

.action-menu-item {
  padding: 8px 12px;
  color: #f8f8f2;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
}

.action-menu-item:hover {
  background-color: #2d2d3a;
}

.action-menu-divider {
  height: 1px;
  background-color: #333340;
  margin: 4px 0;
}
`;
      document.head.appendChild(styleElement);

      // Handle clicks on the inline star buttons
      monacoEditorRef.current.onMouseDown((e) => {
        // Check if we clicked on an inline button (the star)
        if (
          e.target.element?.classList.contains('suggestion-inline-star') ||
          (e.target.element?.parentElement &&
            e.target.element.parentElement.classList.contains(
              'suggestion-inline-star'
            ))
        ) {
          const position = e.target.position;
          if (!position) return;

          const suggestion = suggestionsRef.current.find(
            (s) => s.lineNumber === position.lineNumber
          );
          if (!suggestion) return;

          // Show action menu for this suggestion
          showActionMenu(suggestion, e.event.posx, e.event.posy);
        }
      });

      // Function to show the action menu
      const showActionMenu = (
        suggestion: CodeSuggestion,
        x: number,
        y: number
      ) => {
        // Remove any existing menu
        const existingMenu = document.getElementById('action-menu');
        if (existingMenu) {
          document.body.removeChild(existingMenu);
        }

        // Create menu container
        const menu = document.createElement('div');
        menu.id = 'action-menu';
        menu.className = 'action-menu';
        menu.style.left = `${x}px`;
        menu.style.top = `${y}px`;

        // Add menu items based on suggestion type
        const createMenuItem = (
          text: string,
          action: () => void,
          icon?: string
        ) => {
          const item = document.createElement('div');
          item.className = 'action-menu-item';
          item.innerHTML = icon ? `${icon} ${text}` : text;
          item.onclick = () => {
            action();
            document.body.removeChild(menu);
          };
          return item;
        };

        // Make action menu with specific options based on suggestion type
        let actionText = 'Apply Suggestion';
        let actionIcon = '✨';

        if (suggestion.type === 'optimization') {
          actionText = 'Apply Optimization';
          actionIcon = '🚀';
        } else if (suggestion.type === 'bugfix') {
          actionText = 'Fix Bug';
          actionIcon = '🐛';
        } else if (suggestion.type === 'refactoring') {
          actionText = 'Apply Refactoring';
          actionIcon = '🔄';
        } else if (suggestion.type === 'completion') {
          actionText = 'Complete Code';
          actionIcon = '✨';
        }

        menu.appendChild(
          createMenuItem(
            actionText,
            () => {
              if (monacoEditorRef.current && suggestion.replacement) {
                const model = monacoEditorRef.current.getModel();
                if (!model) return;

                // Get the full line text and range
                const lineContent = model.getLineContent(suggestion.lineNumber);
                const range = new monaco.Range(
                  suggestion.lineNumber,
                  1,
                  suggestion.lineNumber,
                  lineContent.length + 1
                );

                // Apply the edit
                model.pushEditOperations(
                  [],
                  [{ range, text: suggestion.replacement }],
                  () => null
                );
              }
            },
            actionIcon
          )
        );

        // Add "View Details" option
        menu.appendChild(
          createMenuItem(
            'View Details',
            () => {
              // For demonstration purposes, show a more detailed alert
              const suggestionDetails = `
Type: ${suggestion.type}
Severity: ${suggestion.severity}
Line: ${suggestion.lineNumber}
Description: ${suggestion.description}

Original code:
${suggestion.code}

Suggested replacement:
${suggestion.replacement || 'No specific replacement available'}
`;
              alert(suggestionDetails);
            },
            'ℹ️'
          )
        );

        // Add "Ignore" option
        menu.appendChild(document.createElement('div')).className =
          'action-menu-divider';
        menu.appendChild(
          createMenuItem(
            'Ignore',
            () => {
              // Logic to ignore this suggestion
              console.log('Ignoring suggestion:', suggestion.id);

              // Remove the suggestion from the current list
              suggestionsRef.current = suggestionsRef.current.filter(
                (s) => s.id !== suggestion.id
              );

              // Update decorations
              updateSuggestionDecorations(
                suggestionsRef.current.filter((s) =>
                  optimizationTypesRef.current.includes(
                    s.type === 'optimization' ? 'performance' : s.type
                  )
                )
              );
              addInlineButtons(
                suggestionsRef.current.filter((s) =>
                  optimizationTypesRef.current.includes(
                    s.type === 'optimization' ? 'performance' : s.type
                  )
                )
              );

              // Notify parent component of suggestions
              if (onSuggestionsChangeRef.current) {
                onSuggestionsChangeRef.current(suggestionsRef.current);
              }
            },
            '✕'
          )
        );

        // Add the menu to the document
        document.body.appendChild(menu);

        // Close menu when clicking outside
        const closeOnClickOutside = (e: MouseEvent) => {
          if (!menu.contains(e.target as Node)) {
            document.body.removeChild(menu);
            document.removeEventListener('mousedown', closeOnClickOutside);
          }
        };

        // Add a small delay before adding the event listener to prevent immediate closing
        setTimeout(() => {
          document.addEventListener('mousedown', closeOnClickOutside);
        }, 100);
      };

      // Add change event listener with optimized update handling
      let changeTimeout: NodeJS.Timeout;
      let analysisTimeout: NodeJS.Timeout;

      monacoEditorRef.current.onDidChangeModelContent((e) => {
        if (!monacoEditorRef.current) return;

        // Get current value
        const newValue = monacoEditorRef.current.getValue();
        valueRef.current = newValue;

        // Clear previous timeouts
        clearTimeout(changeTimeout);
        clearTimeout(analysisTimeout);

        // Delay the onChange call to avoid excessive updates
        changeTimeout = setTimeout(() => {
          if (onChangeRef.current && newValue !== value) {
            onChangeRef.current(newValue);
          }
        }, 300);

        // Delay code analysis to avoid analyzing during active typing
        analysisTimeout = setTimeout(() => {
          analyzeSuggestions();
        }, 1000);
      });

      // Initial analysis
      setTimeout(() => {
        analyzeSuggestions();
      }, 500);

      initializedRef.current = true;

      // Notify parent that editor is ready with API
      if (onEditorReady) {
        onEditorReady({
          createPythonFile,
          getCurrentValue,
        });
      }

      // Cleanup
      return () => {
        clearTimeout(changeTimeout);
        clearTimeout(analysisTimeout);
        if (styleElement.parentNode) {
          styleElement.parentNode.removeChild(styleElement);
        }
        if (monacoEditorRef.current) {
          // Get the model before disposing the editor
          const model = monacoEditorRef.current.getModel();

          // Dispose the editor
          monacoEditorRef.current.dispose();
          monacoEditorRef.current = null;

          // Only attempt to dispose the model if it's not already disposed
          if (model && !model.isDisposed()) {
            const uri = model.uri.toString();
            const otherModels = monaco.editor.getModels();

            // Only dispose if no other editor is using this model
            const isShared = otherModels.some(
              (m) => m !== model && m.uri.toString() === uri
            );

            if (!isShared) {
              model.dispose();
            }
          }

          initializedRef.current = false;
        }
      };
    }
  }, [options, onEditorReady]); // Added onEditorReady to dependencies

  // Update the editor value when it changes externally
  useEffect(() => {
    if (monacoEditorRef.current && value !== valueRef.current) {
      valueRef.current = value;

      // Avoid cursor jumping by preserving selection
      const selection = monacoEditorRef.current.getSelection();
      const scrollPosition = {
        scrollTop: monacoEditorRef.current.getScrollTop(),
        scrollLeft: monacoEditorRef.current.getScrollLeft(),
      };

      monacoEditorRef.current.setValue(value);

      // Restore selection and scroll position
      if (selection) {
        monacoEditorRef.current.setSelection(selection);
      }
      monacoEditorRef.current.setScrollPosition(scrollPosition);

      // Re-analyze after external value change
      setTimeout(() => {
        analyzeSuggestions();
      }, 300);
    }
  }, [value]);

  return <div ref={editorRef} className="h-full w-full" />;
});

// Export wrapped component with memo for better performance
export default memo(BaseMonacoEditor, (prevProps, nextProps) => {
  // Only re-render if these props actually change in a significant way
  return (
    // We force Python so language prop changes don't matter
    // prevProps.language === nextProps.language &&
    // For value changes, only re-render for significant changes
    (prevProps.value === nextProps.value ||
      Math.abs(prevProps.value?.length - nextProps.value?.length) < 10) &&
    prevProps.theme === nextProps.theme &&
    JSON.stringify(prevProps.options) === JSON.stringify(nextProps.options) &&
    JSON.stringify(prevProps.optimizationTypes) ===
      JSON.stringify(nextProps.optimizationTypes) &&
    prevProps.filepath === nextProps.filepath
  );
});
