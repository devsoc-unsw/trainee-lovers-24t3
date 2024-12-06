'use client'

import React, {useRef, useEffect} from 'react'
import PrimaryButton from '../../components/PrimaryButton/PrimaryButton'
import SecondaryButton from '../../components/SecondaryButton/SecondaryButton'

export default function Page() {
  return (
    <>
        <div>page</div>
        <PrimaryButton link="youtube.com" name="HOST"/>
        <SecondaryButton link="youtube.com" name="JOIN"/>
    </>
  )
}
