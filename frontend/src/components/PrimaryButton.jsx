'use client';

import { useRouter } from 'next/navigation';
import useAuthStore from '../store/useAuthStore';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000/');

export default function PrimaryButton({ name, action }) {
  const router = useRouter();
  const {
    isHost,
    setIsHost,
    setShowEnterNameModal,
    setShowSelectQuestionsModal,
    setShowGameIdModal,
    setShowStartGameModal,
    username,
    gameId,
    setGameId,
  } = useAuthStore();

  const generateUniqueGameId = () => {
    return Math.random().toString(36).substr(2, 9).toUpperCase();
  };

  const handleRedirect = () => {
    // If is a host then function
    if (action === 'createRoom') {
      const generatedGameId = generateUniqueGameId();
      setIsHost(true);
      setGameId(generatedGameId);
      setShowEnterNameModal(true);

      socket.emit('create-room', username, socket.id, generatedGameId, (response) => {
        if (response.error) {
          alert(response.error);
          setIsHost(false);
          setGameId('');
        }
      });

    } else if (action === 'submitUsername') {
      if (isHost) {
        setShowSelectQuestionsModal(true);
      } else {
        setShowGameIdModal(true);
      }
      setShowEnterNameModal(false);

    } else if (action === 'startGame') {
      setShowStartGameModal(false);
      socket.emit('start-game', gameId);
      router.push('/lobby');

    } else if (action === 'enterGameId') {
      setShowGameIdModal(false);
      router.push('/lobby');

    } else if (action === 'selectQuestions') {
      setShowSelectQuestionsModal(false);
      setShowStartGameModal(true);

    } else if (action === 'answerQuestions') {
      router.push('/voting')
    }
  }

  return (
    <div
      className='flex items-center justify-center w-8/12 h-16 py-2 text-3xl lg:text-5xl text-white bg-mid-blue font-mouse rounded-md z-10 cursor-pointer hover:border'
      onClick={() => handleRedirect()}
    >
      {name}
    </div>
  );
};
