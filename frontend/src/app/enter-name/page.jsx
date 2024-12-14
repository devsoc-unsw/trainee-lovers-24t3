import React from 'react';
import { useState, useEffect } from 'react';
import EnterNameModal from '@/components/EnterNameModal';


const Page = () => {
    
    return (
        <div className='flex w-full h-screen bg-white text-center text-black text-3xl'>
                <EnterNameModal />
        </div>
    )


}