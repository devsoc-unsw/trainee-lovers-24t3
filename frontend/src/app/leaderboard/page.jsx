import DecorativeShapesBackground from "@/components/DecorativeShapesBackground";
import WinnerBox from '@/components/WinnerBox';
import LeaderboardScore from '@/components/LeaderboardScore'

const leaderboardPage = () => {
  return (
    <div className='flex relative flex-col w-full h-screen bg-white items-center justify-center gap-5'>
      <DecorativeShapesBackground />
      <div className='absolute inset-0 flex flex-col items-center justify-center gap-4'>
        <h2 className='text-[#434360] text-5xl'>LEADERBOARD</h2>
        <WinnerBox name='Agus' score='100000'/>
        <LeaderboardScore name='Agus' score='100000'/>
        <LeaderboardScore name='Agus' score='100000'/>
        <LeaderboardScore name='Agus' score='100000'/>
      </div>
    </div>
  )
}

export default leaderboardPage;
