"use client";

import { useRouter } from "next/navigation";
import useAuthStore from "../store/useAuthStore";
import usePlayersStore from "@/store/usePlayersStore";
import { useSocket } from "../context/socketContext";
import { useEffect } from "react";

export default function PrimaryButton({ name, action, handleAction }) {
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
  const { handleUpdateRoom } = usePlayersStore();

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

  const createRoom = () => {
    return new Promise((resolve, reject) => {
      socket.emit('create-room', username, (error, response) => {
        console.log("Create Room Response:", response);
        if (response && !error) {
          resolve(response);
        } else {
          reject(error || "Failed to create room");
        }
      });
    });
  }

  const handleAddQuestionSocketResponse = (error, response) => {
    if (error) {
      console.error("Error adding question:", error.message);
    } else {
      console.log("Question added successfully:", response);
    }
  };

  const handleRedirect = async () => {
    try {
      if (action === "createRoom") {

        setIsHost(true);
        setShowEnterNameModal(true);

      } else if (action === "submitUsername") {

        setShowEnterNameModal(false);
        if (isHost) {
          setShowSelectQuestionsModal(true);
        } else {
          setShowGameIdModal(true);
        }

      } else if (action === "startGame") {

        router.push("/question");

      } else if (action === "selectQuestions") {

        const roomResponse = await createRoom(); // Wait for room creation to complete

        socket.on('update-room', async (users) => {
          console.log("Users updated:", users);
          handleUpdateRoom(users);
        });

        console.log("Room created:", roomResponse);
        setRoomCode(roomResponse.roomCode);
        setUserId(roomResponse.userId);

        console.log("Questions selected:", questionsSelected);

        socket.emit(
          "add-question",
          roomResponse.roomCode, // Ensure roomCode is obtained from the response
          questionsSelected,
          handleAddQuestionSocketResponse
        );

        router.push("/lobby");
        
      } else if (action === "answerQuestions") {
        router.push("/voting");
      } else {
        console.error("Invalid action provided:", action);
      }
    } catch (error) {
      console.error("Error during handleRedirect:", error);
    }
  };

  return (
    <div
      className="flex items-center justify-center w-8/12 h-16 py-2 text-3xl lg:text-5xl text-white bg-mid-blue font-mouse rounded-md z-10 cursor-pointer hover:border"
      onClick={action === "submitAnswers" || action === "enterGameId" ? handleAction : () => handleRedirect()}
    >
      {name}
    </div>
  );
}
