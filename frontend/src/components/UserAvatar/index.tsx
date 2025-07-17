'use client'

import { useState } from "react"

export default function UserAvatar () {
  const [avatar] = useState<string>(`${process.env.NEXT_PUBLIC_RANDOM_AVATAR_API}=${Math.random()}`)

  return (
    <img
      src={avatar}
      alt='avatar-user'
      className='rounded-full w-11 h-11 border border-theme bg-surface-secondary'
    />
  )
}