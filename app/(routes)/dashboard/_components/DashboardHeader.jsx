"use client"
import { LogoutLink, useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs'
import { ChevronDown } from 'lucide-react';
import Image from 'next/image';
import React from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

function DashboardHeader() {
    const { user } = useKindeBrowserClient();

    return user && (
        <div className='p-4 px-10 bg-white/50 backdrop-blur-sm border-b border-slate-200/50'>
            <div >

                <DropdownMenu>
                    <DropdownMenuTrigger className='flex items-center gap-2 float-right hover:bg-slate-100 rounded-full p-2 transition-all'>
                        {user?.picture && typeof user.picture === 'string' && user.picture.trim() !== '' && (
                            <Image src={user.picture} alt='User profile'
                                width={40}
                                height={40}
                                className='rounded-full border-2 border-slate-200 shadow-sm'
                            />
                        )}
                        <ChevronDown className='h-4 w-4 text-slate-600' />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className='bg-white border-slate-200'>
                        <DropdownMenuLabel className='text-slate-700'>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className='text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 cursor-pointer'>Profile</DropdownMenuItem>
                        <DropdownMenuItem className='text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 cursor-pointer'>Settings</DropdownMenuItem>

                        <DropdownMenuItem className='text-slate-700 hover:bg-red-50 hover:text-red-600 cursor-pointer'>
                            <LogoutLink>Logout</LogoutLink>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

            </div>
        </div>
    )
}

export default DashboardHeader