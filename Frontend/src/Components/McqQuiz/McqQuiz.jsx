// import React, { useState } from 'react';
// import './McqQuiz.css';

// const questions = [
//   {
//     question: "What is the capital of France?",
//     options: ["Berlin", "Madrid", "Paris", "Rome"],
//     answer: "Paris",
//   },
//   {
//     question: "Which planet is known as the Red Planet?",
//     options: ["Earth", "Mars", "Jupiter", "Saturn"],
//     answer: "Mars",
//   },
//   {
//     question: "What is the largest ocean on Earth?",
//     options: ["Atlantic", "Indian", "Arctic", "Pacific"],
//     answer: "Pacific",
//   },
//   {
//     question: "Who wrote 'Romeo and Juliet'?",
//     options: ["Shakespeare", "Dickens", "Hemingway", "Austen"],
//     answer: "Shakespeare",
//   },
//   {
//     question: "What is the smallest country in the world?",
//     options: ["Monaco", "San Marino", "Vatican City", "Liechtenstein"],
//     answer: "Vatican City",
//   },
// ];

// const MCQQuiz = () => {
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [selectedAnswer, setSelectedAnswer] = useState(null);
//   const [score, setScore] = useState(0);
//   const [quizComplete, setQuizComplete] = useState(false);
//   const [answerFeedback, setAnswerFeedback] = useState('');

//   const handleAnswerSelection = (answer) => {
//     setSelectedAnswer(answer);
//     setAnswerFeedback('');
//   };

//   const handleNextQuestion = () => {
//     if (selectedAnswer === questions[currentQuestionIndex].answer) {
//       setScore(score + 1);
//       setAnswerFeedback('correct');
//     } else {
//       setAnswerFeedback('incorrect');
//     }
//     setSelectedAnswer(null);

//     if (currentQuestionIndex < questions.length - 1) {
//       setCurrentQuestionIndex(currentQuestionIndex + 1);
//     } else {
//       setQuizComplete(true);
//     }
//   };

//   return (
//     <div className="quiz-container">
//       <h2 className='h2 quiz'>Interactive Quiz</h2>

//       {!quizComplete ? (
//         <div className="question-container">
//           <div className="question">
//             <h3>{questions[currentQuestionIndex].question}</h3>
//             <div className="options">
//               {questions[currentQuestionIndex].options.map((option, index) => (
//                 <div
//                   key={index}
//                   className={`option ${selectedAnswer === option ? 'selected' : ''} ${answerFeedback ? answerFeedback : ''}`}
//                   onClick={() => handleAnswerSelection(option)}
//                 >
//                   {option}
//                 </div>
//               ))}
//             </div>
//             <button onClick={handleNextQuestion} disabled={!selectedAnswer} className='button quiz'>
//               Next Question
//             </button>
//           </div>
//         </div>
//       ) : (
//         <div className="result">
//           <h3>Quiz Complete!</h3>
//           <p>Your Score: {score} / {questions.length}</p>
//           <button onClick={() => window.location.reload()}>Try Again</button>
//         </div>
//       )}

//       <div className="progress-bar">
//         <div className="progress" style={{ width: `${(currentQuestionIndex + 1) / questions.length * 100}%` }}></div>
//       </div>
//     </div>
//   );
// };

// export default MCQQuiz;

import React, { useEffect, useState } from "react";
import "./McqQuiz.css";
import "/Tick.mp4";

const questions = [
  {
    question: "What is the capital of France?",
    options: ["Berlin", "Madrid", "Paris", "Rome"],
    answer: "Paris",
  },
  {
    question: "Which planet is known as the Red Planet?",
    options: ["Earth", "Mars", "Jupiter", "Saturn"],
    answer: "Mars",
  },
  {
    question: "What is the largest ocean on Earth?",
    options: ["Atlantic", "Indian", "Arctic", "Pacific"],
    answer: "Pacific",
  },
  {
    question: "Who wrote 'Romeo and Juliet'?",
    options: ["Shakespeare", "Dickens", "Hemingway", "Austen"],
    answer: "Shakespeare",
  },
  {
    question: "What is the smallest country in the world?",
    options: ["Monaco", "San Marino", "Vatican City", "Liechtenstein"],
    answer: "Vatican City",
  },
];

const MCQQuiz = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);
  const [answerSubmitted, setAnswerSubmitted] = useState(false);
  const [answerFeedback, setAnswerFeedback] = useState("");
  const [ques,setQues]=useState([])

  const fetchQuiz=async()=>{
    try {
      const response=await axios.get("http://localhost:7000/api/quiz/getquiz");
      if(response.data.success)
      {
         setQues(response.data.data)
      }
      else{
        console.log(response.data)
      }
    } catch (error) {
       console.log(error);
    }
  }

  useEffect(()=>{
      fetchQuiz()
  },[])

  const handleAnswerSelection = (answer) => {
    if (!answerSubmitted) {
      setSelectedAnswer(answer);
      setAnswerFeedback("");
    }
  };

  const handleSubmit = () => {
    if (selectedAnswer === questions[currentQuestionIndex].answer) {
      setScore(score + 1);
      setAnswerFeedback("correct");
    } else {
      setAnswerFeedback("incorrect");
    }
    setAnswerSubmitted(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setAnswerSubmitted(false);
      setAnswerFeedback("");
    } else {
      setQuizComplete(true);
    }
  };

  return (
      ques && <div className="quiz-container">
      <h2 className="h2 quiz">Interactive Quiz</h2>

      {!quizComplete ? (
        <div className="question-container">
          <div className="question">
            <h3>{questions[currentQuestionIndex].question}</h3>
            <div className="options">
              {questions[currentQuestionIndex].options.map((option, index) => (
                <div
                  key={index}
                  className={`option ${
                    selectedAnswer === option ? "selected" : ""
                  } ${
                    answerSubmitted &&
                    option === questions[currentQuestionIndex].answer
                      ? "correct"
                      : ""
                  } ${
                    answerSubmitted &&
                    selectedAnswer === option &&
                    selectedAnswer !== questions[currentQuestionIndex].answer
                      ? "incorrect"
                      : ""
                  }`}
                  onClick={() => handleAnswerSelection(option)}
                >
                  {option}
                  {answerSubmitted && option === questions[currentQuestionIndex].answer && (
                    <video className="tick-animation" src="/Tick.mp4" autoPlay loop />
                  )}
                </div>
              ))}
            </div>
            {!answerSubmitted ? (
              <button
                onClick={handleSubmit}
                disabled={!selectedAnswer}
                className="button quiz"
              >
                Submit
              </button>
            ) : (
              <button onClick={handleNextQuestion} className="button quiz">
                Next Question
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="result">
          <h3>Thank You for Completing the Quiz!</h3>
          <p>
            Your Score: {score} / {questions.length}
          </p>
          <button onClick={() => window.location.reload()}>Try Again</button>
        </div>
      )}

      <div className="progress-bar">
        <div
          className="progress"
          style={{
            width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
          }}
        ></div>
      </div>
    </div>
  );
};

export default MCQQuiz;
