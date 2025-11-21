import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { format } from 'date-fns'
import { CalendarCheck, Clock, LoaderIcon, MapPin, Timer } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import TimeDateSelection from './TimeDateSelection'
import UserFormInfo from './UserFormInfo'
import { collection, doc, getDocs, getFirestore, query, setDoc, where } from 'firebase/firestore'
import { app } from '@/config/FirebaseConfig'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import Plunk from '@plunk/node'
import { render } from '@react-email/render';
import Email from '@/emails'
function MeetingTimeDateSelection({eventInfo,businessInfo}) {
    const [date,setDate]=useState(new Date())
    const [timeSlots,setTimeSlots]=useState();
    const [enableTimeSlot,setEnabledTimeSlot]=useState(false);
    const [selectedTime,setSelectedTime]=useState();
    const [userName,setUserName]=useState();
    const [userEmail,setUserEmail]=useState();
    const [userNote,setUserNote]=useState('');
    const [prevBooking,setPrevBooking]=useState([]);
    const [step,setStep]=useState(1);
    const router=useRouter();
    const db=getFirestore(app);
    const [loading,setLoading]=useState(false);
    // Initialize Plunk only if API key exists
    const plunk = process.env.NEXT_PUBLIC_PLUNK_API_KEY 
      ? new Plunk(process.env.NEXT_PUBLIC_PLUNK_API_KEY) 
      : null;
    useEffect(()=>{
        eventInfo?.duration&&createTimeSlot(eventInfo?.duration)
    },[eventInfo])
    const createTimeSlot=(interval)=>{
        const startTime = 8 * 60; // 8 AM in minutes
        const endTime = 22 * 60; // 10 PM in minutes
        const totalSlots = (endTime - startTime) / interval;
        const slots = Array.from({ length: totalSlots }, (_, i) => {
      const totalMinutes = startTime + i * interval;
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      const formattedHours = hours > 12 ? hours - 12 : hours; // Convert to 12-hour format
      const period = hours >= 12 ? 'PM' : 'AM';
      return `${String(formattedHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')} ${period}`;
    });
 
    console.log(slots)  
    setTimeSlots(slots); 
    }

    /**
     * On Date Change Handle Method
     * @param {*} date 
     */
    const handleDateChange=(date)=>{
        setDate(date);
        const day=format(date,'EEEE');
        if(businessInfo?.daysAvailable?.[day])
        {
          getPrevEventBooking(date)
            setEnabledTimeSlot(true)
        }
        else{
           
            setEnabledTimeSlot(false)
        }
    }

    /**
     * Handle Schedule Event on Click Schedule Button
     * @returns 
     */
    const handleScheduleEvent=async()=>{
        try {
            const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
            if(!userEmail || typeof userEmail !== 'string' || regex.test(userEmail)==false)
            {
                toast('Enter valid email address')
                return ;
            }
            if(!userName || typeof userName !== 'string' || userName.trim() === '') {
                toast('Enter your name')
                return;
            }
            const docId=Date.now().toString();
            setLoading(true)
            
            await setDoc(doc(db,'ScheduledMeetings',docId),{
                businessName:businessInfo.businessName,
                businessEmail:businessInfo.email,
                selectedTime:selectedTime,
                selectedDate:date,
                formatedDate:format(date,'PPP'),
                formatedTimeStamp:format(date,'t'),
                duration:eventInfo.duration,
                locationUrl:eventInfo.locationUrl || '',
                eventId:eventInfo.id,
                id:docId,
                userName:userName,
                userEmail:userEmail,
                userNote:userNote || ''
            });
            
            toast('Meeting Scheduled successfully!');
            await sendEmail(userName);
            
        } catch(error) {
            console.error('Error scheduling meeting:', error);
            toast('Failed to schedule meeting. Please try again.');
            setLoading(false);
        }
    }

    /**
     * Used to Send an email to User
     * @param {*} user 
     */
    const sendEmail=async(user)=>{
      try {
        // Ensure userEmail is a string
        const emailToSend = typeof userEmail === 'string' ? userEmail : String(userEmail || '');
        
        if(!emailToSend || emailToSend.trim() === '') {
          throw new Error('Invalid email address');
        }

        // Check if Plunk is initialized
        if(!plunk) {
          console.warn('Plunk API key not found. Skipping email send.');
          setLoading(false);
          router.replace('/confirmation');
          return;
        }

        // Render email component to HTML string
        // render() can be sync or async depending on version
        let emailHtml;
        try {
          const emailComponent = <Email
            businessName={businessInfo?.businessName || 'Business'}
            date={format(date,'PPP').toString()}
            duration={String(eventInfo?.duration || 30)} 
            meetingTime={selectedTime || 'Not selected'}
            meetingUrl={eventInfo?.locationUrl || '#'}
            userFirstName={user || 'User'}
          />;
          
          emailHtml = render(emailComponent);
          
          // If render returns a Promise, await it
          if (emailHtml && typeof emailHtml.then === 'function') {
            emailHtml = await emailHtml;
          }
          
          console.log('Email HTML rendered, type:', typeof emailHtml, 'length:', emailHtml?.length);
        } catch (renderError) {
          console.error('Error rendering email:', renderError);
          throw new Error('Failed to render email template: ' + (renderError?.message || 'Unknown error'));
        }

        // Ensure emailHtml is a string
        const htmlString = typeof emailHtml === 'string' ? emailHtml : String(emailHtml || '');

        if(!htmlString || htmlString.trim() === '') {
          console.error('Rendered HTML is empty or invalid');
          throw new Error('Failed to render email template - empty result');
        }

        console.log('Sending email to:', emailToSend);
        console.log('Email body length:', htmlString.length);

        // Plunk API requires 'body' field for HTML content
        const emailPayload = {
          to: emailToSend,
          subject: "Meeting Schedule Details",
          body: htmlString,
        };
        
        console.log('Email payload:', {
          to: emailPayload.to,
          subject: emailPayload.subject,
          bodyLength: emailPayload.body?.length,
          bodyType: typeof emailPayload.body
        });

        await plunk.emails.send(emailPayload);
        
        console.log('Email sent successfully');
        setLoading(false);
        router.replace('/confirmation');
      } catch(error) {
        console.error('Error sending email:', error);
        console.error('Error details:', {
          message: error?.message,
          stack: error?.stack,
          emailToSend: typeof userEmail,
          plunkInitialized: !!plunk
        });
        // Still redirect even if email fails
        toast('Meeting scheduled, but email could not be sent.');
        setLoading(false);
        router.replace('/confirmation');
      }
    }

    /**
     * Used to Fetch Previous Booking for given event
     * @param {*} date_ 
     */
    const getPrevEventBooking=async(date_)=>{
      const q=query(collection(db,'ScheduledMeetings'),
      where('selectedDate','==',date_),
      where('eventId','==',eventInfo.id));

      const querySnapshot=await getDocs(q);

      querySnapshot.forEach((doc)=>{
        console.log("--",doc.data());
        setPrevBooking(prev=>[...prev,doc.data()])
      })
    }
  return (
    <div className='p-5 py-10 shadow-lg m-5 border-t-8
    mx-10
    md:mx-26
    lg:mx-56
    my-10'
    style={{borderTopColor:eventInfo?.themeColor}}
    >
       <Image src='/logo.svg' alt='logo'
       width={150}
       height={150}/>
       <div className='grid grid-cols-1 md:grid-cols-3 mt-5'>
            {/* Meeting Info  */}
            <div className='p-4 border-r'>
                <h2>{businessInfo?.businessName}</h2>
                <h2
                className='font-bold text-3xl'
                >{eventInfo?.eventName?eventInfo?.eventName:'Meeting Name'}</h2>
                <div className='mt-5 flex flex-col gap-4'>
                    <h2 className='flex gap-2'><Clock/>{eventInfo?.duration} Min </h2>
                    <h2 className='flex gap-2'><MapPin/>{eventInfo?.locationType} Meeting </h2>
                    <h2 className='flex gap-2'><CalendarCheck/>{format(date,'PPP')}  </h2>
                  {selectedTime&&  <h2 className='flex gap-2'><Timer/>{selectedTime}  </h2>}
                  
                    {eventInfo?.locationUrl && typeof eventInfo.locationUrl === 'string' && eventInfo.locationUrl.trim() !== '' && (
                        <Link href={eventInfo.locationUrl}
                        className='text-primary'
                        >{eventInfo.locationUrl}</Link>
                    )}
                </div>
            </div>
            {/* Time & Date Selction  */}
          {step==1? <TimeDateSelection
            date={date}
            enableTimeSlot={enableTimeSlot}
            handleDateChange={handleDateChange}
            setSelectedTime={setSelectedTime}
            timeSlots={timeSlots}
            selectedTime={selectedTime}
            prevBooking={prevBooking}
           />:
           <UserFormInfo
            setUserName={setUserName}
            setUserEmail={setUserEmail}
            setUserNote={setUserNote}
           />}
     

       </div>
       <div className='flex gap-3 justify-end'>
        {step==2&&<Button variant="outline" 
        onClick={()=>setStep(1)}>Back</Button>}
      {step==1? <Button className="mt-10 float-right"
        disabled={!selectedTime||!date}
        onClick={()=>setStep(step+1)}
       >Next
       </Button>:
       <Button disabled={!userEmail||!userName} 
       onClick={handleScheduleEvent}
       > 
       {loading?<LoaderIcon className='animate-spin'/>:'Schedule' }
      </Button>}
       </div>
    </div>
  )
}

export default MeetingTimeDateSelection