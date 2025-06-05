import { Bell, MessageSquareText, User } from 'lucide-react'
import { Button } from '../ui/button'
import { Separator } from '../ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'

export function Header() {
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
            <User className="size-4" />
          </Button>
        </AvatarFallback>
      </Avatar>
    </div>
  )
}
