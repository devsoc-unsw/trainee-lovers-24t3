'use client';

import { useEffect, useState } from 'react';
import { useSocket } from '@/context/socketContext';
import useAuthStore from '@/store/useAuthStore';
import PlayerSelectButton from '@/components/PlayerSelectButton';
import DecorativeShapesBackground from '@/components/DecorativeShapesBackground';
import useQuestionStore from '@/store/useQuestionStore';
import usePlayersStore from '@/store/usePlayersStore';

// Main Voting Page Component
export default function VotingPage() {
  const { questionStore } = useQuestionStore();
  const [ questionIndex, setQuestionIndex ] = useState(0);
  const [ questionStr, setQuestionStr ] = useState(`Who has the higher ${questionStore[questionIndex].keyword}`);
  const {firstPlayer, setFirstPlayer, secondPlayer, setSecondPlayer} = usePlayersStore();
  // const [ firstPlayer, setFirstPlayer ] = useState(first);
  // const [ secondPlayer, setSecondPlayer ] = useState('');
  const [ winner, setWinner ] = useState('');
  const [ topText, setTopText ] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const socket = useSocket();
  const {roomCode, userId} = useAuthStore();

  const reset = () => {
    setQuestionIndex(questionIndex => questionIndex + 1);
  }

  // To update question string when questionIndex increases
  useEffect(() => {
    if (questionStore.length !== 0) {
      setQuestionStr(`Who has the higher ${questionStore[questionIndex].keyword}`);
    }
  }, [questionIndex, questionStore])

  useEffect(() => {
    console.log(roomCode);
    socket.on('next-question', (data) => {
      console.log('Next question received:', data);
      const { winner, player1, player2 } = data;
      console.log('Winner:', winner);
      console.log('Player 1:', player1, 'Player 2:', player2);
      setFirstPlayer(player1);
      setSecondPlayer(player2);
      setWinner(winner);
      setIsModalOpen(true)
      reset();

      setTopText('The winner of the previous question was:');
      setWinner(winner);
      // just do like a text saying winner of this round is
      // winner!
    });

    // Handle 'end-game' event
    socket.on('end-game', () => {
      console.log('Game has ended');
      setTopText('Game has ended');
      setWinner('');
      setIsModalOpen(true);
    });

    // Handle 'display-results' event
    socket.on('display-results', (data) => {
      console.log('Results received:', data);
      const { resultPlayer1, resultPlayer2 } = data;
      console.log('Player 1:', firstPlayer, 'Player 2:', secondPlayer);
      setFirstPlayer(resultPlayer1);
      setSecondPlayer(resultPlayer2);
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
          name={firstPlayer} 
          roomCode={roomCode}
          qid={questionStore[questionIndex]._id}
          pid={userId}
          response={0}
          color="blue"
        />
				<div className="relative">
				<div className="absolute -top-5 -left-1/2 transform -translate-x-1/2 bg-white text-black w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg">
				{/* <div className="absolute -top-5 bg-white text-black w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg"> */}
					VS
				</div>
				</div>
				<PlayerSelectButton 
          name={secondPlayer} 
          roomCode={roomCode}
          qid={questionStore[questionIndex]._id}
          pid={userId}
          response={1}
          color="red" 
        />
			</div>
    </div>
    {/* Winner Modal */}
    {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg p-6 shadow-lg text-center">
            <h2 className="text-2xl font-bold mb-4">{topText}</h2>
            <p className="text-xl">{winner}</p>
            <button
              className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600"
              onClick={() => setIsModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}