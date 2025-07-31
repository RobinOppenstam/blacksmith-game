// src/components/ErrorDisplay.tsx
'use client';

import React from 'react';
import { AlertCircle, X, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameError, getErrorMessage } from '@/lib/errorHandling';

interface ErrorDisplayProps {
  error: GameError | null;
  onDismiss?: () => void;
  onRetry?: () => void;
}

export function ErrorDisplay({ error, onDismiss, onRetry }: ErrorDisplayProps) {
  if (!error) return null;

  const { title, message, action } = getErrorMessage(error);
  const isWarning = error.type === 'IPFS_ERROR';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        className={`p-4 rounded-lg border ${
          isWarning 
            ? 'bg-yellow-500/10 border-yellow-500/30' 
            : 'bg-red-500/10 border-red-500/30'
        }`}
      >
        <div className="flex items-start">
          <AlertCircle className={`h-5 w-5 mr-3 flex-shrink-0 mt-0.5 ${
            isWarning ? 'text-yellow-400' : 'text-red-400'
          }`} />
          
          <div className="flex-1 min-w-0">
            <h4 className={`font-medium ${
              isWarning ? 'text-yellow-200' : 'text-red-200'
            }`}>
              {title}
            </h4>
            <p className="text-sm text-gray-300 mt-1">{message}</p>
            {action && (
              <p className="text-xs text-gray-400 mt-2">{action}</p>
            )}
            
            {onRetry && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onRetry}
                className="mt-3 text-sm text-amber-400 hover:text-amber-300 flex items-center"
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                Try Again
              </motion.button>
            )}
          </div>
          
          {onDismiss && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onDismiss}
              className="text-gray-400 hover:text-gray-300"
            >
              <X className="h-4 w-4" />
            </motion.button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}