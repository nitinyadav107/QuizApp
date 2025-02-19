import React from 'react';
import { Trophy } from 'lucide-react';

export const ScoreBoard = ({ attempt, totalQuestions, onRetry }) => {
  const percentage = Math.round((attempt.score / totalQuestions) * 100);

  return (
    <div className="w-full max-w-md bg-white/95 backdrop-blur-sm rounded-xl shadow-xl p-8 text-center transform transition-all">
      <Trophy className="w-20 h-20 mx-auto mb-6 text-yellow-500 drop-shadow-md" />
      <h2 className="text-3xl font-bold mb-4 text-gray-800">Quiz Complete!</h2>
      <div className="text-5xl font-bold text-green-600 mb-6 drop-shadow-sm">
        {percentage}%
      </div>
      <p className="text-gray-600 mb-8 text-lg">
        You scored {attempt.score} out of {totalQuestions} questions correctly
      </p>
      <button
        onClick={onRetry}
        className="bg-green-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
      >
        Try Again
      </button>
    </div>
  );
};