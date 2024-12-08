'use client'
import React, {useRef, useEffect, useState} from 'react'
import PrimaryButton from '../../components/PrimaryButton/PrimaryButton'
import SecondaryButton from '../../components/SecondaryButton/SecondaryButton'
import LoadingPage from '@/components/LoadingPage/LoadingPage'

export default function Page() {
    const [isLoading, setIsLoading] = useState(false);

    const handlePageAction = () => {
        setIsLoading(true);
        setTimeout(() => {
          setIsLoading(false); 
        }, 3000);
    };

    return (
    <>
        <button onClick={handlePageAction}>Start Loading</button>
        <PrimaryButton link="youtube.com" name="luhLoad"/>
        <LoadingPage isVisible={isLoading} />
    </>
    )
}
