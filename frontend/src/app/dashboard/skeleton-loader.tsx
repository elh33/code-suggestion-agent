'use client';

import React from 'react';

interface SkeletonLoaderProps {
  height?: string;
  width?: string;
}

export default function SkeletonLoader({
  height = '100vh',
  width = '100%',
}: SkeletonLoaderProps) {
  return (
    <div
      className="skeleton-loader bg-[#0a0a12] animate-pulse"
      style={{ height, width }}
    >
      <div className="flex h-full w-full items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="rounded-md bg-gray-800 h-6 w-32"></div>
          <div className="flex space-x-2">
            <div
              className="rounded-full bg-indigo-800/50 h-3 w-3 animate-bounce"
              style={{ animationDelay: '0ms' }}
            ></div>
            <div
              className="rounded-full bg-indigo-800/50 h-3 w-3 animate-bounce"
              style={{ animationDelay: '150ms' }}
            ></div>
            <div
              className="rounded-full bg-indigo-800/50 h-3 w-3 animate-bounce"
              style={{ animationDelay: '300ms' }}
            ></div>
          </div>
          <div className="text-gray-500 text-sm">Loading editor...</div>
        </div>
      </div>
    </div>
  );
}
