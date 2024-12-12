'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/store/useAuthStore';
import NameTag from '../../components/NameTag';
import DecorativeShapesBackground from '@/components/DecorativeShapesBackground';
import PrimaryButton from '@/components/PrimaryButton';
import GameIdBox from '../../components/GameIdBox';
import QrCodeBox from '../../components/QrCodeBox';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');

const Page = () => {
  const router = useRouter();
  const { username, gameId, setUsers } = useAuthStore();
  const users = useAuthStore((state) => state.users);

  useEffect(() => {
    if (!gameId || !username) {
      console.log('Missing gameId or username, redirecting to home.');
      router.push('/');
      return;
    }

    console.log(`Attempting to join room ${gameId} as ${username}`);

    // Emit 'join-room' event to backend
    socket.emit('join-room', gameId, username, socket.id, (response) => {
      if (response.error) {
        console.log(`Error joining room: ${response.error}`);
        alert(response.error);
        router.push('/');
      } else {
        console.log('Successfully joined room. Current users:', response.users);
        setUsers(response.users);
      }
    });

    // Listen for 'update-room' events from backend
    socket.on('update-room', (updatedUsers) => {
      console.log('Received update-room event. Updated users:', updatedUsers);
      setUsers(updatedUsers);
    });

    // Cleanup on component unmount
    return () => {
      socket.off('update-room');
      socket.emit('leave-room', gameId, socket.id);
      console.log(`Left room ${gameId}`);
    };
  }, [gameId, username, router, setUsers]);

  useEffect(() => {
    console.log('Current users in lobby:', users);
  }, [users]);

  return (
    <div className='flex flex-col w-full h-screen bg-white items-center justify-center'>
      <DecorativeShapesBackground />
      <div className='absolute inset-0 flex flex-col justify-center items-center gap-8 w-full'>
        <div className='flex flex-col items-center justify-center w-full gap-1'>
          <QrCodeBox gameId={gameId} />
          <GameIdBox gameId={gameId} />
        </div>
        <div className='flex flex-col justify-center items-center w-full gap-3'>
          <h4 className='text-3xl text-[#8093F1]'>PLAYERS</h4>
          <div className='flex flex-wrap items-center justify-center gap-2'>
            {users.map((user) => (
              <NameTag key={user.uid} name={user.username} />
            ))}
          </div>
        </div>
        {useAuthStore((state) => state.isHost) && (
          <div className='flex w-full sm:w-3/4 md:w-1/3 justify-center items-center'>
            <PrimaryButton name='START GAME' action='startGame' />
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
