'use client'

import React from 'react'

import { useRouter } from 'next/navigation';
import useAuthStore from '../store/useAuthStore';

export default function PrimaryButton({ name, action }) {
  const router = useRouter();
  const { setIsHost } = useAuthStore();

  const handleRedirect = () => {
    // If is a host then function
    if (action === 'createRoom') {
      setIsHost(true);
    }
  }

  return (
    <div
      className='flex items-center justify-center w-8/12 md:w-1/5 h-16 py-2 text-5xl text-white bg-mid-blue font-mouse rounded-md z-10 cursor-pointer hover:border'
      onClick={() => handleRedirect()}
    >
      {name}
    </div>
  );
};
