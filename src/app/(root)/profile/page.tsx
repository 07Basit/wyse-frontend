"use client"

import { Button } from '@/components/ui/button'
import { logoutApi } from '@/services/auth/user-account'
import { useBoundStore } from '@/store/store'
import Link from 'next/link'
import React from 'react'

const ProfilePage = () => {


  const setToken = useBoundStore(state => state.setToken)

  async function handleLogout(){
    setToken("")
    const res = await logoutApi()
    console.log(res)
  }

  return (
    <div className='main-container'>
      <Link href={"/profile/details"} >Edit Profile</Link>
      <Button onClick={handleLogout} variant={'outline'} className='w-full'>
        Logout
      </Button>
    </div>
  )
}

export default ProfilePage