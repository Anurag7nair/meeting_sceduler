
import { Input } from '@/components/ui/input'

import React from 'react'
import MeetingEventList from './_components/MeetingEventList'

function MeetingType() {
  
  return (
    <div className='p-8'>
      <div className='flex flex-col gap-5 mb-8'>
        <h2 className='font-bold text-3xl text-slate-800'>Meeting Event Type</h2>
        <Input placeholder="Search" className="max-w-xs bg-white border-slate-200 focus:border-indigo-500" />
        <hr className='border-slate-200'></hr>
      </div>
      <MeetingEventList/>

    </div>
  )
}

export default MeetingType