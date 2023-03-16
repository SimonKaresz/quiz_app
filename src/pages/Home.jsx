import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CategoryOptions, Difficultyoptions } from "../assets/data";
import Select from "react-select";
import Axios from "axios";
import { useQuestionContext } from "../context/questionContext";

export const Home = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [difficulty, setDifficulty] = useState("");
  const { limit, setLimit, setApiData } = useQuestionContext();

  const handleSelect = (e) => {
    setSelectedCategory(e.map((data) => data.value));
  };

  const handleRange = (e) => {
    setLimit(e.target.value);
  };

  const handleDifficulty = (e) => {
    setDifficulty(e.value);
  };

  const handleStart = () => {
    Axios.get(
      `https://the-trivia-api.com/api/questions?${
        selectedCategory.length >= 1 ? "categories=" : ""
      }${selectedCategory.toString()}&limit=${limit}&${
        difficulty.length > 0 ? "difficulty=" : ""
      }${difficulty}`
    )
      .then((res) => {
        setApiData(
          res.data.map((object, index) => {
            return {
              questionNumber: index,
              questionCategory: object.category,
              questionDifficulty: object.difficulty,
              question: object.question,
              answers: object.incorrectAnswers
                .concat(object.correctAnswer)
                .sort(),
              correctAnswer: object.correctAnswer,
            };
          })
        );
        navigate("/quiz");
      })
      .catch((err) => console.error("Error message:", err));
  };

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="flex h-[95%] w-[90%] flex-col items-center justify-evenly rounded-lg border-2 border-blue-300 bg-neutral-800/10 py-2 px-4 text-neutral-50 drop-shadow-xl lg:w-[50%]">
        <h1 className="text-center text-3xl font-bold text-blue-400">
          New Game
        </h1>
        <div className="w-full">
          <p>Select Category(s)</p>
          <Select
            onChange={handleSelect}
            isMulti
            name="Category"
            options={CategoryOptions}
            className="text-black"
            classNamePrefix="select"
          />
        </div>
        <div className="w-full">
          <p>Select Difficulty</p>
          <Select
            className="text-black"
            classNamePrefix="select"
            isSearchable={true}
            name="color"
            options={Difficultyoptions}
            onChange={handleDifficulty}
          />
        </div>
        <div className="w-full">
          <p>Select Question Limit</p>
          <input
            type="range"
            onChange={handleRange}
            className="w-full"
            min={1}
            max={20}
            step={1}
            value={limit}
          />
          <span>Limit: {limit}</span>
        </div>
        <button
          onClick={handleStart}
          className="w-full rounded-lg bg-blue-500/80 py-2 drop-shadow-lg hover:bg-blue-500"
        >
          Start
        </button>
      </div>
    </div>
  );
};
