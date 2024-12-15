'use client';

import { useEffect, useState } from 'react';
import { useSocket } from '@/context/socketContext';
import useAuthStore from '@/store/useAuthStore';
import PlayerSelectButton from '@/components/PlayerSelectButton';
import DecorativeShapesBackground from '@/components/DecorativeShapesBackground';
import useQuestionStore from '@/store/useQuestionStore';

// Main Voting Page Component
export default function VotingPage() {
  const { questionArr } = useQuestionStore();
  const [ questionIndex, setQuestionIndex ] = useState(0);
  const [ questionStr, setQuestionStr ] = useState(`Who has the highest ${questionArr[questionIndex]}`);
  const [ player1, setPlayer1 ] = useState('');
  const [ player2, setPlayer2 ] = useState('');
  const [ winner, setWinner ] = useState('');

  const socket = useSocket();
  const roomCode = useAuthStore();
  const userId = useAuthStore();

  const reset = () => {
    setQuestionIndex(questionIndex => questionIndex + 1);
  }

  // To update question string when questionIndex increases
  useEffect(() => {
    if (questionArr.length !== 0) {
      setQuestionStr(`Who has the highest ${questionArr.questions[questionIndex].keyword}`);
    }
  }, [questionIndex, questionArr])

  useEffect(() => {
    console.log(roomCode);
    socket.on('next-question', (data) => {
      console.log('Next question received:', data);
      const { luhWinner, questionId } = data;
      console.log('Winner:', luhWinner, 'Next Question ID:', questionId);
      setWinner(luhWinner);
      // just do like a text saying winner of this round is
      // winner!
    });

    // Handle 'end-game' event
    socket.on('end-game', () => {
      console.log('Game has ended');
    });

    // Handle 'display-results' event
    socket.on('display-results', (data) => {
      console.log('Results received:', data);
      const { resultPlayer1, resultPlayer2 } = data;
      console.log('Player 1:', player1, 'Player 2:', player2);
      setPlayer1(resultPlayer1);
      setPlayer2(resultPlayer2);
    });
  }, [])

  return (
    <div className='relative h-screen bg-white'>
        
		{/* Decortaing shaeps */}
		<DecorativeShapesBackground/>
      <div className="absolute inset-0 flex flex-col justify-center items-center p-4">

			{/* Title */}
			<h1 className="text-3xl md:text-5xl font-bold text-gray-800 mb-6">
				{questionStr}
			</h1>

			{/* Buttons */}
			<div className="flex flex-col gap-4 justify-center items-center">
				<PlayerSelectButton 
          name={player1} 
          color="blue"
          roomCode={roomCode}
          qid={questionArr.questions[questionIndex].qid}
          pid={userId}
          response={0}
        />
				<div className="relative">
				<div className="absolute -top-5 -left-1/2 transform -translate-x-1/2 bg-white text-black w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg">
				{/* <div className="absolute -top-5 bg-white text-black w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg"> */}
					VS
				</div>
				</div>
				<PlayerSelectButton 
          name={player2} 
          color="red" 
          roomCode={roomCode}
          qid={questionArr.questions[questionIndex].qid}
          pid={userId}
          response={1}
        />
			</div>
        </div>
    </div>
  );
}