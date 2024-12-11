"use client";

import React, { useRef, useEffect, useState } from "react";
import PrimaryButton from "../components/PrimaryButton";
import SecondaryButton from "../components/SecondaryButton";
import StartGameModal from "../components/StartGameModal";
import useAuthStore from "../store/useAuthStore";
import DecorativeShapesBackground from "@/components/DecorativeShapesBackground";
import EnterNameModal from "@/components/EnterNameModal";
import SelectQuestionsModal from "@/components/SelectQuestionsModal";

export default function Page() {
  const { isHost, hasPickedRole } = useAuthStore();

  return (
    <div className="flex relative flex-col w-full h-screen bg-white items-center justify-center gap-5">
      <DecorativeShapesBackground />
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {isHost && hasPickedRole ? (
          <StartGameModal />
        ) : hasPickedRole ? (
          <EnterNameModal />
        ) : (
          <div className="flex flex-col w-full md:w-1/3 gap-2 items-center justify-center">
            <PrimaryButton name="HOST" action="createRoom" />
            <SecondaryButton name="JOIN" action="joinRoom" />
          </div>
        )}
      </div>
    </div>
  );
}
