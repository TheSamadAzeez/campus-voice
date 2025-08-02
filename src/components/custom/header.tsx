import { cn } from '@/lib/utils'
import { SignOutButton } from '@clerk/nextjs'
import { Bell, LogOut, MessageSquareText, User } from 'lucide-react'
import Image from 'next/image'
import { Suspense } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Button } from '../ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Separator } from '../ui/separator'
import { getUser } from '@/utils/actions/user'

export async function Header() {
  const { user, success } = await getUser()

  if (success === false) {
    return null
  }

  return (
    <div className="flex items-center justify-end gap-3">
      <Button variant="outline" size="icon" className="h-10 w-10 rounded-2xl">
        <Bell className="size-4" />
      </Button>

      <Button variant="outline" size="icon" className="h-10 w-10 rounded-2xl">
        <MessageSquareText className="size-4" />
      </Button>

      <Separator orientation="vertical" className="h-4" />

      <Avatar className="h-10 w-10 rounded-2xl">
        <AvatarImage src="" alt="avatar" className="rounded-2xl" />
        <AvatarFallback>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon" className="h-10 w-10 rounded-2xl">
                <User className="size-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <div className="flex flex-col justify-center gap-2 px-1">
                <span
                  className={cn(
                    'w-fit self-end rounded-md bg-[#d4e5ff] p-3 py-1 text-xs font-medium text-blue-500',
                    user?.role === 'admin' && 'bg-[#ffe1cc] text-orange-500',
                  )}
                >
                  {user?.role}
                </span>

                <div className="flex flex-col items-center justify-between gap-2">
                  <Suspense>
                    <Image
                      src={user?.profileImage || ''}
                      alt="avatar"
                      width={40}
                      height={40}
                      className="size-10 rounded-full bg-gray-200"
                    />
                  </Suspense>

                  <div className="flex flex-col items-center justify-center gap-1">
                    <h1 className="text-sm font-medium capitalize">{user?.name || 'User?'}</h1>
                    <p className="text-xs text-gray-500">{user?.email?.toLowerCase()}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <SignOutButton redirectUrl="/">
                      <Button variant="outline" size="icon" className="h-10 w-10 rounded-2xl" role="logout">
                        <LogOut className="size-4" />
                      </Button>
                    </SignOutButton>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </AvatarFallback>
      </Avatar>
    </div>
  )
}
