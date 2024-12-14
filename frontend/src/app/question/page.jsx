'use client'

import { useState } from 'react';
import useAuthStore from '@/store/useAuthStore';
import QuestionBox from '@/components/QuestionBox';
import DecorativeShapesBackground from '@/components/DecorativeShapesBackground';
import PrimaryButton from '@/components/PrimaryButton';
import { useSocket } from '@/context/socketContext';

const Page = () => {
  // To be deleted 
  const socket = useSocket();
  // const questionArray = [
  //   'Your WAM', 
  //   'Body count?',
  //   'How many exes?',
  //   'Kiss count?'
  // ]

  // an array of questions
  // question has fields: qId, questionStr
  const { userId, roomCode } = useAuthStore();

  const questionArray = [
    {_id: 1, questionContent: 'Your WAM'},
    {_id: 2, questionContent: 'Body count?'},
    {_id: 3, questionContent: 'How many exes?'},
    {_id: 4, questionContent: 'Kiss count?'}
  ]

  const [answers, setAnswers] = useState({});

  const handleSubmitAnswer = () => {
      // send question responses to frontend
      // convert answers to an array of questionAnswer objects, each with fields: qId, answer
      // send to backend

      const questionAnswers = [];
      // for each question in questionArray, add an object to answers array
      // each questionAnswer should have fields: "qid", "response"
      questionArray.forEach(question => {
        const qid = question._id;
        const answer = answers[qid];
        questionAnswers.push({qid: qid, response: answer});
      });

      socket.emit('save-question', questionAnswers, userId, roomCode)
  }

  return (
    <div className='flex w-full h-screen bg-white text-center text-black text-3xl'>
      <DecorativeShapesBackground />
      <div className='absolute inset-0 flex flex-col justify-center items-center gap-3 w-full p-4'>
          <h2 className='text-5xl text-[#8093F1] mb-3'>QUESTIONS</h2>
          {questionArray.map((question, i) => {
            return <QuestionBox question={question} setAnswers={setAnswers} key={i}/>
          })}
          <div className='flex w-full sm:w-3/4 md:w-1/3 justify-center items-center'>
            <PrimaryButton name='SUBMIT ANSWER' action='submitAnswers' handleAction={handleSubmitAnswer} className='mt-3'/>
          </div>
      </div>
    </div>
  )
}

export default Page;