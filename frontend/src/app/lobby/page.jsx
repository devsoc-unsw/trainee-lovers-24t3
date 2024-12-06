import NameTag from '../../components/NameTag';
import DecorativeShapesBackground from '@/components/DecorativeShapesBackground';
import PrimaryButton from '@/components/PrimaryButton';

const Page = () => {
  return (
    <div className='flex flex-col w-full h-screen bg-white items-center justify-center'>
      <DecorativeShapesBackground />
      <div className='absolute inset-0 flex flex-col justify-center items-center gap-3 w-full'>
        <div className='flex flex-row items-center justify-center gap-2'>
          <NameTag name='Jerry' />
          <NameTag name='Angelin' />
          <NameTag name='Agus' />
        </div>
        <div className='flex w-full sm:w-3/4 md:w-1/3 justify-center items-center'>
          <PrimaryButton name='START GAME' action='startGame'/>
        </div>
      </div>
    </div>
  )
}

export default Page;