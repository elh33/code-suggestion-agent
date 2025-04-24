'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingScreenProps {
  finishLoading: () => void;
}

export default function LoadingScreen({ finishLoading }: LoadingScreenProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading(false);
      setTimeout(finishLoading, 1000); // Allow exit animation to complete
    }, 2500); // Show loading screen for 2.5 seconds

    return () => clearTimeout(timeout);
  }, [finishLoading]);

  return (
    <AnimatePresence mode="wait">
      {isLoading && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0a12]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative flex flex-col items-center">
            {/* Logo animation */}
            <div className="relative w-32 h-32 mb-8">
              {/* Orbiting particles */}
              <div className="absolute inset-0">
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1.5 h-1.5 rounded-full bg-indigo-500"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0] }}
                    style={{
                      top: '50%',
                      left: '50%',
                      transformOrigin: '0 0',
                      rotate: `${i * 30}deg`,
                      translateX: '0px',
                      translateY: '-40px',
                    }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      delay: i * 0.15,
                      ease: 'easeInOut',
                    }}
                  />
                ))}
              </div>

              {/* Central logo */}
              <motion.div
                className="absolute top-1/2 left-1/2 w-16 h-16 -ml-8 -mt-8 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500"
                initial={{ rotate: 0, scale: 0.8 }}
                animate={{ rotate: 360, scale: [0.8, 1, 0.8] }}
                transition={{
                  rotate: {
                    duration: 10,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: 'linear',
                  },
                  scale: {
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: 'easeInOut',
                  },
                }}
              >
                <div className="absolute inset-[3px] rounded-lg bg-[#0a0a12] flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">E</span>
                </div>
              </motion.div>

              {/* Pulsing ring */}
              <motion.div
                className="absolute top-1/2 left-1/2 w-24 h-24 -ml-12 -mt-12 rounded-full border-2 border-purple-500/30"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1.2, opacity: [0, 0.5, 0] }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: 'easeOut',
                }}
              />
              <motion.div
                className="absolute top-1/2 left-1/2 w-24 h-24 -ml-12 -mt-12 rounded-full border-2 border-indigo-500/30"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1.2, opacity: [0, 0.5, 0] }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: 'easeOut',
                  delay: 0.5,
                }}
              />
            </div>

            {/* Text animation */}
            <motion.div
              className="flex items-center space-x-1"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <motion.span className="text-3xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
                Ensa
              </motion.span>
              <motion.span
                className="text-3xl font-bold text-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.3 }}
              >
                Ai
              </motion.span>
            </motion.div>

            {/* Loading text */}
            <motion.div
              className="mt-4 text-gray-400 text-sm flex items-center space-x-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
            >
              <span>Initializing AI</span>
              <div className="flex space-x-1">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-1 h-1 rounded-full bg-purple-400"
                    animate={{ opacity: [0.4, 1, 0.4], scale: [0.8, 1.2, 0.8] }}
                    transition={{
                      duration: 1,
                      repeat: Number.POSITIVE_INFINITY,
                      delay: i * 0.2,
                    }}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
