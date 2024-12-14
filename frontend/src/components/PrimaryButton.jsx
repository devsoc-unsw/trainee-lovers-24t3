"use client";

import { useRouter } from "next/navigation";
import useAuthStore from "../store/useAuthStore";
import usePlayersStore from "@/store/usePlayersStore";
import { useSocket } from "../context/socketContext";
import { useEffect } from "react";

export default function PrimaryButton({ name, action }) {
  const socket = useSocket();
  const router = useRouter();

  const {
    isHost,
    username,
    questionsSelected,
    setIsHost,
    setShowEnterNameModal,
    setShowSelectQuestionsModal,
    setShowGameIdModal,
    setRoomCode,
    setUserId,
    roomCode,
  } = useAuthStore();
  const { setPlayers} = usePlayersStore();

  useEffect(() => {
    console.log("PrimaryButton mounted with:", name, action);
  }, [name, action]);

  const handleSocketResponse = (error, response) => {
    if (error) {
      console.error("Error creating room:", error.message);
      return;
    } else if (isHost) {
      console.log("Room created successfully:", response);
    } else {
      console.log("joined successfully:", response);
      setShowGameIdModal(false);
      router.push('/lobby');
    }
    setRoomCode(response.roomCode);
    setUserId(response.userId);
  };

  const handleUpdateRoom = (userDetails) => {
    setPlayers(userDetails.map(u => u.username))
  }

  const createRoom = () => {
    socket.emit('create-room', username, handleSocketResponse);
    socket.on('update-room', handleUpdateRoom)
  }

  const joinRoom = () => {
    socket.emit('join-room', roomCode, username, handleSocketResponse);
    socket.on('update-room', handleUpdateRoom)
  }

  const handleAddQuestionSocketResponse = (error, response) => {
    if (error) {
      console.error("Error adding question:", error.message);
    } else {
      console.log("Question added successfully:", response);
    }
  };

  const handleRedirect = () => {
    if (action === "createRoom") {
      setIsHost(true);
      setShowEnterNameModal(true);
    } else if (action === 'submitUsername') {
      setShowEnterNameModal(false);
      if (isHost) {
        setShowSelectQuestionsModal(true);
      } else {
        setShowGameIdModal(true);
      }
    } else if (action === 'startGame') {
      router.push('/question');
    } else if (action === 'enterGameId') {
      joinRoom();
    } else if (action === 'selectQuestions') {
      createRoom();
      socket.emit(
        "add-question",
        roomCode,
        questionsSelected,
        handleAddQuestionSocketResponse
      );
      router.push("/lobby");
    } else if (action === "answerQuestions") {
      router.push("/voting");
    } else {
      console.error("Invalid action provided:", action);
    }
  };

  return (
    <div
      className="flex items-center justify-center w-8/12 h-16 py-2 text-3xl lg:text-5xl text-white bg-mid-blue font-mouse rounded-md z-10 cursor-pointer hover:border"
      onClick={handleRedirect}
    >
      {name}
    </div>
  );
}
