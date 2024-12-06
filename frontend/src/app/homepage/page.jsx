"use client";

import React, { useRef, useEffect, useState } from 'react'
import PrimaryButton from '../../components/PrimaryButton';
import SecondaryButton from '../../components/SecondaryButton';
import Modal from '../../components/Modal';
import useAuthStore from '../../store/useAuthStore';

export default function Page() {
  const { isHost } = useAuthStore();

  return (
    <div className='flex relative flex-col w-full h-screen bg-white items-center justify-center gap-5'>
    { isHost ? (
      <Modal />
    ) : (
      <div className='flex flex-col w-full md:w-1/3 gap-2 items-center justify-center'>
        <PrimaryButton 
          name="HOST"
          action='createRoom'
        />
        <SecondaryButton 
          name="JOIN"
          action='joinRoom'
        />
      </div>
    )}
        
    </div>
  )
}
