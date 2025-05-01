import { useState, useEffect } from 'react';
import { Check, X, AlertCircle, ChevronRight, ChevronLeft, RefreshCw } from 'lucide-react';

// Mock data (normally fetched from data.json)
const mockData = {
  "quizzes": [
    {
      "id": 1,
      "title": "Web Development Basics",
      "description": "Test your knowledge of HTML, CSS, and JavaScript fundamentals",
      "questions": [
        {
          "id": 1,
          "question": "Which HTML tag is used to define an internal style sheet?",
          "options": ["<script>", "<css>", "<style>", "<link>"],
          "correctAnswer": "<style>",
          "explanation": "The <style> tag is used to define style information for a single HTML page."
        },
        {
          "id": 2,
          "question": "Which CSS property is used to change the text color of an element?",
          "options": ["color", "text-color", "font-color", "textColor"],
          "correctAnswer": "color",
          "explanation": "The color property is used to set the color of the text."
        },
        {
          "id": 3,
          "question": "What is the correct JavaScript syntax to change the content of an HTML element with id='demo'?",
          "options": [
            "document.getElement('demo').innerHTML = 'Hello';", 
            "document.getElementById('demo').innerHTML = 'Hello';", 
            "#demo.innerHTML = 'Hello';", 
            "document.getElementByName('demo').innerHTML = 'Hello';"
          ],
          "correctAnswer": "document.getElementById('demo').innerHTML = 'Hello';",
          "explanation": "The getElementById() method returns the element that has the ID attribute with the specified value."
        }
      ]
    },
    {
      "id": 2,
      "title": "React Fundamentals",
      "description": "Test your knowledge of React.js core concepts",
      "questions": [
        {
          "id": 1,
          "question": "What is JSX in React?",
          "options": [
            "A JavaScript library", 
            "A syntax extension for JavaScript that looks similar to HTML", 
            "A testing framework for React", 
            "A build tool"
          ],
          "correctAnswer": "A syntax extension for JavaScript that looks similar to HTML",
          "explanation": "JSX stands for JavaScript XML. It allows us to write HTML in React and makes it easier to write and add HTML in React."
        },
        {
          "id": 2,
          "question": "In React, what is used to pass data to a component from outside?",
          "options": ["setState", "render with arguments", "props", "PropTypes"],
          "correctAnswer": "props",
          "explanation": "Props (short for properties) are used to pass data from one component to another in React."
        },
        {
          "id": 3,
          "question": "What is the correct way to update the state in a React component?",
          "options": [
            "this.state = {count: this.state.count + 1}", 
            "this.state.count = this.state.count + 1", 
            "this.setState({count: this.state.count + 1})", 
            "this.setCount(this.state.count + 1)"
          ],
          "correctAnswer": "this.setState({count: this.state.count + 1})",
          "explanation": "The setState() method is used to update the state in a React component. Direct state mutation should be avoided."
        }
      ]
    }
  ]
};

// // In a real app, you would fetch this data
// const fetchData = () => {
//   // This would normally be a fetch request to your data.json
//   return fetch('/data.json').then(response => response.json());
//   return new Promise((resolve) => {
//     setTimeout(() => resolve(mockData), 500); // Simulate network request
//   });
// };
const fetchData = () => {
    return fetch('/data.json')
      .then(response => response.json())
      .catch(error => {
        console.error('Error loading quiz data:', error);
        throw error;
      });
  };

export default function QuizHome() {
  const [quizzes, setQuizzes] = useState([]);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchData();
        setQuizzes(data.quizzes);
        setLoading(false);
      } catch (error) {
        console.error('Error loading quiz data:', error);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const startQuiz = (quiz) => {
    setCurrentQuiz(quiz);
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowResults(false);
    setIsAnswered(false);
    setSelectedOption(null);
  };

  const handleOptionSelect = (option) => {
    if (isAnswered) return; // Prevent changing answer after submission
    setSelectedOption(option);
  };

  const handleSubmitAnswer = () => {
    if (!selectedOption || isAnswered) return;
    
    const currentQuestion = currentQuiz.questions[currentQuestionIndex];
    const isCorrect = selectedOption === currentQuestion.correctAnswer;
    
    if (isCorrect) {
      setScore(score + 1);
    }
    
    setIsAnswered(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < currentQuiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowResults(true);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedOption(null);
      setIsAnswered(false);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setShowResults(false);
  };

  const returnToMenu = () => {
    setCurrentQuiz(null);
    setShowResults(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-indigo-950">
        <div className="text-blue-200 text-xl font-semibold">Loading QuizTechie...</div>
      </div>
    );
  }

  if (!currentQuiz) {
    return (
      <div className="min-h-screen bg-indigo-950 text-blue-100 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-blue-200 mb-8 text-center">
            QuizTechie
          </h1>
          <p className="text-blue-300 text-center mb-12">Select a quiz to start testing your knowledge</p>
          
          <div className="grid gap-6 md:grid-cols-2">
            {quizzes.map((quiz) => (
              <div 
                key={quiz.id} 
                className="bg-indigo-900 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer border border-indigo-700 hover:border-blue-400"
                onClick={() => startQuiz(quiz)}
              >
                <h2 className="text-2xl font-semibold text-blue-200 mb-2">{quiz.title}</h2>
                <p className="text-blue-300 mb-4">{quiz.description}</p>
                <p className="text-sm text-blue-400">{quiz.questions.length} questions</p>
                <button 
                  className="mt-4 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
                  onClick={() => startQuiz(quiz)}
                >
                  Start Quiz
                  <ChevronRight size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (showResults) {
    const totalQuestions = currentQuiz.questions.length;
    const percentage = Math.round((score / totalQuestions) * 100);
    
    return (
      <div className="min-h-screen bg-indigo-950 text-blue-100 p-8">
        <div className="max-w-2xl mx-auto bg-indigo-900 rounded-lg p-8 shadow-lg">
          <h1 className="text-3xl font-bold text-blue-200 mb-8 text-center">
            Quiz Results
          </h1>
          
          <div className="text-center mb-8">
            <div className="text-6xl font-bold text-blue-200 mb-2">{percentage}%</div>
            <p className="text-xl text-blue-300">You got {score} out of {totalQuestions} questions correct</p>
          </div>
          
          <div className="flex flex-col space-y-4 mt-8">
            <button 
              onClick={resetQuiz}
              className="bg-blue-600 hover:bg-blue-500 text-white py-3 px-6 rounded-md flex items-center justify-center gap-2 transition-colors"
            >
              <RefreshCw size={18} />
              Try Again
            </button>
            <button 
              onClick={returnToMenu}
              className="bg-indigo-700 hover:bg-indigo-600 text-white py-3 px-6 rounded-md flex items-center justify-center gap-2 transition-colors"
            >
              Return to Menu
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = currentQuiz.questions[currentQuestionIndex];
  
  return (
    <div className="min-h-screen bg-indigo-950 text-blue-100 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <header className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-blue-200 mb-2">{currentQuiz.title}</h1>
          <div className="flex justify-between items-center">
            <p className="text-blue-300">
              Question {currentQuestionIndex + 1} of {currentQuiz.questions.length}
            </p>
            <button 
              onClick={returnToMenu}
              className="text-blue-400 hover:text-blue-300 text-sm"
            >
              Exit Quiz
            </button>
          </div>
        </header>
        
        <div className="bg-indigo-900 rounded-lg p-6 shadow-lg mb-6">
          <h2 className="text-xl font-semibold mb-6">
            {currentQuestion.question}
          </h2>
          
          <div className="space-y-3 mb-8">
            {currentQuestion.options.map((option, index) => (
              <div 
                key={index}
                onClick={() => handleOptionSelect(option)}
                className={`p-4 rounded-md cursor-pointer flex items-start transition-colors ${
                  selectedOption === option 
                    ? isAnswered 
                      ? option === currentQuestion.correctAnswer 
                        ? 'bg-green-800 border-green-500 border' 
                        : 'bg-red-800 border-red-500 border'
                      : 'bg-blue-700 border-blue-500 border' 
                    : isAnswered && option === currentQuestion.correctAnswer
                      ? 'bg-green-800 border-green-500 border'
                      : 'bg-indigo-800 hover:bg-indigo-700 border border-indigo-700'
                }`}
              >
                <div className="flex-1">
                  {option}
                </div>
                {isAnswered && option === currentQuestion.correctAnswer && (
                  <Check className="text-green-400 ml-2 flex-shrink-0" size={20} />
                )}
                {isAnswered && selectedOption === option && option !== currentQuestion.correctAnswer && (
                  <X className="text-red-400 ml-2 flex-shrink-0" size={20} />
                )}
              </div>
            ))}
          </div>

          {isAnswered && (
            <div className="bg-indigo-800 border-l-4 border-blue-400 p-4 rounded-md mb-6">
              <div className="flex items-start">
                <AlertCircle className="text-blue-400 mr-2 flex-shrink-0" size={20} />
                <div>
                  <h3 className="font-semibold text-blue-300 mb-1">Explanation:</h3>
                  <p className="text-blue-200">{currentQuestion.explanation}</p>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex justify-between">
            <button 
              onClick={handlePrevQuestion}
              disabled={currentQuestionIndex === 0}
              className={`flex items-center gap-1 px-4 py-2 rounded-md transition-colors ${
                currentQuestionIndex === 0 
                  ? 'bg-indigo-800 text-indigo-400 cursor-not-allowed' 
                  : 'bg-indigo-700 hover:bg-indigo-600 text-white'
              }`}
            >
              <ChevronLeft size={18} />
              Previous
            </button>
            
            {!isAnswered ? (
              <button 
                onClick={handleSubmitAnswer}
                disabled={!selectedOption}
                className={`px-4 py-2 rounded-md transition-colors ${
                  !selectedOption 
                    ? 'bg-indigo-800 text-indigo-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-500 text-white'
                }`}
              >
                Submit Answer
              </button>
            ) : (
              <button 
                onClick={handleNextQuestion}
                className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md flex items-center gap-1 transition-colors"
              >
                {currentQuestionIndex < currentQuiz.questions.length - 1 ? 'Next' : 'See Results'}
                <ChevronRight size={18} />
              </button>
            )}
          </div>
        </div>
        
        <div className="flex justify-between items-center bg-indigo-900 p-4 rounded-lg">
          <div className="text-sm">
            <span className="text-blue-400">Score: </span>
            <span className="text-blue-200 font-semibold">{score}/{currentQuestionIndex + (isAnswered ? 1 : 0)}</span>
          </div>
          <div className="flex space-x-2">
            <div className="h-2 bg-indigo-800 rounded-full w-48">
              <div 
                className="h-2 bg-blue-500 rounded-full" 
                style={{ width: `${((currentQuestionIndex + (isAnswered ? 1 : 0)) / currentQuiz.questions.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}