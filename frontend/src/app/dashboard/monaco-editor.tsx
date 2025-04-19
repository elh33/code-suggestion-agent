'use client';

import { useRef, useEffect, memo } from 'react';
import * as monaco from 'monaco-editor';

// Import the language data and suggestion types
import {
  type CodeSuggestion,
  getSuggestionIcon,
  getSeverityColor,
} from './suggestion-types';

interface MonacoEditorProps {
  language?: string;
  value: string;
  onChange?: (value: string) => void;
  theme?: string;
  options?: monaco.editor.IStandaloneEditorConstructionOptions;
  onSuggestionsChange?: (suggestions: CodeSuggestion[]) => void;
}

// Function to get language-specific keywords and builtins
function getLanguageKeywords(language: string) {
  switch (language) {
    case 'javascript':
      return {
        keywords: [
          'function',
          'var',
          'let',
          'const',
          'if',
          'else',
          'for',
          'while',
          'return',
          'class',
          'extends',
          'new',
          'this',
          'import',
          'export',
        ],
        builtins: [
          'console.log',
          'Math.random',
          'Date',
          'Array',
          'Object',
          'String',
          'Number',
          'Boolean',
        ],
        operators: [
          '+',
          '-',
          '*',
          '/',
          '=',
          '==',
          '===',
          '!=',
          '!==',
          '>',
          '<',
          '>=',
          '<=',
          '&&',
          '||',
          '!',
          '?',
        ],
      };
    case 'typescript':
      return {
        keywords: [
          'function',
          'var',
          'let',
          'const',
          'if',
          'else',
          'for',
          'while',
          'return',
          'class',
          'extends',
          'new',
          'this',
          'import',
          'export',
          'type',
          'interface',
        ],
        builtins: [
          'console.log',
          'Math.random',
          'Date',
          'Array',
          'Object',
          'String',
          'Number',
          'Boolean',
        ],
        operators: [
          '+',
          '-',
          '*',
          '/',
          '=',
          '==',
          '===',
          '!=',
          '!==',
          '>',
          '<',
          '>=',
          '<=',
          '&&',
          '||',
          '!',
          '?',
        ],
      };
    case 'python':
      return {
        keywords: [
          'def',
          'if',
          'else',
          'for',
          'while',
          'return',
          'class',
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
        ],
      };
    case 'html':
      return {
        keywords: [
          'html',
          'head',
          'body',
          'div',
          'span',
          'p',
          'a',
          'img',
          'ul',
          'ol',
          'li',
          'table',
          'tr',
          'td',
          'th',
          'form',
          'input',
          'button',
          'select',
          'option',
          'textarea',
          'script',
          'style',
        ],
        builtins: [],
        operators: [],
      };
    case 'css':
      return {
        keywords: [
          'color',
          'background',
          'margin',
          'padding',
          'border',
          'font-size',
          'font-family',
          'display',
          'position',
          'width',
          'height',
          'text-align',
          'float',
          'clear',
        ],
        builtins: [],
        operators: [],
      };
    case 'php':
      return {
        keywords: [
          'function',
          'if',
          'else',
          'for',
          'while',
          'return',
          'class',
          'extends',
          'new',
          'public',
          'private',
          'protected',
          'static',
          'echo',
          'include',
          'require',
        ],
        builtins: [
          'strlen',
          'count',
          'array',
          'date',
          'time',
          'isset',
          'empty',
        ],
        operators: [
          '+',
          '-',
          '*',
          '/',
          '=',
          '==',
          '===',
          '!=',
          '>',
          '<',
          '>=',
          '<=',
          '&&',
          '||',
          '!',
          '?',
        ],
      };
    case 'java':
      return {
        keywords: [
          'class',
          'public',
          'private',
          'protected',
          'static',
          'void',
          'int',
          'double',
          'float',
          'boolean',
          'String',
          'if',
          'else',
          'for',
          'while',
          'return',
          'new',
          'this',
          'import',
          'package',
        ],
        builtins: [
          'System.out.println',
          'Math.random',
          'ArrayList',
          'HashMap',
          'Scanner',
        ],
        operators: [
          '+',
          '-',
          '*',
          '/',
          '=',
          '==',
          '===',
          '!=',
          '>',
          '<',
          '>=',
          '<=',
          '&&',
          '||',
          '!',
          '?',
        ],
      };
    case 'c':
      return {
        keywords: [
          'int',
          'double',
          'float',
          'char',
          'void',
          'if',
          'else',
          'for',
          'while',
          'return',
          'struct',
          'typedef',
          'include',
          'define',
        ],
        builtins: ['printf', 'scanf', 'malloc', 'free', 'strlen', 'strcpy'],
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
          '&&',
          '||',
          '!',
          '?',
        ],
      };
    case 'cpp':
      return {
        keywords: [
          'int',
          'double',
          'float',
          'char',
          'void',
          'if',
          'else',
          'for',
          'while',
          'return',
          'class',
          'public',
          'private',
          'protected',
          'new',
          'delete',
          'include',
          'namespace',
        ],
        builtins: [
          'std::cout',
          'std::cin',
          'std::vector',
          'std::string',
          'std::map',
        ],
        operators: [
          '+',
          '-',
          '*',
          '/',
          '=',
          '==',
          '===',
          '!=',
          '>',
          '<',
          '>=',
          '<=',
          '&&',
          '||',
          '!',
          '?',
        ],
      };
    default:
      return { keywords: [], builtins: [], operators: [] };
  }
}

// Register language features
function registerLanguageFeatures(monaco: typeof import('monaco-editor')) {
  // Register custom language features for languages that need enhancement
  const languages = [
    'javascript',
    'typescript',
    'python',
    'html',
    'css',
    'php',
    'java',
    'c',
    'cpp',
  ];

  languages.forEach((lang) => {
    const { keywords, builtins, operators } = getLanguageKeywords(lang);

    if (keywords.length > 0 || builtins.length > 0) {
      monaco.languages.registerCompletionItemProvider(lang, {
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
    }
  });

  // Add hover providers for keywords
  languages.forEach((lang) => {
    const { keywords, builtins } = getLanguageKeywords(lang);

    monaco.languages.registerHoverProvider(lang, {
      provideHover: (model, position) => {
        const word = model.getWordAtPosition(position);

        if (!word) return null;

        const isKeyword = keywords.includes(word.word);
        const isBuiltin = builtins.includes(word.word);

        if (isKeyword) {
          return {
            contents: [
              { value: `**${word.word}**` },
              { value: `Language keyword in ${lang}` },
            ],
          };
        }

        if (isBuiltin) {
          return {
            contents: [
              { value: `**${word.word}**` },
              { value: `Built-in function or object in ${lang}` },
            ],
          };
        }

        return null;
      },
    });
  });
}

function BaseMonacoEditor({
  language = 'javascript',
  value,
  onChange,
  theme = 'vs-dark',
  options = {},
  onSuggestionsChange,
}: MonacoEditorProps) {
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
  const languageRef = useRef(language);
  const onChangeRef = useRef(onChange);
  const onSuggestionsChangeRef = useRef(onSuggestionsChange);

  // Store suggestions
  const suggestionsRef = useRef<CodeSuggestion[]>([]);
  const suggestionWidgetsRef =
    useRef<monaco.editor.IEditorDecorationsCollection | null>(null);
  const inlineButtonsRef =
    useRef<monaco.editor.IEditorDecorationsCollection | null>(null);

  // Update refs when props change
  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  useEffect(() => {
    languageRef.current = language;

    // Update language model if editor already exists
    if (monacoEditorRef.current && initializedRef.current) {
      const model = monacoEditorRef.current.getModel();
      if (model) {
        monaco.editor.setModelLanguage(model, language);

        // Re-analyze code when language changes
        analyzeSuggestions();
      }
    }
  }, [language]);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    onSuggestionsChangeRef.current = onSuggestionsChange;
  }, [onSuggestionsChange]);

  // Function to analyze code and update suggestions
  const analyzeSuggestions = () => {
    if (!monacoEditorRef.current) return;

    const model = monacoEditorRef.current.getModel();
    if (!model) return;

    const code = model.getValue();
    const lang = languageRef.current;

    // For now, create dummy suggestions for every line to show the stars
    // This will be replaced with real AI analysis later
    const lines = code.split('\n');
    const dummySuggestions: CodeSuggestion[] = [];

    // Create a dummy suggestion for each line
    lines.forEach((line, index) => {
      // Skip empty lines
      if (line.trim() === '') return;

      // Create a dummy suggestion with rotating types
      const types: Array<
        'completion' | 'bugfix' | 'optimization' | 'refactoring'
      > = ['completion', 'bugfix', 'optimization', 'refactoring'];
      const severities: Array<'info' | 'warning' | 'error'> = [
        'info',
        'warning',
        'error',
      ];

      dummySuggestions.push({
        id: `dummy-${index}`,
        type: types[index % types.length],
        lineNumber: index + 1,
        code: line,
        replacement: `// This is a placeholder replacement for line ${index + 1}`,
        description: `Placeholder suggestion for demonstration purposes`,
        severity: severities[index % severities.length],
      });
    });

    // Store the suggestions
    suggestionsRef.current = dummySuggestions;

    // Notify parent component of suggestions
    if (onSuggestionsChangeRef.current) {
      onSuggestionsChangeRef.current(dummySuggestions);
    }

    // Update editor decorations to show suggestion indicators
    updateSuggestionDecorations(dummySuggestions);

    // Add inline buttons next to code lines with suggestions
    addInlineButtons(dummySuggestions);
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

  // Function to add inline buttons next to code lines with suggestions
  const addInlineButtons = (suggestions: CodeSuggestion[]) => {
    if (!monacoEditorRef.current) return;

    // Clear previous inline buttons
    if (inlineButtonsRef.current) {
      inlineButtonsRef.current.clear();
    }

    const model = monacoEditorRef.current.getModel();
    if (!model) return;

    // Filter suggestions to only include optimization and bugfix types
    const filteredSuggestions = suggestions.filter(
      (suggestion) =>
        suggestion.type === 'optimization' || suggestion.type === 'bugfix'
    );

    // Create inline buttons for filtered suggestions
    const inlineDecorations = filteredSuggestions.map((suggestion) => {
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

      // Register language features
      registerLanguageFeatures(monaco);

      // Initialize Monaco Editor with glyph margin enabled for suggestion icons
      monacoEditorRef.current = monaco.editor.create(editorRef.current, {
        value: valueRef.current,
        language: languageRef.current,
        theme: 'ensaai-dark',
        automaticLayout: true,
        minimap: { enabled: true },
        scrollBeyondLastLine: false,
        fontSize: 14,
        fontFamily: "JetBrains Mono, Menlo, Monaco, 'Courier New', monospace",
        lineNumbers: 'on',
        wordWrap: 'on',
        glyphMargin: true, // Enable glyph margin for suggestion icons
        ...options,
      });

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

      // Add change event listener with optimized update handling
      let changeTimeout: NodeJS.Timeout;
      let analysisTimeout: NodeJS.Timeout;
      let lastUpdateTime = Date.now();
      let lastValue = valueRef.current;
      let isTypingMode = false;
      let bufferChanges = 0;

      monacoEditorRef.current.onDidChangeModelContent((e) => {
        if (!monacoEditorRef.current) return;

        // Get current value
        const newValue = monacoEditorRef.current.getValue();
        valueRef.current = newValue;

        // Clear previous timeouts
        clearTimeout(changeTimeout);
        clearTimeout(analysisTimeout);

        // Calculate time since last update and change size
        const now = Date.now();
        const timeSinceLastUpdate = now - lastUpdateTime;
        const changeSize = Math.abs(newValue.length - lastValue.length);

        // Detect if user is typing (small changes in quick succession)
        if (changeSize <= 3 && timeSinceLastUpdate < 300) {
          isTypingMode = true;
          bufferChanges++;
        } else {
          isTypingMode = false;
          bufferChanges = 0;
        }

        // Dynamic debounce timing based on user interaction pattern
        const debounceTime = isTypingMode
          ? Math.min(100 + bufferChanges * 5, 500)
          : // Gradual increase when typing
            changeSize > 50
            ? 250
            : // Large changes (paste)
              100; // Default

        // Delay the onChange call to avoid excessive updates
        changeTimeout = setTimeout(() => {
          if (onChangeRef.current && newValue !== value) {
            onChangeRef.current(newValue);
            lastUpdateTime = Date.now();
            lastValue = newValue;

            // Reset buffer after sending update
            bufferChanges = 0;
          }
        }, debounceTime);

        // Delay code analysis to avoid analyzing during active typing
        // Use a longer delay for analysis to ensure typing has paused
        analysisTimeout = setTimeout(
          () => {
            analyzeSuggestions();
          },
          isTypingMode ? 1000 : 500
        );
      });

      // Handle clicks on the inline star buttons
      monacoEditorRef.current.onMouseDown((e) => {
        // Check if we clicked on a glyph margin icon
        if (
          e.target.type === monaco.editor.MouseTargetType.GUTTER_GLYPH_MARGIN
        ) {
          const lineNumber = e.target.position?.lineNumber;
          if (!lineNumber) return;

          const suggestion = suggestionsRef.current.find(
            (s) => s.lineNumber === lineNumber
          );
          if (!suggestion) return;

          // Show action menu for this suggestion
          showActionMenu(suggestion, e.event.posx, e.event.posy);
        }
        // Check if we clicked on an inline button (the star)
        else if (
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

        // Add "Apply Suggestion" option if there's a replacement
        if (suggestion.replacement) {
          menu.appendChild(
            createMenuItem(
              `Apply ${suggestion.type === 'optimization' ? 'Optimization' : 'Bug Fix'}`,
              () => {
                if (monacoEditorRef.current) {
                  const model = monacoEditorRef.current.getModel();
                  if (!model) return;

                  // Get the full line text and range
                  const lineContent = model.getLineContent(
                    suggestion.lineNumber
                  );
                  const range = new monaco.Range(
                    suggestion.lineNumber,
                    1,
                    suggestion.lineNumber,
                    lineContent.length + 1
                  );

                  // Apply the edit
                  model.pushEditOperations(
                    [],
                    [{ range, text: suggestion.replacement! }],
                    () => null
                  );
                }
              },
              suggestion.type === 'optimization' ? '🚀' : '🐛'
            )
          );
        }

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

              // For demonstration, remove this specific star
              if (inlineButtonsRef.current && monacoEditorRef.current) {
                // Remove the suggestion from the current list
                suggestionsRef.current = suggestionsRef.current.filter(
                  (s) => s.id !== suggestion.id
                );

                // Update decorations
                updateSuggestionDecorations(suggestionsRef.current);
                addInlineButtons(suggestionsRef.current);
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

      // Initial analysis
      setTimeout(() => {
        analyzeSuggestions();
      }, 500);

      initializedRef.current = true;

      // Cleanup
      return () => {
        clearTimeout(changeTimeout);
        clearTimeout(analysisTimeout);
        if (styleElement.parentNode) {
          styleElement.parentNode.removeChild(styleElement);
        }
        if (monacoEditorRef.current) {
          monacoEditorRef.current.dispose();
          monacoEditorRef.current = null;
          initializedRef.current = false;
        }
      };
    }
  }, [options]); // Only depend on options

  // Update the editor value when it changes externally
  useEffect(() => {
    if (monacoEditorRef.current && value !== valueRef.current) {
      // Only update if the difference is significant enough to warrant a refresh
      // This prevents unnecessary updates during typing
      if (
        Math.abs(value.length - valueRef.current.length) > 5 ||
        !value.includes(
          valueRef.current.substring(0, Math.min(20, valueRef.current.length))
        )
      ) {
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
    }
  }, [value]);

  return <div ref={editorRef} className="h-full w-full" />;
}

// Export memoized version to prevent unnecessary re-renders
export default memo(BaseMonacoEditor, (prevProps, nextProps) => {
  // Only re-render if these props actually change in a significant way
  return (
    prevProps.language === nextProps.language &&
    // For value changes, only re-render for significant changes
    (prevProps.value === nextProps.value ||
      Math.abs(prevProps.value?.length - nextProps.value?.length) < 10) &&
    prevProps.theme === nextProps.theme &&
    JSON.stringify(prevProps.options) === JSON.stringify(nextProps.options)
  );
});
