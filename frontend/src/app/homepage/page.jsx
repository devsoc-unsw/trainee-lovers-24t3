'use client'

import React, { useRef, useEffect, useState } from 'react'
import PrimaryButton from '../../components/PrimaryButton';
import SecondaryButton from '../../components/SecondaryButton';
import Modal from '../../components/Modal/Modal';


export default function Page() {
  const [ isHost, setIsHost ] = useState(false);

  return (
    <div className='flex flex-col w-full h-screen bg-white items-center justify-center gap-5'>
    { isHost ? (
      <Modal />
    ) : (
      <>
        <PrimaryButton 
          name="HOST"
        />
        <SecondaryButton 
          link="youtube.com" 
          name="JOIN"/>
      </>
    )}
        
    </div>
  )
}
