import React, { useState } from "react";

export default function QuestionBox({ question }) {
  // const [answer, setAnswer] = useState("");
  return (
    <div className="bg-[#A1CDF7] w-[350px] h-[120px] rounded-[30px] content-center text-center shadow-md shadow-[#01136F] p-2 font-mouse">
      <div className="text-3xl text-[#01136F]">
        <p>{question}</p>
      </div>
      <div className="w-[100%]">
        <input
          placeholder="Enter your answer..."
          type="text"
          id="outlined-basic"
          label="Outlined"
          variant="outlined"
          className="rounded-[30px] w-[290px] h-[43px] px-2 mt-2 text-center text-xl"
          // onChange={(event) => {
          //   setAnswer(event.target.value);
          // }}
        />
      </div>
    </div>
  );
}
