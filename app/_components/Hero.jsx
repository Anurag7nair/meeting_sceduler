"use client"
import { Button } from '@/components/ui/button'
import { LoginLink } from '@kinde-oss/kinde-auth-nextjs'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

function Hero() {
  return (
    <div className='flex flex-col justify-center items-center my-20 px-4'>
        <div className='hidden lg:block'>
            <Image src='/profile1.png' width={100} height={100}
            className='h-[100px] object-cover rounded-full absolute right-36 shadow-lg border-4 border-white' alt='Profile image'/>
             <Image src='/profile3.png' width={100} height={100}
            className='h-[100px] object-cover rounded-full absolute top-48 left-16 shadow-lg border-4 border-white' alt='Profile image'/>
             <Image src='/profile2.png' width={100} height={100}
            className='h-[100px] object-cover rounded-full absolute bottom-20 left-36 shadow-lg border-4 border-white' alt='Profile image'/>
              <Image src='/profile2.png' width={100} height={100}
            className='h-[100px] object-cover rounded-full absolute right-16 bottom-32 shadow-lg border-4 border-white' alt='Profile image' />
        </div>
        <div className='text-center max-w-3xl'>
        <h2 className='font-bold text-[60px] bg-gradient-to-r from-slate-800 via-indigo-700 to-slate-800 bg-clip-text text-transparent'>Easy scheduling ahead</h2>
        <h2 className='text-xl mt-5 text-slate-600'>Scheduly is your scheduling automation platform for eliminating the back-and-forth emails to find the perfect time — and so much more.</h2>
        <div className='flex gap-4 flex-col mt-8'>
            <h3 className='text-sm text-slate-500 font-medium'>Sign Up free with Google and Facebook</h3>
            <div className='flex justify-center gap-8 flex-wrap'>
               <LoginLink> <Button className="p-7 flex gap-4 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-md hover:shadow-lg transition-all">
                    <Image src='/google.png' alt='google'
                    width={40} height={40}/>
                    Sign up with Google</Button>
                    </LoginLink>
                    <LoginLink>  <Button className="p-7 flex gap-4 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-md hover:shadow-lg transition-all">
                    <Image src='/facebook.png' alt='google'
                    width={40} height={40}/>
                    Sign up with Facebook</Button></LoginLink>
            </div>
            <hr className='my-4 border-slate-200'></hr>
            <LoginLink> <h2 className='text-slate-600'><span className='text-indigo-600 font-semibold hover:text-indigo-700 transition-colors cursor-pointer'>Sign up Free with Email.</span> No Credit card required</h2></LoginLink> 
        </div>
        </div>
    </div>
  )
}

export default Hero