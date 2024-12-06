import PrimaryButton from '../PrimaryButton';
import SecondaryButton from '../SecondaryButton';

const Modal = () => {
  return (
    <div className='flex flex-col bg-white border border-[#8093F1] w-3/4 md:w-1/4 lg:w-1/6 h-9/12 rounded-md items-center justify-center gap-2 py-4'>
      <h2 className='text-3xl text-[#4154AF]'>CHOOSE GAME</h2>
      <PrimaryButton name='HIGHER vs LOWER'/>
      <SecondaryButton name='START' />
    </div>
  )
}

export default Modal;