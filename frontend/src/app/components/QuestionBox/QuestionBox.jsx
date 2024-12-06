import React from "react";
import { Inter } from "next/font/google";

export default function QuestionBox({ question }) {
  // const handleChange = (event) => {
  //   setAnswer(event.target);
  // };

  return (
    <div className="bg-[#A1CDF7] w-[350px] h-[120px] rounded-[30px] content-center text-center shadow-md shadow-[#01136F] p-2">
      <div className="text-2xl text-[#01136F]">
        <p>{question}</p>
      </div>
      <div className="w-[100%]">
        <input
          type="text"
          id="outlined-basic"
          label="Outlined"
          variant="outlined"
          className="rounded-[30px] w-[290px] h-[43px] px-2 mt-2"
          // onchange={handleChange}
        />
      </div>
    </div>
  );
}
