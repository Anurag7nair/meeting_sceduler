"use client"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'
import { app } from '@/config/FirebaseConfig'
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
import { getFirestore, collection, query, where, getDocs, orderBy, deleteDoc, doc, getDoc } from 'firebase/firestore'
import { Clock, Copy, MapPin, Pen, Settings, Trash } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
  
function MeetingEventList() {
    const db = getFirestore(app);
    const { user } = useKindeBrowserClient();
    const [businessInfo,setBusinessInfo]=useState();
    const [eventList,setEventList]=useState([]);
        useEffect(() => {
            if (user?.email) {
                getEventList();
                BusinessInfo();
            }
        }, [user?.email])
    const getEventList = async () => {
        if (!user?.email) return;
        
        try {
            const q = query(collection(db, "MeetingEvent"),
                where("createdBy", "==", user.email),
                orderBy('id','desc'));

            const querySnapshot = await getDocs(q);
            
            // Collect all events first, then set them all at once to avoid duplicates
            const events = [];
            querySnapshot.forEach((docSnapshot) => {
                console.log(docSnapshot.id, " => ", docSnapshot.data());
                // Use Firestore document ID as the unique identifier
                events.push({
                    ...docSnapshot.data(),
                    firestoreId: docSnapshot.id // Add Firestore document ID for unique key
                });
            });
            
            // Set all events at once to prevent duplicates
            setEventList(events);
        } catch (error) {
            console.error('Error fetching events:', error);
            setEventList([]);
        }
    }

    const BusinessInfo=async()=>{
        if (!user?.email) return;
        try {
            const docRef=doc(db,'Business',user.email);
            const docSnap=await getDoc(docRef);
            if (docSnap.exists()) {
                setBusinessInfo(docSnap.data());
            }
        } catch (error) {
            console.error('Error loading business info:', error);
        }
    }

    const onDeleteMeetingEvent=async(event)=>{
      try {
        // Use firestoreId if available, otherwise fall back to id
        const eventId = event?.firestoreId || event?.id;
        if (!eventId) {
          toast('Error: Cannot delete event - missing ID');
          return;
        }
        await deleteDoc(doc(db, "MeetingEvent", eventId));
        toast('Meeting Event Deleted!');
        getEventList();
      } catch (error) {
        console.error('Error deleting event:', error);
        toast('Failed to delete event');
      }
    }

    const onCopyClickHandler=(event)=>{
        const meetingEventUrl=process.env.NEXT_PUBLIC_BASE_URL+'/'+businessInfo.businessName+'/'+event.id
        navigator.clipboard.writeText(meetingEventUrl);
        toast('Copied to Clicpboard')
    }
    return (
        <div className='mt-10 grid grid-cols-1 md:grid-cols-2 
        lg:grid-cols-3 gap-6'>
            {eventList.length > 0 ? eventList?.map((event) => (
    <div
        key={event.firestoreId}   // Use Firestore document ID as unique key (guaranteed unique)
        className='bg-white border border-slate-200 shadow-sm hover:shadow-lg
        border-t-4 rounded-xl p-6 flex flex-col gap-4 transition-all duration-300 hover:scale-[1.02]'
        style={{ borderTopColor: event?.themeColor || '#6366f1' }}
    >
                    <div className='flex justify-end'>
                        <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                        <Settings className='cursor-pointer text-slate-500 hover:text-slate-700 transition-colors'/>

                        </DropdownMenuTrigger>
                        <DropdownMenuContent className='bg-white border-slate-200'>
                          
                            <DropdownMenuItem className="flex gap-2 text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 cursor-pointer"> <Pen className='h-4 w-4'/> Edit</DropdownMenuItem>
                            <DropdownMenuItem className="flex gap-2 text-slate-700 hover:bg-red-50 hover:text-red-600 cursor-pointer"
                            onClick={()=>onDeleteMeetingEvent(event)}
                            > <Trash className='h-4 w-4'/> Delete</DropdownMenuItem>
                         
                        </DropdownMenuContent>
                        </DropdownMenu>

                    </div>
                    <h2 className="font-semibold text-xl text-slate-800">
                        {event?.eventName}</h2>
                    <div className='flex justify-between'>
                    <h2 className='flex gap-2 text-slate-600 text-sm'><Clock className='h-4 w-4 mt-0.5'/> {event.duration} Min </h2>
                    <h2 className='flex gap-2 text-slate-600 text-sm'><MapPin className='h-4 w-4 mt-0.5'/> {event.locationType} </h2>
                    
                    </div>
                    <hr className='border-slate-200'></hr>
                    <div className='flex justify-between items-center'>
                    <h2 className='flex gap-2 text-sm text-indigo-600 
                    items-center cursor-pointer hover:text-indigo-700 transition-colors font-medium'
                    onClick={()=>{
                        onCopyClickHandler(event)
                       
                    }}
                    >
                        <Copy className='h-4 w-4'/> Copy Link </h2>
                    <Button variant="outline" 
                    className="rounded-full text-indigo-600 border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300 transition-all">Share</Button>
                    </div>
                </div>
            ))
                :<h2>Loading...</h2>
        }
        </div>
    )
}

export default MeetingEventList