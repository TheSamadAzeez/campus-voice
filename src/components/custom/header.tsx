import { Bell, LogOut, MessageSquareText, User } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Button } from '../ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Separator } from '../ui/separator'
import { cn } from '@/lib/utils'

interface UserData {
  name: string
  email: string
  avatar: string
  role: 'student' | 'admin'
}

export function Header({ userData }: { userData: UserData }) {
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
          <Button variant="outline" size="icon" className="h-10 w-10 rounded-2xl">
            <Popover>
              <PopoverTrigger>
                <User className="size-4" />
              </PopoverTrigger>
              <PopoverContent>
                <div className="flex flex-col justify-center gap-2 px-1">
                  <span
                    className={cn(
                      'w-fit self-end rounded-md bg-[#d4e5ff] p-3 py-1 text-xs font-medium text-blue-500',
                      userData.role === 'admin' && 'bg-[#ffe1cc] text-orange-500',
                    )}
                  >
                    {userData.role}
                  </span>

                  <div className="flex flex-col items-center justify-between gap-2">
                    <div className="size-10 rounded-full bg-gray-200"></div>

                    <div className="flex flex-col items-center justify-center gap-1">
                      <h1 className="text-sm font-medium capitalize">{userData.name}</h1>
                      <p className="text-xs text-gray-500">{userData.email.toLowerCase()}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="icon" className="h-10 w-10 rounded-2xl" role="logout">
                        <LogOut className="size-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </Button>
        </AvatarFallback>
      </Avatar>
    </div>
  )
}
