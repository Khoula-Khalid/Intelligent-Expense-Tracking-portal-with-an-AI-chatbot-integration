"use client"
import React, { useEffect } from 'react'
import Image from 'next/image'
import { Banknote, Bot, GoalIcon, LayoutGrid, PiggyBank, ReceiptText } from 'lucide-react'
import { UserButton } from '@clerk/nextjs'
import { usePathname} from 'next/navigation'
import Link from 'next/link';


const SideNav = () => {
    const menuList=[
        {
            id:1,
            name:'Dashboard',
            icon:LayoutGrid,
            path:'/dashboard'
        },
        {
            id:2,
            name:'Budgets',
            icon:PiggyBank,
            path:'/dashboard/budgets'
        },
        {
            id:3,
            name:'Expenses',
            icon:ReceiptText,
            path:'/dashboard/expenses'
        },
        {
            id:4,
            name:'Income',
            icon:Banknote,
            path:'/dashboard/income'
        },
        {
            id:5,
            name:'Goals',
            icon:GoalIcon,
            path:'/dashboard/goals'
        },
        {
            id:6,
            name:'FinBot',
            icon: Bot,
            path:'/dashboard/Chatbot'
        }
    ]
    const path=usePathname();

    useEffect( ()=> {
        console.log(path)
    },[path])
  return (
    <div className='h-screen p-5 border shadow-sm'>
        <Image src={'/logo.png'}
        alt="Logo" width={65} height={40}
        />
        <div className='mt-8'>
            {menuList.map((menu,index)=>(
                <Link href={menu.path}>
                    <h2 className={`flex gap-2 items-center 
                    text-gray-500 font-medium
                    mb-2
                    p-5 cursor-pointer rounded-md
                    hover:text-primary hover:bg-purple-200
                    ${path==menu.path&&'text-primary bg-purple-200'}
                    `}>
                        <menu.icon />
                        {menu.name}
                    </h2>
                </Link>
            ))}
        </div>
        <div className='fixed bottom-8 p-5 flex gap-2
        items-center'>
            <UserButton />
            Profile
        </div>
    </div>
  )
}

export default SideNav