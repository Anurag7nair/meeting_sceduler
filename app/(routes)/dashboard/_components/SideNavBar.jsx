"use client"
import { Button } from '@/components/ui/button'
import { Briefcase, Calendar, Clock, Plus, Settings } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

function SideNavBar() {
    const menu=[
        {
            id:1,
            name:'Meeting Type',
            path:'/dashboard/meeting-type',
            icon:Briefcase
        },
        {
            id:2,
            name:'Scheduled Meeting',
            path:'/dashboard/scheduled-meeting',
            icon:Calendar
        },
        {
            id:3,
            name:'Availability',
            path:'/dashboard/availability',
            icon:Clock
        },
        {
            id:4,
            name:'Settings',
            path:'/dashboard/settings',
            icon:Settings
        },

    ]

    const path=usePathname();
    const [activePath,setActivePath]=useState(path);

    useEffect(()=>{
        path&&setActivePath(path)
    },[path])
    return (
        <div className='p-5 py-14'>
            <div className='flex justify-center'>
                <Image src='/logo.svg' width={70} height={70}
                    alt='logo'
                    className='drop-shadow-sm'
                />
            </div>

          <Link href={'/create-meeting'}>
            <Button className="flex gap-2 w-full 
                mt-7
                rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg transition-all"> <Plus /> Create</Button>
            </Link>  

            <div className='mt-8 flex flex-col gap-2'>
                {menu.map((item)=>(
                   <Link href={item.path} key={item.id}>
                    <Button  
                        variant="ghost"
                        className={`w-full flex gap-3 
                        justify-start
                        hover:bg-indigo-50
                        font-normal
                        text-base
                        transition-all
                        rounded-lg
                        ${activePath==item.path&&'text-indigo-600 bg-indigo-50 shadow-sm'}
                        `}>
                        <item.icon className='h-5 w-5'/> {item.name}
                        </Button>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default SideNavBar