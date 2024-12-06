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
        <PrimaryButton name='START GAME' action='startGame'/>
      </div>
    </div>
  )
}

export default Page;