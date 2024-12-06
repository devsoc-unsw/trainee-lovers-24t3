import NameTag from '../../components/NameTag';

const Page = () => {
  return (
    <div className='flex flex-row w-full h-screen bg-[white] items-center justify-center gap-3'>
      <NameTag name='Jerry' />
      <NameTag name='Angelin' />
      <NameTag name='Agus' />
    </div>
  )
}

export default Page;