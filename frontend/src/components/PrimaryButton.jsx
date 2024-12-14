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
    setShowStartGameModal,
  } = useAuthStore();

  useEffect(() => {
    console.log('PrimaryButton mounted with:', name, action);
  }, [name, action]);

  const handleSocketResponse = (error, response) => {
    if (error) {
        console.error("Error creating room:", error.message);
    } else {
        console.log("Room created successfully:", response);
        console.log("Room Code:", response.roomCode);
        console.log("User ID:", response.userId);
    }
  };

  const handleRedirect = () => {
    if (action === 'createRoom') {
      setIsHost(true);
      setShowEnterNameModal(true);
    } else if (action === 'submitUsername') {
      if (isHost) {
        setShowSelectQuestionsModal(true);
        socket.emit('create-room', username, handleSocketResponse);

      } else {
        setShowGameIdModal(true);
        socket.emit('join-room', roomCode, username, uid, handleSocketResponse);
        
      }
      setShowEnterNameModal(false);
    } else if (action === 'startGame') {
      setShowStartGameModal(false);
      router.push('/lobby');
    } else if (action === 'enterGameId') {
      setShowGameIdModal(false);
      router.push('/lobby');
    } else if (action === 'selectQuestions') {
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
