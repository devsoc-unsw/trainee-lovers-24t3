import React from "react";

// question has fields: id, questionContent
export default function QuestionBox({ question, setAnswers }) {
  return (
    <div className="flex-1 bg-[#A1CDF7] w-[350px] h-[150px] rounded-[30px] content-center text-center shadow-md shadow-[#01136F] p-3 font-mouse">
      <div className="text-3xl text-[#01136F]">
        <p>{question.questionContent}</p>
      </div>
      <div className="w-[100%] h-full">
        <input
          placeholder="Enter your answer..."
          type="text"
          id="outlined-basic"
          label="Outlined"
          variant="outlined"
          className="rounded-[30px] w-[290px] h-[43px] px-2 mt-2 text-center text-xl"
          onChange={(event) => {
            const value = event.target.value;
            setAnswers((prev) => ({
              ...prev,
              [question._id]: value,
            }));
          }}
        />
      </div>
    </div>
  );
}
