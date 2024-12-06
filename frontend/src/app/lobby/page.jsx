import NameTag from '../../components/NameTag';
import DecorativeShapesBackground from '@/components/DecorativeShapesBackground';

const Page = () => {
  return (
    <div className='flex flex-row w-full h-screen bg-white items-center justify-center'>
      <DecorativeShapesBackground />
      <div className='absolute inset-0 flex justify-center items-center gap-3'>
        <NameTag name='Jerry' />
        <NameTag name='Angelin' />
        <NameTag name='Agus' />
      </div>
    </div>
  )
}

export default Page;