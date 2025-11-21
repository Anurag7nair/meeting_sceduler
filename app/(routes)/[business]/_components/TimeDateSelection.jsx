import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import React from 'react'

function TimeDateSelection({date,handleDateChange,timeSlots,setSelectedTime,enableTimeSlot,selectedTime,prevBooking}) {


  /**
   * Used to check timeslot whether its already booked or not
   * @param {*} time 
   * @returns Boolean
   */
  const checkTimeSlot=(time)=>{
    return (prevBooking.filter(item=>item.selectedTime==time)).length>0;
  }
  return (
    <div className='md:col-span-2 flex px-4'>
    <div className='flex flex-col'>
        <h2 className='font-bold text-lg'>Select Date & Time</h2>
        <Calendar
            mode="single"
            selected={date}
            onSelect={(d)=>handleDateChange(d)}
            className="rounded-md border mt-5"
           disabled={(date)=>date<=new Date()}
        />
    </div>
    <div className='flex flex-col w-full overflow-auto gap-4 p-5'
    style={{maxHeight:'400px'}}
    >
        {timeSlots?.map((time,index)=>(
            <Button
            key={time}
            disabled={!enableTimeSlot||checkTimeSlot(time)}
            onClick={()=>setSelectedTime(time)}
            className={`border-sky-300 bg-sky-100 text-sky-700 hover:bg-sky-200 hover:border-sky-400 transition-all
             ${time==selectedTime&&'bg-sky-400 text-white border-sky-500 font-semibold shadow-md'}
             ${(!enableTimeSlot||checkTimeSlot(time))&&'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'}
             `} variant="outline">{time}</Button>
        ))}
    </div>
</div>
  )
}

export default TimeDateSelection