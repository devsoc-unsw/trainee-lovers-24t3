import React from "react";
import QuestionBox from "../components/QuestionBox/QuestionBox";

export default function Page() {
  return (
    <div className="h-screen w-screen pt-5 flex justify-center">
      <QuestionBox question={"What was the question?"}></QuestionBox>
			<QuestionBox question={"What was the question 2?"}></QuestionBox>
			<QuestionBox question={"What was the question 3?"}></QuestionBox>
    </div>
  );
}
