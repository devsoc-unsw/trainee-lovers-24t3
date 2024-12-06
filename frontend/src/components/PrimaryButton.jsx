import React from 'react'

export default function PrimaryButton({ name, role }) {
  const handleRedirect = () => {
    // If is a host then function
    
    // If not a host then 
  }

  return (
    <div
      className='flex items-center justify-center w-8/12 h-16 py-2 text-5xl text-white bg-mid-blue font-mouse rounded-md'
      onClick={() => handleRedirect()}
    >
      {name}
    </div>
  );
};
