import NameTag from '../../components/NameTag';
import DecorativeShapesBackground from '@/components/DecorativeShapesBackground';
import PrimaryButton from '@/components/PrimaryButton';
import GameIdBox from '@/components/GameIdBox';
import QrCodeBox from '@/components/QrCodeBox';

const Page = () => {
  return (
    <div className='flex flex-col w-full h-screen bg-white items-center justify-center'>
      <DecorativeShapesBackground />
      <div className='absolute inset-0 flex flex-col justify-center items-center gap-8 w-full'>
        <div className='flex flex-col items-center justify-center w-full gap-1'>
          <QrCodeBox />
          <GameIdBox />
        </div>
        <div className='flex flex-col justify-center items-center w-full gap-3'>
          <h4 className='text-3xl text-[#8093F1]'>PLAYERS</h4>
          <div className='flex flex-row items-center justify-center gap-2'>
            <NameTag name='Jerry' />
            <NameTag name='Angelin' />
            <NameTag name='Agus' />
          </div>
        </div>
        <div className='flex w-full sm:w-3/4 md:w-1/3 justify-center items-center'>
          <PrimaryButton name='START GAME' action='startGame'/>
        </div>
      </div>
    </div>
  )
}

export default Page;
