import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface OllieMessage {
  text: string;
  emoji: string;
  fact?: string;
}

interface OllieBubbleProps {
  message: OllieMessage | null;
  isVisible: boolean;
  onDismiss: () => void;
  position?: 'top-right' | 'bottom-center' | 'top-center';
}

const OllieBubble: React.FC<OllieBubbleProps> = ({
  message,
  isVisible,
  onDismiss,
  position = 'bottom-center',
}) => {
  const positionClasses = {
    'top-right': 'top-4 end-4 items-end',
    'bottom-center': 'bottom-4 start-0 end-0 items-center',
    'top-center': 'top-4 start-0 end-0 items-center',
  };

  return (
    <AnimatePresence>
      {isVisible && message && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.85 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className={`absolute z-50 flex flex-col pointer-events-none px-4 ${positionClasses[position]}`}
        >
          <div className="flex items-end gap-3 max-w-sm pointer-events-auto">
            {/* Ollie Avatar */}
            <motion.div
              animate={{ rotate: [-5, 5, -5], y: [0, -4, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="shrink-0"
            >
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 border-4 border-white shadow-xl flex items-center justify-center text-2xl">
                🦉
              </div>
            </motion.div>

            {/* Bubble */}
            <div className="relative bg-white dark:bg-gray-800 rounded-2xl rounded-bl-sm shadow-2xl border-2 border-yellow-300 dark:border-yellow-600 p-3 flex-1">
              {/* Dismiss button */}
              <button
                onClick={onDismiss}
                className="absolute top-2 end-2 text-gray-300 hover:text-gray-500 dark:hover:text-gray-300 transition-colors"
              >
                <X size={14} />
              </button>

              {/* Speech tail */}
              <div className="absolute bottom-3 -start-2 w-4 h-4 bg-white dark:bg-gray-800 border-l-2 border-b-2 border-yellow-300 dark:border-yellow-600 rotate-45" />

              <div className="flex items-start gap-2 pe-4">
                <span className="text-xl shrink-0">{message.emoji}</span>
                <p className="text-gray-800 dark:text-gray-200 font-semibold text-sm leading-snug">
                  {message.text}
                </p>
              </div>

              {/* Educational Fact */}
              {message.fact && (
                <div className="mt-2 pt-2 border-t border-yellow-200 dark:border-yellow-700">
                  <p className="text-xs text-yellow-700 dark:text-yellow-400 font-bold flex items-start gap-1">
                    <span className="shrink-0">💡</span>
                    <span>{message.fact}</span>
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OllieBubble;
