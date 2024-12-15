'use client';

import { useEffect, useState } from 'react';
import { useSocket } from '@/context/socketContext';
import useAuthStore from '@/store/useAuthStore';
import PlayerSelectButton from '@/components/PlayerSelectButton';
import DecorativeShapesBackground from '@/components/DecorativeShapesBackground';

// Main Voting Page Component
export default function VotingPage() {
  const [ questionArr,  setQuestionArr ] = useState([]);
  const [ questionIndex, setQuestionIndex ] = useState(0);
  const [ questionStr, setQuestionStr ] = useState(`Who has the highest ${questionArr[questionIndex]}`);
  const [ player1, setPlayer1 ] = useState('');
  const [ player2, setPlayer2 ] = useState('');

  const socket = useSocket();
  const roomCode = useAuthStore();

  const handleChoosePlayer = (error, result) => {
    if (error) {
      console.error('Error occured when choosing two random players');
    } else {
      // if (result.status === 'PLAYER_SELECTED') {
      //   setPlayer1(result.player1);
      //   setPlayer2(result.player2);
      // }
      console.log(result);
    }
  }

  const choosePlayer = () => {
    // change this to roomCode later
    socket.emit('choose-players', 'HKMT', questionArr.questions[questionIndex]._id, handleChoosePlayer) 
    console.log(questionArr.questions[questionIndex]._id);
  }

  const reset = () => {
    setQuestionIndex(questionIndex => questionIndex + 1);
  }

  // To update question string when questionIndex increases
  useEffect(() => {
    if (questionArr.length !== 0) {
      setQuestionStr(`Who has the highest ${questionArr.questions[questionIndex].keyword}`);
      choosePlayer();
    }
  }, [questionIndex, questionArr])

  const handleStartGame = (error, result) => {
    if (error) {
      console.error('Could start game');
    } else {
      console.log('Game started successfully', result);
      setQuestionArr(result);
      console.log(result);
    }
  }

  useEffect(() => {
    console.log(roomCode);
    socket.emit('start-game', 'HKMT', handleStartGame);

    socket.on('display-questions', async ({questions}) => {
      console.log(questions)
      setQuestionArr(questions);
    })
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
        />
			</div>
        </div>
    </div>
  );
}