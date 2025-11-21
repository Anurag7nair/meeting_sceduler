"use client"
import React, { useEffect, useState, use } from 'react'
import MeetingTimeDateSelection from '../_components/MeetingTimeDateSelection'
import { collection, doc, getDoc, getDocs, getFirestore, query, where } from 'firebase/firestore'
import { app } from '@/config/FirebaseConfig';

function SharedMeetingEvent({params}) {
    const resolvedParams = use(params);
    const db=getFirestore(app);
    const [businessInfo,setBusinesInfo]=useState();
    const [eventInfo,setEventInfo]=useState();
    const [loading,setLoading]=useState(false)
    useEffect(()=>{
        if(resolvedParams?.business && resolvedParams?.meetingEventId){
            getMeetingBusinessAndEventDetails();
        }
    },[resolvedParams])

    /**
     * Used to get Business Info and Event Details for Give Login User/Business Owner
     */
    const getMeetingBusinessAndEventDetails=async()=>{
        if(!resolvedParams?.business || !resolvedParams?.meetingEventId){
            return;
        }
        setLoading(true)
        const q=query(collection(db,'Business'),where('businessName','==',resolvedParams.business));
        const docSnap=await getDocs(q);
        docSnap.forEach((doc)=>{
            setBusinesInfo(doc.data())
        });
       
        const docRef=doc(db,'MeetingEvent',resolvedParams.meetingEventId);
        const result=await getDoc(docRef);
        setEventInfo(result.data());

        setLoading(false)

    }

  return (
    <div>
        <MeetingTimeDateSelection eventInfo={eventInfo}
        businessInfo={businessInfo} />
    </div>
  )
}

export default SharedMeetingEvent