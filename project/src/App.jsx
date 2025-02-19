import React, { useState, useEffect } from 'react';
import { QuestionCard } from './components/QuestionCard';
import { QuizTimer } from './components/QuizTimer';
import { ScoreBoard } from './components/ScoreBoard';
import { AttemptHistory } from './components/AttemptHistory';
import { questions } from './data/questions';
import { QuizDB } from './utils/db';

const SECONDS_PER_QUESTION = 30;
const db = new QuizDB();

function App() {
  const [isStarted, setIsStarted] = useState(false); 
 
  const [quizState, setQuizState] = useState({
    currentQuestionIndex: 0,
    answers: [],
    timeRemaining: SECONDS_PER_QUESTION,
    isComplete: false,
    startTime: null,
  });
  const [attempts, setAttempts] = useState([]);
  const [currentAttempt, setCurrentAttempt] = useState(null);

  useEffect(() => {
    db.init().then(() => {
      db.getAttempts().then(setAttempts);
    });
  }, []);

  useEffect(() => {
    if (!isStarted || quizState.isComplete) return;

    const timer = setInterval(() => {
      setQuizState((prev) => ({
        ...prev,
        timeRemaining: Math.max(0, prev.timeRemaining - 1),
      }));
    }, 1000);

    return () => clearInterval(timer);
  }, [isStarted, quizState.isComplete]);

  const handleStart = () => {
    setIsStarted(true);
    setQuizState({
      currentQuestionIndex: 0,
      answers: [],
      timeRemaining: SECONDS_PER_QUESTION,
      isComplete: false,
      startTime: Date.now(),
    });
  };

  const handleAnswer = (answerIndex) => {
    const newAnswers = [...quizState.answers];
    newAnswers[quizState.currentQuestionIndex] = answerIndex;

    setTimeout(() => {
      if (quizState.currentQuestionIndex < questions.length - 1) {
        setQuizState({
          ...quizState,
          currentQuestionIndex: quizState.currentQuestionIndex + 1,
          answers: newAnswers,
          timeRemaining: SECONDS_PER_QUESTION,
        });
      } else {
        const score = newAnswers.reduce((acc, answer, index) => {
          return answer === questions[index].correctAnswer ? acc + 1 : acc;
        }, 0);

        const attempt = {
          id: Date.now().toString(),
          date: new Date().toISOString(),
          score,
          timePerQuestion: {},
        };

        setCurrentAttempt(attempt);
        db.saveAttempt(attempt).then(() => {
          setAttempts((prev) => [...prev, attempt]);
        });

        setQuizState({
          ...quizState,
          answers: newAnswers,
          isComplete: true,
        });
      }
    }, 1500);
  };

  const handleTimeUp = () => {
    handleAnswer(-1);
  };

  const handleRetry = () => {
    setIsStarted(false);
    setCurrentAttempt(null);
  };

  const currentQuestion = questions[quizState.currentQuestionIndex];

  return (
    <div className="min-h-screen quiz-background">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4 drop-shadow-sm">
            Fast Quiz
          </h1>

          {!isStarted ? (
            <button
              onClick={handleStart}
              className="bg-green-500 text-white px-6 py-3 rounded-lg text-xl font-semibold hover:bg-green-600 transition"
            >
              Start Quiz
            </button>
          ) : (
            !quizState.isComplete && (
              <div className="flex justify-center mb-4 gap-8">
                <div className="text-center text-lg font-medium text-gray-700">
                  Question {quizState.currentQuestionIndex + 1} of {questions.length}
                </div>
                <QuizTimer timeRemaining={quizState.timeRemaining} onTimeUp={handleTimeUp} />
              </div>
            )
          )}
        </div>

        {isStarted && (
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              {!quizState.isComplete ? (
                <>
                 
                  <QuestionCard
                    question={currentQuestion}
                    selectedAnswer={quizState.answers[quizState.currentQuestionIndex] ?? null}
                    onSelectAnswer={handleAnswer}
                    showFeedback={quizState.answers[quizState.currentQuestionIndex] !== undefined}
                  />
                </>
              ) : currentAttempt ? (
                <ScoreBoard attempt={currentAttempt} totalQuestions={questions.length} onRetry={handleRetry} />
              ) : null}
            </div>

            <div className="w-full md:w-1/3 h-[400px] overflow-y-auto bg-white shadow-md rounded-lg p-4">
              {attempts.length > 0 ? (
                <AttemptHistory attempts={attempts} totalQuestions={questions.length} />
              ) : (
                <p className="text-gray-500 text-center">No attempts yet.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
