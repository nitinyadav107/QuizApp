import React, { useState, useEffect } from "react";

export const QuestionCard = ({ question, onSelectAnswer }) => {
  const [selectedIndex, setSelectedIndex] = useState(null);

  
  useEffect(() => {
    setSelectedIndex(null);
  }, [question]);

  const handleAnswerSelection = (index) => {
    if (selectedIndex !== null) return; 

    setSelectedIndex(index);
    onSelectAnswer(index);
  };

  return (
    <div className="w-full max-w-2xl bg-white/95 backdrop-blur-sm rounded-xl shadow-xl p-8 transition-all ">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">{question.text}</h2>
      <div className="space-y-4">
        {question.options.map((option, index) => {
          let buttonClass = "w-full p-4 text-left rounded-lg transition-all transform hover:scale-[1.01] ";

          if (selectedIndex !== null) {
            if (index === selectedIndex) {
              buttonClass += index === question.correctAnswer ? " bg-green-500" : " bg-red-500";
            } else if (index === question.correctAnswer) {
              buttonClass += " bg-green-500"; 
            }
          } else {
            buttonClass += " hover:bg-gray-300 active:bg-gray-500";
          }

          return (
            <button
              key={index}
              onClick={() => handleAnswerSelection(index)}
              className={buttonClass}
              disabled={selectedIndex !== null} 
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
};
