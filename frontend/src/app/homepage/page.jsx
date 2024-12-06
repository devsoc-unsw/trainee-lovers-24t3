"use client";

import React, { useRef, useEffect } from "react";
import PrimaryButton from "../components/PrimaryButton/PrimaryButton";
import QuestionBox from "../components/QuestionBox/QuestionBox";

export default function Page() {
  return (
    <>
      <div>page</div>
      <PrimaryButton link="youtube.com" name="HOST" />
      <QuestionBox question={"hello?"}></QuestionBox>
    </>
  );
}
