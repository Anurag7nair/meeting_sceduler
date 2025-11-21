import React from 'react'
import SideNavBar from './_components/SideNavBar'
import DashboardHeader from './_components/DashboardHeader'
import { Toaster } from '@/components/ui/sonner'

function DashboardLayout({children}) {
  return (
    <div className='min-h-screen'>
        <div className='hidden md:block md:w-64 bg-white/90 backdrop-blur-xl border-r border-slate-200/60 h-screen fixed shadow-lg z-10'>
            <SideNavBar/>
        </div>
        <div className='md:ml-64 min-h-screen'>
            <DashboardHeader/>
            <Toaster />
            <div className='bg-transparent'>
                {children}
            </div>
        </div>
    </div>
  )
}

export default DashboardLayout