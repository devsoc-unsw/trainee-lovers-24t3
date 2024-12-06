'use client'

import { useState } from 'react';
import QuestionBox from '@/components/QuestionBox';
import DecorativeShapesBackground from '@/components/DecorativeShapesBackground';
import PrimaryButton from '@/components/PrimaryButton';

const Page = () => {
  // To be deleted 
  const questionArray = [
    'Your WAM', 
    'Body count?',
    'How many exes?',
    'Kiss count?'
  ]

  return (
    <div className='flex w-full h-screen bg-white text-center text-black text-3xl'>
      <DecorativeShapesBackground />
      <div className='absolute inset-0 flex flex-col justify-center items-center gap-3'>
        <h2 className='text-5xl text-[#8093F1] mb-3'>QUESTIONS</h2>
        {questionArray.map((question, i) => {
          return <QuestionBox question={question} key={i}/>
        })}
        <PrimaryButton name='SUBMIT ANSWER' action='answerQuestions' className='mt-3'/>
      </div>
    </div>
  )
}

export default Page;