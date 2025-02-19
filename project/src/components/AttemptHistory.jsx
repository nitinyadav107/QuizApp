import React from 'react';
import { History } from 'lucide-react';

export const AttemptHistory = ({ attempts, totalQuestions }) => {
  // Sort attempts by latest time first
  const sortedAttempts = [...attempts].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="w-full max-w-md">
      <div className="flex items-center gap-3 mb-6">
        <History className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-800">Attempt History</h2>
      </div>
      <div className="space-y-4">
        {sortedAttempts.map((attempt) => (
          <div
            key={attempt.id}
            className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-5 transition-all hover:shadow-xl"
          >
            <div className="flex justify-between items-center">
              <span className="text-gray-600 font-medium">
                {new Date(attempt.date).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}{' '}
                | {new Date(attempt.date).toLocaleTimeString(undefined, {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true,
                })}
              </span>
              <span className="font-semibold text-lg">
                Score: {attempt.score}/{totalQuestions}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
