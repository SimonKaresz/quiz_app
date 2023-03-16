import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { App } from "./App";
import { QuestionContextProvider } from "./context/questionContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QuestionContextProvider>
      <App />
    </QuestionContextProvider>
  </React.StrictMode>
);
