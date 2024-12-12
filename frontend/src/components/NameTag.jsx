import React from 'react';

export default function NameTag({ name }) {
  console.log('Rendering NameTag with name:', name);
  return (
    <div className='flex items-center justify-center bg-[#01136F] text-white w-16 h-12 rounded-3xl text-2xl px-12'>
      {name}
    </div>
  );
}
