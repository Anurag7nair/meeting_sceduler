"use client"
import { Button } from '@/components/ui/button'
import { LoginLink, RegisterLink } from '@kinde-oss/kinde-auth-nextjs'
import Image from 'next/image'
import React from 'react'

function Header() {
  return (
    <div className='sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200/50'>
        <div className='flex items-center justify-between
        p-5 max-w-7xl mx-auto
        '>
            <Image src='/logo.svg' width={50} height={50} alt='logo'
               
            />
            <ul className='hidden md:flex gap-14 font-medium text-lg'>
                <li className='hover:text-indigo-600 transition-all duration-300 cursor-pointer text-slate-700'>Product</li>
                <li className='hover:text-indigo-600 transition-all duration-300 cursor-pointer text-slate-700'>Pricing</li>
                <li className='hover:text-indigo-600 transition-all duration-300 cursor-pointer text-slate-700'>Contact us</li>
                <li className='hover:text-indigo-600 transition-all duration-300 cursor-pointer text-slate-700'>About Us</li>
            </ul>
            <div className='flex gap-5'>
              <LoginLink> <Button variant="ghost" className='text-slate-700 hover:text-indigo-600'>Login</Button></LoginLink> 
               <RegisterLink><Button className='bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg transition-all'>Get Started</Button></RegisterLink> 

            </div>
        </div>
    </div>
  )
}

export default Header