const WinnerBox = ({ name, score }) => {
  return (
    <div className='flex flex-col border border-[#8093F1] justify-center items-center rounded-lg p-3 w-1/2 md:w-1/4 lg:w-1/5'>
      <img 
        src='/character.svg'
        alt='character-img'
      />
      <h4 className='text-2xl text-black'>{name}</h4>
      <h4 className='text-2xl text-black'>{score}</h4>
    </div>
  )
}

export default WinnerBox;