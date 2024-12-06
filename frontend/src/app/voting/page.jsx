import React from 'react'
import PlayerSelectButton from '@/components/PlayerSelectButton'
import DecorativeShapesBackground from '@/components/DecorativeShapesBackground';

// Main Voting Page Component
export default function VotingPage() {
    const name1 = "Kelly";
    const name2 = "Agus";
    const questionStr = "Who has the highest WAM?";

  return (
    <div className='relative h-screen bg-gray-100'>
        
		{/* Decortaing shaeps */}
		<DecorativeShapesBackground/>
        <div className="absolute inset-0 flex flex-col justify-center items-center p-4">

			{/* Title */}
			<h1 className="text-3xl md:text-5xl font-bold text-gray-800 mb-6">
				{questionStr}
			</h1>

			{/* Buttons */}
			<div className="flex flex-col gap-4 justify-center items-center">
				<PlayerSelectButton name={name1} color="blue" />
				<div className="relative">
				<div className="absolute -top-5 -left-1/2 transform -translate-x-1/2 bg-white text-black w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg">
				{/* <div className="absolute -top-5 bg-white text-black w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg"> */}
					VS
				</div>
				</div>
				<PlayerSelectButton name={name2} color="red" />
			</div>
        </div>
    </div>
  );
}