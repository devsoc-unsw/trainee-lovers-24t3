const LeaderboardScore = ({ name, score }) => {
  return (
    <div className='flex relative p-4 w-3/4 md:w-1/4 lg:w-1/5 border border-[#8093F1] bg-white items-center justify-center rounded-lg'>
      <p className='absolute left-3 text-xl text-black'>{name}</p>
      <p className='absolute right-3 text-xl text-black'>{score}</p>
    </div>
  )
}

export default LeaderboardScore;