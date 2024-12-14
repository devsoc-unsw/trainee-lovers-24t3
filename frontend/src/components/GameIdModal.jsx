import { useRouter } from 'next/navigation';
import { useSocket } from '../context/socketContext';
import useAuthStore from '@/store/useAuthStore';
import PrimaryButton from '@/components/PrimaryButton';

const GameIdModal = () => {
  const { roomCode, setRoomCode, username, setShowGameIdModal, setUserId } = useAuthStore();
  const router = useRouter();
  const socket = useSocket();

  const handleSocketResponse = (error, response) => {
    if (error) {
      console.error('Error joining room:', error.message)
    } else {
      setRoomCode(response.roomCode);
      setUserId(response.userId);
      router.push('/question');
      setShowGameIdModal(false);
    }
  }

  const handleKeyDown = (event) => {
    // Connect to backend and check if the gameId exists
    // If not, return error, else navigate to lobby page
    if (event.key === 'Enter') {
      socket.emit('join-room', roomCode, username, handleSocketResponse);
      // look for 'update-room' event
      socket.on('update-room', (users) => {
        console.log('Users in room:', users);
      });
    }
  }

  const handleClick = () => {
    // Connect to backend and check if the gameId exists
    // If not, return error, else navigate to lobby page
    socket.emit('join-room', roomCode, username, handleSocketResponse);
  }

  return (
    <div className='flex flex-col w-1/2 md:w-1/4 border border-[#8093F1] p-4 items-center justify-center rounded-lg py-5 gap-4'>
      <p className='text-5xl text-[#4154AF] text-center'>Enter game id</p>
      <input 
        type='text'
        value={roomCode}
        onChange={(e) => setRoomCode(e.target.value)}
        placeholder='Enter game id'
        onKeyDown={(e) => handleKeyDown(e)}
        className='text-center w-8/12 p-4 text-black text-3xl border border-gray-300 rounded-lg outline-[#8093F1]'
      />
      <PrimaryButton name='Submit' action='enterGameId' handleAction={handleClick}/>
    </div>
  )
}

export default GameIdModal;