import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuestionContext } from "../context/questionContext";

export const Quiz = () => {
  const navigate = useNavigate();
  const { apiData, limit } = useQuestionContext();
  const [answerCount, setAnswerCount] = useState(0);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null);
  const [correctSelect, setCorrectSelect] = useState(0);

  useEffect(() => {
    if (apiData.length < 1) {
      navigate("/");
    }
  }, [answerCount, limit]);

  // Checks the choosen answer that true or false
  const checkAnswer = (selectedAnswer, correctAnswer, i) => {
    setSelectedAnswerIndex(i);
    if (selectedAnswer === correctAnswer) {
      setIsCorrect(true);
      setIsChecked(true);
      setCorrectSelect((prev) => prev + 1);
    } else {
      setIsCorrect(false);
      setIsChecked(true);
    }
  };

  // Moving on the next question
  const nextQuestion = () => {
    setIsChecked(false);
    setAnswerCount((prev) => prev + 1);
    setSelectedAnswerIndex(null);
  };

  const QuestionCardHeader = (props) => {
    const DifficultyColor = () => {
      const difficulty = props.questionDifficulty;
      if (difficulty === "easy") {
        return "text-green-500";
      } else if (difficulty === "medium") {
        return "text-yellow-500";
      }
      return "text-red-500";
    };

    return (
      <div className="absolute top-0 flex h-[50px] w-full items-center justify-around rounded-t-lg bg-blue-500/30">
        <button className="hover:underline" onClick={() => navigate("/")}>
          Cancel
        </button>
        <h1 className="text-lg text-neutral-100">{props.questionCategory}</h1>
        <div className="flex items-center">
          <p>
            {answerCount + 1}/{limit}
          </p>
          <p className={`mx-2 font-bold uppercase ${DifficultyColor()}`}>
            {props.questionDifficulty}
          </p>
        </div>
      </div>
    );
  };

  const Question = (props) => {
    return <h1 className="my-6 text-center text-3xl">{props.question}</h1>;
  };

  const Answer = (props) => {
    return (
      <div
        onClick={props.event}
        className={`flex h-fit w-full cursor-pointer items-center justify-center bg-neutral-900/20 p-2 text-neutral-100 shadow-lg hover:bg-neutral-900/60 ${
          isChecked && selectedAnswerIndex === props.idx
            ? isCorrect
              ? "border-2 border-green-500"
              : "border-2 border-red-500"
            : ""
        }${
          isChecked && props.answer === props.correctAnswer
            ? "border-2 border-green-500"
            : ""
        }`}
      >
        {props.answer}
      </div>
    );
  };

  const NextButton = () => {
    return (
      <button
        disabled={isChecked ? false : true}
        onClick={nextQuestion}
        className={`mt-4 w-full rounded-lg lg:w-[50%] ${
          isChecked ? "bg-blue-400" : "bg-neutral-400"
        } p-2 text-neutral-100 shadow-lg ${
          isChecked ? "hover:bg-blue-600" : ""
        }`}
      >
        Next
      </button>
    );
  };

  const QuizSection = () => {
    return (
      <>
        {apiData.map((data) => {
          return (
            answerCount === data.questionNumber && (
              <div
                key={data.questionNumber}
                className="relative flex h-[95%] w-[90%] flex-col items-center justify-center rounded-xl border border-blue-400 p-2 shadow-xl lg:w-[50%]"
              >
                <QuestionCardHeader
                  questionDifficulty={data.questionDifficulty}
                  questionCategory={data.questionCategory}
                />
                <Question question={data.question} />
                <div className="grid w-full grid-cols-1 items-center gap-4 justify-self-center text-center sm:grid-cols-2 lg:w-[80%]">
                  {data.answers.map((answer, idx) => {
                    return (
                      <Answer
                        event={() => {
                          !isChecked &&
                            checkAnswer(answer, data.correctAnswer, idx);
                        }}
                        idx={idx}
                        answer={answer}
                        correctAnswer={data.correctAnswer}
                      />
                    );
                  })}
                </div>
                <NextButton />
              </div>
            )
          );
        })}
      </>
    );
  };

  const ResultSection = () => {
    const ResultColor = () => {
      const result = (correctSelect / answerCount) * 100;
      if (result <= 25) {
        return "text-red-500";
      } else if (result <= 50) {
        return "text-yellow-500";
      } else if (result <= 75) {
        return "text-blue-500";
      } else {
        return "text-green-500";
      }
    };

    return (
      <div className="flex h-[50%] w-full flex-col items-center justify-center">
        <h1 className="text-4xl font-bold text-red-400 drop-shadow-lg">
          Game Over
        </h1>
        <p className="mt-4 text-2xl text-neutral-100 drop-shadow-lg">Result</p>
        <p className={`mt-6 text-6xl font-bold ${ResultColor()}`}>
          {correctSelect}/{answerCount}
        </p>
        <button
          onClick={() => {
            navigate("/");
          }}
          className="mt-4 w-[50%] rounded-lg bg-blue-500 py-2 text-xl text-neutral-100 shadow-lg"
        >
          New Game
        </button>
      </div>
    );
  };

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center">
      {limit == answerCount ? <ResultSection /> : <QuizSection />}
    </div>
  );
};
