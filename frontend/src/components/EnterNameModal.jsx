import { useRouter } from 'next/navigation';
import useAuthStore from '@/store/useAuthStore';
import PrimaryButton from '@/components/PrimaryButton';
import SecondaryButton from '@/components/SecondaryButton';

const EnterNameModal = () => {
  const router = useRouter();
  const { userName, setUserName } = useAuthStore();
  
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      router.push('/lobby');
    }
  }

  return (
    <div className='flex flex-col w-1/2 md:w-1/4 border border-[#8093F1] p-4 items-center justify-center rounded-lg py-5 gap-4'>
      <p className='text-5xl text-[#4154AF] text-center'>Enter your name</p>
      <input 
        type="text"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
        placeholder='Enter your name'
        className='text-center w-8/12 p-4 text-black text-3xl border border-gray-300 rounded-lg outline-[#8093F1]'
        maxLength={10}
        onKeyDown={(e) => handleKeyDown(e)}
      />
      <PrimaryButton name='Enter' action='submitUserName' />
      <SecondaryButton name='Back' action='backToHomePage' />
    </div>
  )
}

export default EnterNameModal;