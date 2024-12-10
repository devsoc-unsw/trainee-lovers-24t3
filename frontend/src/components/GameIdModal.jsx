import { useRouter } from 'next/navigation';
import useAuthStore from '@/store/useAuthStore';
import PrimaryButton from '@/components/PrimaryButton';

const gameIdModal = () => {
  const { gameId, setGameId } = useAuthStore();
  const router = useRouter();

  const handleKeyDown = (event) => {
    // Connect to backend and check if the gameId exists
    // If not, return error, else navigate to lobby page
    if (event.key === 'Enter') {
      router.push('/lobby');
    }
  }

  return (
    <div className='flex flex-col w-1/2 md:w-1/4 border border-[#8093F1] p-4 items-center justify-center rounded-lg py-5 gap-4'>
      <p className='text-5xl text-[#4154AF] text-center'>Enter game id</p>
      <input 
        type='text'
        value={gameId}
        onChange={(e) => setGameId(e.target.value)}
        placeholder='Enter game id'
        onKeyDown={(e) => handleKeyDown(e)}
        className='text-center w-8/12 p-4 text-black text-3xl border border-gray-300 rounded-lg outline-[#8093F1]'
      />
      <PrimaryButton name='Submit' action='enterGameId'/>
    </div>
  )
}

export default gameIdModal;