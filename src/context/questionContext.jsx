import { createContext, useContext, useState } from "react";

export const QuestionContext = createContext({
  apiData: [],
  setApiData: () => {},
  limit: 5,
  setLimit: () => {},
});

export const useQuestionContext = () => useContext(QuestionContext);

export const QuestionContextProvider = ({ children }) => {
  const [apiData, setApiData] = useState([]);
  const [limit, setLimit] = useState(5);
  return (
    <QuestionContext.Provider
      value={{
        apiData,
        setApiData,
        limit,
        setLimit,
      }}
    >
      {children}
    </QuestionContext.Provider>
  );
};
