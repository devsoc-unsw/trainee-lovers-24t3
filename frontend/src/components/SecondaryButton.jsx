import React from 'react'

export default function SecondaryButton({ name, link }) {
  const handleRedirect = () => {
    window.location.href = link;
  };

  return (
    <div 
      onClick={handleRedirect} 
      className='flex items-center justify-center w-8/12 h-16 py-2 text-5xl text-mid-blue bg-white border-[1px] border-mid-blue font-mouse rounded-md'
    >
      {name}
    </div>
  );
};
