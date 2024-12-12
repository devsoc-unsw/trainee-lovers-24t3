const GameIdBox = ({ gameId }) => {
  return (
    <div className='flex w-1/2 md:w-1/5 bg-white rounded-3xl text-center px-5 py-2 justify-center items-center shadow-md shadow-gray-400'>
      <h2 className='text-[#8093F1] text-5xl'>{gameId}</h2>
    </div>
  );
};

export default GameIdBox;