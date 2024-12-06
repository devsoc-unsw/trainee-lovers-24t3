import React from 'react'

export default function PrimaryButton({name, link}) {
  const handleRedirect = () => {
    window.location.href = link;
  };
  return (
    <div onClick={handleRedirect} className='w-[150px] py-2 text-3xl text-white bg-mid-blue font-mouse rounded-md text-center'>{name}</div>
  );
};
