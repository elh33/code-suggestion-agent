'use client';

import type React from 'react';

import { useState, useEffect } from 'react';
import {
  FileCode,
  FolderOpen,
  Settings,
  Search,
  PanelLeft,
  Sparkles,
  MessageSquare,
  ChevronRight,
  ChevronDown,
  Save,
  Share2,
  Bell,
  File,
  Folder,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import LoadingScreen from '@/components/loading-screen';
import MonacoIntegration from './monaco-integration';

// Define types for our file system
interface FileItem {
  id: number;
  name: string;
  type: 'file';
  language?: string;
}

interface FolderItem {
  id: number;
  name: string;
  type: 'folder';
  children: (FileItem | FolderItem)[];
}

type FileSystemItem = FileItem | FolderItem;

// Type for AI suggestions
interface AISuggestion {
  id: number;
  type: string;
  code: string;
  explanation: string;
}

// Type for file contents
interface FileContents {
  [key: string]: string;
}

// Type for expanded items tracking
interface ExpandedItems {
  [key: number]: boolean;
}

export default function DashboardPage() {
  const [loading, setLoading] = useState<boolean>(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [aiPanelOpen, setAiPanelOpen] = useState<boolean>(true);
  const [currentFile, setCurrentFile] = useState<string>('main.js');
  const [fileContents, setFileContents] = useState<FileContents>({});
  const [expandedItems, setExpandedItems] = useState<ExpandedItems>({
    4: true,
    7: true,
  }); // Track expanded folders
  const [newItemType, setNewItemType] = useState<'file' | 'folder' | null>(
    null
  );
  const [newItemName, setNewItemName] = useState<string>('');
  const [newItemParentId, setNewItemParentId] = useState<number | null>(null);
  const [nextId, setNextId] = useState<number>(9); // For generating new file/folder IDs

  // Simulated files for the file explorer - now with state
  const [files, setFiles] = useState<FileSystemItem[]>([
    { id: 1, name: 'main.js', type: 'file', language: 'javascript' },
    { id: 2, name: 'index.html', type: 'file', language: 'html' },
    { id: 3, name: 'styles.css', type: 'file', language: 'css' },
    {
      id: 4,
      name: 'components',
      type: 'folder',
      children: [
        { id: 5, name: 'Button.jsx', type: 'file', language: 'javascript' },
        { id: 6, name: 'Card.jsx', type: 'file', language: 'javascript' },
      ],
    },
    {
      id: 7,
      name: 'utils',
      type: 'folder',
      children: [
        { id: 8, name: 'helpers.js', type: 'file', language: 'javascript' },
      ],
    },
  ]);

  // Simulated AI suggestions
  const aiSuggestions: AISuggestion[] = [
    {
      id: 1,
      type: 'completion',
      code: 'function calculateTotal(items) {\n  return items.reduce((sum, item) => sum + item.price, 0);\n}',
      explanation: 'Use Array.reduce() for a more concise implementation',
    },
    {
      id: 2,
      type: 'optimization',
      code: 'const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);',
      explanation:
        'Memoize this computation to prevent unnecessary recalculations',
    },
    {
      id: 3,
      type: 'bug',
      code: 'useEffect(() => {\n  // Effect code\n  return () => {\n    // Cleanup code\n  };\n}, [dependency]);',
      explanation: 'Add missing dependency to useEffect dependency array',
    },
  ];

  const finishLoading = () => {
    setLoading(false);
  };

  // Initialize file contents
  useEffect(() => {
    const initialContents: FileContents = {
      'main.js': `// Main application file
import { useState, useEffect } from 'react';

function App() {
  const [data, setData] = useState([]);
  
  useEffect(() => {
    // Fetch data from API
    fetch('https://api.example.com/data')
      .then(response => response.json())
      .then(result => setData(result));
  }, []);
  
  function calculateTotal(items) {
    let total = 0;
    for (let i = 0; i < items.length; i++) {
      total += items[i].price;
    }
    return total;
  }
  
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Total: {calculateTotal(data)}</p>
    </div>
  );
}

export default App;`,
      'index.html': `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>EnsaAi App</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div id="root"></div>
  <script src="main.js"></script>
</body>
</html>`,
      'styles.css': `body {
  font-family: 'Inter', sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f5f5f5;
}

#root {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  color: #333;
}`,
      'Button.jsx': `import React from 'react';

export default function Button({ children, onClick, variant = 'primary' }) {
  return (
    <button 
      className={\`btn btn-\${variant}\`} 
      onClick={onClick}
    >
      {children}
    </button>
  );
}`,
      'Card.jsx': `import React from 'react';

export default function Card({ title, children }) {
  return (
    <div className="card">
      {title && <div className="card-header">{title}</div>}
      <div className="card-body">
        {children}
      </div>
    </div>
  );
}`,
      'helpers.js': `// Utility functions

export function formatDate(date) {
  return new Date(date).toLocaleDateString();
}

export function truncateText(text, maxLength = 100) {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}`,
    };

    setFileContents(initialContents);
  }, []);

  // Enhanced language detection based on file extension
  const getFileLanguage = (filename: string): string => {
    const extension = filename.split('.').pop()?.toLowerCase() || '';
    const languageMap: Record<string, string> = {
      // JavaScript and TypeScript
      js: 'javascript',
      jsx: 'javascript',
      ts: 'typescript',
      tsx: 'typescript',

      // Web
      html: 'html',
      htm: 'html',
      css: 'css',
      scss: 'scss',
      less: 'less',

      // Data formats
      json: 'json',
      yaml: 'yaml',
      yml: 'yaml',

      // Markup
      md: 'markdown',
      markdown: 'markdown',

      // Programming languages
      py: 'python',
      rb: 'ruby',
      java: 'java',
      c: 'c',
      cpp: 'cpp',
      cs: 'csharp',
      go: 'go',
      rs: 'rust',
      php: 'php',

      // Shell
      sh: 'shell',
      bash: 'shell',

      // Config
      xml: 'xml',
      svg: 'xml',

      // Other
      sql: 'sql',
      graphql: 'graphql',
      gql: 'graphql',
    };

    return languageMap[extension] || 'plaintext';
  };

  // Handle file content change
  const handleEditorChange = (value: string) => {
    // Only update the state if the content actually changed
    if (fileContents[currentFile] !== value) {
      setFileContents((prev) => ({
        ...prev,
        [currentFile]: value,
      }));
    }
  };

  // Find file by name in the file structure
  const findFileByName = (
    name: string,
    fileList: FileSystemItem[] = files
  ): FileItem | null => {
    for (const file of fileList) {
      if (file.name === name && file.type === 'file') return file as FileItem;
      if (file.type === 'folder') {
        const found = findFileByName(name, (file as FolderItem).children);
        if (found) return found;
      }
    }
    return null;
  };

  // Get current file's language
  const getCurrentFileLanguage = (): string => {
    const file = findFileByName(currentFile);
    return file?.language || getFileLanguage(currentFile);
  };

  // Handle adding a suggestion to the current file
  const handleApplySuggestion = (suggestionCode: string) => {
    const currentContent = fileContents[currentFile] || '';
    setFileContents((prev) => ({
      ...prev,
      [currentFile]: currentContent + '\n\n' + suggestionCode,
    }));
  };

  // Create new file or folder
  const handleCreateItem = () => {
    if (!newItemName) return;

    if (newItemType === 'file') {
      const newFileName = newItemName.includes('.')
        ? newItemName
        : `${newItemName}.js`;
      const fileLanguage = getFileLanguage(newFileName);

      const newItem: FileItem = {
        id: nextId,
        name: newFileName,
        type: 'file',
        language: fileLanguage,
      };

      // Initialize content for new file
      setFileContents((prev) => ({
        ...prev,
        [newFileName]: `// ${newFileName}\n// Created on ${new Date().toLocaleString()}\n\n`,
      }));

      // Add to root or to a folder
      if (newItemParentId === null) {
        setFiles((prev) => [...prev, newItem]);
      } else {
        setFiles((prev) => {
          const updateChildren = (
            items: FileSystemItem[]
          ): FileSystemItem[] => {
            return items.map((item) => {
              if (item.id === newItemParentId && item.type === 'folder') {
                return {
                  ...item,
                  children: [...(item as FolderItem).children, newItem],
                };
              }
              if (item.type === 'folder') {
                return {
                  ...item,
                  children: updateChildren((item as FolderItem).children),
                };
              }
              return item;
            });
          };
          return updateChildren(prev);
        });

        // Ensure the parent folder is expanded
        setExpandedItems((prev) => ({
          ...prev,
          [newItemParentId]: true,
        }));
      }
    } else if (newItemType === 'folder') {
      const newItem: FolderItem = {
        id: nextId,
        name: newItemName,
        type: 'folder',
        children: [],
      };

      // Add to root or to a folder
      if (newItemParentId === null) {
        setFiles((prev) => [...prev, newItem]);
      } else {
        setFiles((prev) => {
          const updateChildren = (
            items: FileSystemItem[]
          ): FileSystemItem[] => {
            return items.map((item) => {
              if (item.id === newItemParentId && item.type === 'folder') {
                return {
                  ...item,
                  children: [...(item as FolderItem).children, newItem],
                };
              }
              if (item.type === 'folder') {
                return {
                  ...item,
                  children: updateChildren((item as FolderItem).children),
                };
              }
              return item;
            });
          };
          return updateChildren(prev);
        });

        // Ensure the parent folder is expanded
        setExpandedItems((prev) => ({
          ...prev,
          [newItemParentId]: true,
        }));
      }
    }

    // Reset form and increment ID counter
    setNewItemName('');
    setNewItemType(null);
    setNewItemParentId(null);
    setNextId((prev) => prev + 1);
  };

  // Handle adding a new item (file or folder)
  const handleAddItem = (type: 'file' | 'folder', parentId: number | null) => {
    setNewItemType(type);
    setNewItemParentId(parentId);
  };

  // Render file or folder in the explorer
  const renderFileExplorerItem = (item: FileSystemItem, depth = 0) => {
    const isExpanded = expandedItems[item.id] || false;

    const handleToggle = (e: React.MouseEvent) => {
      e.stopPropagation(); // Prevent event bubbling
      setExpandedItems((prev) => ({ ...prev, [item.id]: !prev[item.id] }));
    };

    if (item.type === 'folder') {
      return (
        <div key={item.id}>
          <div
            className="flex items-center py-1 px-2 hover:bg-gray-800/50 rounded cursor-pointer group"
            style={{ paddingLeft: `${depth * 12 + 8}px` }}
            onClick={handleToggle}
          >
            {isExpanded ? (
              <ChevronDown className="w-4 h-4 text-gray-400 mr-1" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-400 mr-1" />
            )}
            <FolderOpen className="w-4 h-4 text-indigo-400 mr-2" />
            <span className="text-gray-300 text-sm">{item.name}</span>

            {/* Add file/folder buttons (visible on hover) */}
            <div className="ml-auto hidden group-hover:flex items-center space-x-1">
              <button
                className="p-1 rounded hover:bg-gray-700"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddItem('file', item.id);
                }}
                title="Add file"
              >
                <File className="w-3 h-3 text-gray-400" />
              </button>
              <button
                className="p-1 rounded hover:bg-gray-700"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddItem('folder', item.id);
                }}
                title="Add folder"
              >
                <Folder className="w-3 h-3 text-gray-400" />
              </button>
            </div>
          </div>
          {isExpanded && (
            <div>
              {(item as FolderItem).children.map((child) =>
                renderFileExplorerItem(child, depth + 1)
              )}
            </div>
          )}
        </div>
      );
    } else {
      return (
        <div
          key={item.id}
          className={`flex items-center py-1 px-2 hover:bg-gray-800/50 rounded cursor-pointer ${
            currentFile === item.name ? 'bg-gray-800/70' : ''
          }`}
          style={{ paddingLeft: `${depth * 12 + 8}px` }}
          onClick={() => setCurrentFile(item.name)}
        >
          <FileCode className="w-4 h-4 text-gray-400 mr-2" />
          <span className="text-gray-300 text-sm">{item.name}</span>
        </div>
      );
    }
  };

  if (loading) {
    return <LoadingScreen finishLoading={finishLoading} />;
  }

  return (
    <div className="h-screen flex flex-col bg-[#0a0a12] text-white overflow-hidden">
      {/* Header */}
      <header className="h-14 border-b border-gray-800 flex items-center justify-between px-4">
        <div className="flex items-center">
          <div className="flex items-center mr-8">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mr-2">
              <span className="text-white font-bold text-lg">E</span>
            </div>
            <span className="font-bold text-lg">EnsaAi</span>
          </div>

          <nav className="hidden md:flex space-x-1">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white"
            >
              Projects
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white"
            >
              Templates
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white"
            >
              Community
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white"
            >
              Docs
            </Button>
          </nav>
        </div>

        <div className="flex items-center space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-400 hover:text-white"
                >
                  <Bell className="w-5 h-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Notifications</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Avatar className="w-8 h-8">
            <AvatarImage src="/placeholder.svg" alt="User" />
            <AvatarFallback className="bg-indigo-600">ME</AvatarFallback>
          </Avatar>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`border-r border-gray-800 flex flex-col ${
            sidebarCollapsed ? 'w-14' : 'w-64'
          } transition-all duration-300`}
        >
          {/* Sidebar header */}
          <div className="h-12 border-b border-gray-800 flex items-center justify-between px-4">
            {!sidebarCollapsed && <span className="font-medium">Explorer</span>}
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:text-white"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              <PanelLeft className="w-5 h-5" />
            </Button>
          </div>

          {/* Sidebar content */}
          <div className="flex-1 overflow-y-auto py-2">
            {!sidebarCollapsed && (
              <>
                <div className="px-3 mb-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <Input
                      placeholder="Search files..."
                      className="pl-8 bg-gray-800/50 border-gray-700 text-sm h-8"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between px-4 py-2">
                  <span className="text-xs font-medium text-gray-400 uppercase">
                    Files
                  </span>
                  <div className="flex space-x-1">
                    <Dialog
                      open={newItemType === 'file' && newItemParentId === null}
                      onOpenChange={(open) => !open && setNewItemType(null)}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-5 h-5 text-gray-400 hover:text-white"
                          onClick={() => handleAddItem('file', null)}
                        >
                          <File className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px] bg-gray-900 text-white border-gray-800">
                        <DialogHeader>
                          <DialogTitle>Create New File</DialogTitle>
                          <DialogDescription className="text-gray-400">
                            Enter a name for the new file
                          </DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                          <Input
                            placeholder="filename.js"
                            value={newItemName}
                            onChange={(e) => setNewItemName(e.target.value)}
                            className="bg-gray-800 border-gray-700 text-white"
                            autoFocus
                          />
                        </div>
                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={() => setNewItemType(null)}
                            className="border-gray-700 text-gray-300 hover:bg-gray-800"
                          >
                            Cancel
                          </Button>
                          <Button onClick={handleCreateItem}>Create</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    <Dialog
                      open={
                        newItemType === 'folder' && newItemParentId === null
                      }
                      onOpenChange={(open) => !open && setNewItemType(null)}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-5 h-5 text-gray-400 hover:text-white"
                          onClick={() => handleAddItem('folder', null)}
                        >
                          <Folder className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px] bg-gray-900 text-white border-gray-800">
                        <DialogHeader>
                          <DialogTitle>Create New Folder</DialogTitle>
                          <DialogDescription className="text-gray-400">
                            Enter a name for the new folder
                          </DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                          <Input
                            placeholder="folder-name"
                            value={newItemName}
                            onChange={(e) => setNewItemName(e.target.value)}
                            className="bg-gray-800 border-gray-700 text-white"
                            autoFocus
                          />
                        </div>
                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={() => setNewItemType(null)}
                            className="border-gray-700 text-gray-300 hover:bg-gray-800"
                          >
                            Cancel
                          </Button>
                          <Button onClick={handleCreateItem}>Create</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>

                <div className="px-1">
                  {files.map((item) => renderFileExplorerItem(item))}
                </div>

                {/* Dialog for creating files/folders inside folders */}
                <Dialog
                  open={newItemType !== null && newItemParentId !== null}
                  onOpenChange={(open) => !open && setNewItemType(null)}
                >
                  <DialogContent className="sm:max-w-[425px] bg-gray-900 text-white border-gray-800">
                    <DialogHeader>
                      <DialogTitle>
                        Create New {newItemType === 'file' ? 'File' : 'Folder'}
                      </DialogTitle>
                      <DialogDescription className="text-gray-400">
                        Enter a name for the new {newItemType}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                      <Input
                        placeholder={
                          newItemType === 'file' ? 'filename.js' : 'folder-name'
                        }
                        value={newItemName}
                        onChange={(e) => setNewItemName(e.target.value)}
                        className="bg-gray-800 border-gray-700 text-white"
                        autoFocus
                      />
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setNewItemType(null);
                          setNewItemParentId(null);
                        }}
                        className="border-gray-700 text-gray-300 hover:bg-gray-800"
                      >
                        Cancel
                      </Button>
                      <Button onClick={handleCreateItem}>Create</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </>
            )}
          </div>

          {/* Sidebar footer */}
          <div className="h-auto border-t border-gray-800 p-2">
            <div className="flex flex-col space-y-1">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-400 hover:text-white"
                    >
                      <Settings className="w-5 h-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side={sidebarCollapsed ? 'right' : 'top'}>
                    Settings
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Editor header */}
          <div className="h-10 border-b border-gray-800 flex items-center justify-between px-4">
            <div className="flex items-center">
              <span className="text-sm text-gray-300">{currentFile}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white"
              >
                <Save className="w-4 h-4 mr-1" />
                Save
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white"
              >
                <Share2 className="w-4 h-4 mr-1" />
                Share
              </Button>
            </div>
          </div>

          <div className="flex-1 flex overflow-hidden">
            {/* Editor area */}
            <div className="flex-1 overflow-hidden relative">
              {/* Monaco Editor integration */}
              <MonacoIntegration
                initialValue={fileContents[currentFile] || `// ${currentFile}`}
                language={getCurrentFileLanguage()}
                onChange={handleEditorChange}
              />
            </div>

            {/* AI suggestions panel */}
            <div
              className={`border-l border-gray-800 ${
                aiPanelOpen ? 'w-80' : 'w-0'
              } transition-all duration-300 flex flex-col overflow-hidden`}
            >
              {aiPanelOpen && (
                <>
                  <div className="h-10 border-b border-gray-800 flex items-center justify-between px-4">
                    <div className="flex items-center">
                      <Sparkles className="w-4 h-4 text-indigo-400 mr-2" />
                      <span className="font-medium text-sm">
                        AI Suggestions
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-400 hover:text-white"
                      onClick={() => setAiPanelOpen(false)}
                    >
                      <ChevronRight className="w-5 h-5" />
                    </Button>
                  </div>

                  <Tabs
                    defaultValue="suggestions"
                    className="flex-1 flex flex-col"
                  >
                    <TabsList className="grid grid-cols-2 mx-4 mt-2">
                      <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
                      <TabsTrigger value="chat">Chat</TabsTrigger>
                    </TabsList>

                    <TabsContent
                      value="suggestions"
                      className="flex-1 overflow-y-auto p-4 space-y-4"
                    >
                      {aiSuggestions.map((suggestion) => (
                        <div
                          key={suggestion.id}
                          className="rounded-lg border border-gray-800 overflow-hidden"
                        >
                          <div className="bg-gray-800/50 px-3 py-2 flex items-center justify-between">
                            <div className="flex items-center">
                              <Sparkles className="w-4 h-4 text-indigo-400 mr-2" />
                              <span className="text-sm font-medium capitalize">
                                {suggestion.type}
                              </span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 text-xs text-indigo-400 hover:text-indigo-300"
                              onClick={() =>
                                handleApplySuggestion(suggestion.code)
                              }
                            >
                              Apply
                            </Button>
                          </div>
                          <div className="p-3 bg-gray-900/50">
                            <pre className="text-xs text-gray-300 overflow-x-auto">
                              {suggestion.code}
                            </pre>
                          </div>
                          <div className="px-3 py-2 text-xs text-gray-400">
                            {suggestion.explanation}
                          </div>
                        </div>
                      ))}
                    </TabsContent>

                    <TabsContent value="chat" className="flex-1 flex flex-col">
                      <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        <div className="flex items-start space-x-2">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="bg-indigo-600 text-xs">
                              AI
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 bg-gray-800/50 rounded-lg p-3">
                            <p className="text-sm text-gray-300">
                              Hello! I'm your AI coding assistant. How can I
                              help you today?
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-gray-800 p-4">
                        <div className="relative">
                          <Input
                            placeholder="Ask a question..."
                            className="pr-10 bg-gray-800/50 border-gray-700"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-1 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                          >
                            <MessageSquare className="w-5 h-5" />
                          </Button>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </>
              )}

              {!aiPanelOpen && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-4 text-gray-400 hover:text-white"
                  onClick={() => setAiPanelOpen(true)}
                >
                  <Sparkles className="w-5 h-5" />
                </Button>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
