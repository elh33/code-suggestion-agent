'use client';

import { useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import Monaco Editor to avoid SSR issues
const MonacoEditor = dynamic(() => import('./monaco-editor'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-[#0a0a12]">
      <div className="text-gray-400">Loading editor...</div>
    </div>
  ),
});

interface MonacoIntegrationProps {
  initialValue: string;
  language?: string;
  onChange?: (value: string) => void;
}

export default function MonacoIntegration({
  initialValue,
  language = 'javascript',
  onChange,
}: MonacoIntegrationProps) {
  // Use a ref to track if this is the initial render
  const isInitialMount = useRef(true);

  // Use a ref to store the current value to avoid unnecessary re-renders
  const valueRef = useRef(initialValue);

  // Update the ref when initialValue changes (for file switching)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // Only update when switching files, not during typing
    valueRef.current = initialValue;
  }, [initialValue]);

  const handleEditorChange = (value: string) => {
    valueRef.current = value;
    if (onChange) {
      onChange(value);
    }
  };

  return (
    <div className="h-full w-full">
      <MonacoEditor
        value={valueRef.current}
        language={language}
        onChange={handleEditorChange}
      />
    </div>
  );
}
