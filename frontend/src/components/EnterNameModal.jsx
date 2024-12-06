import useAuthStore from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';

const EnterNameModal = () => {
  const router = useRouter();
  const { userName, setUserName } = useAuthStore();
  
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      router.push('/lobby');
    }
  }

  const handleSubmit = () => {
    router.push('/lobby');
  }

  return (
    <div className='flex flex-col w-1/2 md:w-1/4 border border-[#8093F1] p-4 items-center justify-center gap-3 rounded-lg py-5'>
      <p className='text-3xl text-[#4154AF] text-center'>Enter your name</p>
      <input 
        type="text"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
        placeholder='Enter your name'
        className='text-center w-3/4 p-2 text-black text-xl border border-gray-300 rounded-lg outline-[#8093F1]'
        maxLength={10}
        onKeyDown={(e) => handleKeyDown(e)}
      />
      <button 
        className='bg-[#4154AF] text-xl text-center w-3/4 p-2 rounded-lg text-white hover:bg-white hover:text-[#4144AF] border border-[#4154AF]'
        onClick={() => handleSubmit()}
      >
        Enter
      </button>
    </div>
  )
}

export default EnterNameModal;