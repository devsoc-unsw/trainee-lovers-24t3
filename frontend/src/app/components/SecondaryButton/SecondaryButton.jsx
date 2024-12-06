import React from 'react'

export default function SecondaryButton({name, link}) {
  const handleRedirect = () => {
    window.location.href = link;
  };
  return (
    <div onClick={handleRedirect} className='w-[150px] py-2 text-3xl text-mid-blue bg-white border-[1px] border-mid-blue font-mouse rounded-md text-center'>{name}</div>
  );
};
