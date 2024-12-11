'use client'

import { useRouter } from 'next/navigation';
import useAuthStore from '../store/useAuthStore';

export default function PrimaryButton({ name, action }) {
  const router = useRouter();
  const { isHost ,setIsHost , setShowEnterNameModal, setShowSelectQuestionsModal, 
    setShowGameIdModal, setShowStartGameModal } = useAuthStore();

  const handleRedirect = () => {
    // If is a host then function
    if (action === 'createRoom') {
      setIsHost(true);
      setShowEnterNameModal(true);
    } else if (action === 'submitUsername') {
      if (isHost) {
        setShowSelectQuestionsModal(true);
      } else {
        setShowGameIdModal(true);
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
