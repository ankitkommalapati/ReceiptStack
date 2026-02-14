"use client";

import React from 'react'
import { ReceiptText } from 'lucide-react'
import { Button } from './ui/button'
import Link from 'next/link';

function Header() {
  return (
    <div className='p-4 flex justify-between items-center'>
        <Link href='/' className='flex items-center'>
            <ReceiptText className='w-6 h-6 text-green-900 mr-3'/>
            <h1 className='text-xl font-semibold'>ReceiptStack</h1>
        </Link>
        <div></div>
    </div>
  )
}

export default Header