'use client';

import { useRouter } from 'next/navigation';
import useAuthStore from '../store/useAuthStore';
import { useSocket } from '../context/socketContext';
import { useEffect } from 'react';

export default function PrimaryButton({ name, action }) {
  const socket = useSocket();
  const router = useRouter();
  const {
    isHost,
    username,
    setIsHost,
    setShowEnterNameModal,
    setShowSelectQuestionsModal,
    setShowGameIdModal,
    setRoomCode,
    setUserId,
    roomCode,
  } = useAuthStore();

  useEffect(() => {
    console.log('PrimaryButton mounted with:', name, action);
  }, [name, action]);

  const handleSocketResponse = (error, response) => {
    if (error) {
      console.error("Error creating room:", error.message);
    } else if (isHost) {
      console.log("Room created successfully:", response);
    } else {
      console.log("joined successfully:", response);
    }
    setRoomCode(response.roomCode);
    setUserId(response.userId);
  };

  const createRoom = () => {
    socket.emit('create-room', username, handleSocketResponse);
  }

  const joinRoom = () => {
    socket.emit('join-room', roomCode, username, handleSocketResponse);
  }

  const handleRedirect = () => {
    if (action === 'createRoom') {
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
      setShowGameIdModal(false);
      router.push('/lobby');
    } else if (action === 'selectQuestions') {
      createRoom();
      setShowSelectQuestionsModal(false);
      router.push('/lobby');
    } else if (action === 'answerQuestions') {
      router.push('/voting');
    } else {
      console.error('Invalid action provided:', action);
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
