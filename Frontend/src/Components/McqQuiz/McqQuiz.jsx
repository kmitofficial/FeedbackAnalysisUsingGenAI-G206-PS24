import React, { useEffect, useState } from "react";
import "./McqQuiz.css";
import "/Tick.mp4";
import axios from "axios";

const MCQQuiz = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);
  const [answerSubmitted, setAnswerSubmitted] = useState(false);
  const [answerFeedback, setAnswerFeedback] = useState("");
  const [questions, setQues] = useState([]);
  const [tryAgain,setTryAgain]=useState(false)

  const fetchQuiz = async () => {
    try {
      const response = await axios.get("http://localhost:7000/api/quiz/getquiz");
      if (response.data.success) {
        const allQuestions = response.data.data;

        // Shuffle and select 7 random questions
        const shuffledQuestions = allQuestions.sort(() => Math.random() - 0.5);
        const randomQuestions = shuffledQuestions.slice(0, 7);

        setQues(randomQuestions);

        console.log("questions:",questions)
      } else {
        console.log(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchQuiz();
  }, [tryAgain]);

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

  return questions.length > 0 ? (
    <div className="quiz-container">
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
        <div style={{display:'flex',flexDirection:'column',gap:'20px',alignItems:'center'}}>
          <h3>Thank You for Completing the Quiz!</h3>
          <p>
            Your Score: {score} / {questions.length}
          </p>
          <button style={{fontSize:'17px'}} onClick={()=>{
            setTryAgain((prev) => !prev); // Toggle tryAgain to trigger fetchQuiz
            setQuizComplete(false); // Reset quiz completion status
            setCurrentQuestionIndex(0); // Reset question index
            setScore(0); // Reset score
            setSelectedAnswer(null); // Clear selected answer
            setAnswerSubmitted(false); // Reset answer submission state
            setAnswerFeedback(""); // Clear feedback
          }}>Try Again</button>
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
  ) : (
    <div>Loading...</div>
  );
};

export default MCQQuiz;
