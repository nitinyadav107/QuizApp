import React, { useEffect } from 'react';
import { Timer } from 'lucide-react';

export const QuizTimer = ({ timeRemaining, onTimeUp }) => {
  useEffect(() => {
    if (timeRemaining <= 0) {
      onTimeUp();
    }
  }, [timeRemaining, onTimeUp]);

  return (
    <div className="flex items-center gap-2 text-lg font-semibold">
      <Timer className="w-6 h-6" />
      <span>{Math.max(0, timeRemaining)}s</span>
    </div>
  );
};