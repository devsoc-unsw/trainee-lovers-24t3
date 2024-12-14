'use client'

import { useEffect, useState } from 'react';
import useAuthStore from '@/store/useAuthStore';
import QuestionBox from '@/components/QuestionBox';
import DecorativeShapesBackground from '@/components/DecorativeShapesBackground';
import PrimaryButton from '@/components/PrimaryButton';
import { useSocket } from '@/context/socketContext';

const Page = () => {
  // To be deleted 
  const socket = useSocket();

  // an array of questions
  // question has fields: qId, questionStr
  const { userId, roomCode } = useAuthStore();

  const questionArray = [
    {_id: "675d78f20612758cf507e8af", questionContent: 'Your WAM'},
    {_id: "675d78f20612758cf507e8ad", questionContent: 'Body count?'},
    {_id: "675d79207a6bff092b04aa36", questionContent: 'How many exes?'},
    {_id: "675d79207a6bff092b04aa39", questionContent: 'Kiss count?'}
  ]

  // questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }], 
  const [questions, setQuestions] = useState([]);
  const handleStartGameSocketResponse = (error, response) => {
    if (error) {
      console.error("Error starting game:", error.message);
    } else {
      console.log("Game started successfully:", response);
    }
  }

  // listen for 'display-questions' event
  useEffect(() => {
    socket.emit("start-game", roomCode, handleStartGameSocketResponse);

    socket.on('display-questions', (response) => {
      console.log("Questions received:", questions);
      setQuestions(response.questions);
    });
  }, []);

  const [answers, setAnswers] = useState({});

  const handleSubmitAnswer = () => {
    // send question responses to frontend
    // convert answers to an array of questionAnswer objects, each with fields: qId, answer
    // send to backend

    const questionAnswers = [];
    // for each question in questionArray, add an object to answers array
    // each questionAnswer should have fields: "qid", "response"
    questions.forEach(question => {
      const qid = question._id;
      const answer = answers[qid];
      questionAnswers.push({qid: qid, response: answer});
      console.log(`Question ${qid} has answer: ${answer}`);
    });

    try {
      socket.emit('save-question', roomCode, questionAnswers, userId);
    } catch (error) {
      console.error("Error emitting save-question event:", error);
    }  
  }

  return (
    <div className='flex w-full h-screen bg-white text-center text-black text-3xl'>
      <DecorativeShapesBackground />
      <div className='absolute inset-0 flex flex-col justify-center items-center gap-3 w-full p-4'>
          <h2 className='text-5xl text-[#8093F1] mb-3'>QUESTIONS</h2>
          {questions.map((question, i) => {
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