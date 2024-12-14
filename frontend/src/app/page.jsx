"use client";

import useAuthStore from "@/store/useAuthStore";
import PrimaryButton from "../components/PrimaryButton";
import SecondaryButton from "../components/SecondaryButton";
import StartGameModal from "../components/StartGameModal";
import DecorativeShapesBackground from "@/components/DecorativeShapesBackground";
import EnterNameModal from "@/components/EnterNameModal";
import GameIdModal from "@/components/GameIdModal";
import SelectQuestionsModal from "@/components/SelectQuestionsModal";

export default function Page() {
  const { showEnterNameModal, showGameIdModal, showStartGameModal, showSelectQuestionsModal } = useAuthStore();

  return (
    <div className="flex relative flex-col w-full h-screen bg-white items-center justify-center gap-5">
      <DecorativeShapesBackground />
      <div className="absolute inset-0 flex items-center justify-center">
        {showEnterNameModal && <EnterNameModal />}
        {showGameIdModal && <GameIdModal />}
        {showSelectQuestionsModal && <SelectQuestionsModal />}
        {!showEnterNameModal && !showGameIdModal && !showSelectQuestionsModal && !showStartGameModal && (
          <div className="flex flex-col w-full md:w-1/3 gap-2 items-center justify-center">
            <PrimaryButton name="HOST" action="createRoom" />
            <SecondaryButton name="JOIN" action="joinRoom" />
          </div>
        )}
      </div>
    </div>
  );
}
