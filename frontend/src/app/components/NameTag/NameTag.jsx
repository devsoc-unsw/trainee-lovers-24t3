import React from 'react'

export default function NameTag({ name }) {
  return (
    <div className='flex items-center justify-center bg-[#01136F] text-white rounded-lg w-20 h-12 rounded-3xl text-2xl px-14'>
      {name}
    </div>
  )
}
