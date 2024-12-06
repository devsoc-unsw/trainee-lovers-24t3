import React from 'react'

export default function PrimaryButton({name, link}) {
  const handleRedirect = () => {
    window.location.href = link;
  };
  return (
    <div onClick={handleRedirect} className='w-48 text-white bg-mid-blue font-mouse'>{name}</div>
  );
};
