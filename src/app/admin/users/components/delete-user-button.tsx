'use client'

import { useState, useTransition } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { deleteUserFromClerk } from '@/utils/actions/user'
import { toast } from 'sonner'
import { Loader2, Trash2, AlertTriangle } from 'lucide-react'

interface DeleteUserButtonProps {
  userId: string
  userName: string
  userEmail: string
  userRole: string
}

export function DeleteUserButton({ userId, userName, userEmail, userRole }: DeleteUserButtonProps) {
  const [isPending, startTransition] = useTransition()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  // Don't allow deletion of admin users
  if (userRole === 'admin') {
    return (
      <Button variant="outline" size="sm" className="h-8 w-8 p-0" disabled title="Cannot delete admin users">
        <Trash2 className="h-4 w-4 opacity-50" />
      </Button>
    )
  }

  const handleDeleteUser = () => {
    startTransition(async () => {
      try {
        const result = await deleteUserFromClerk(userId)

        if (result.success) {
          toast.success(`${userName} has been deleted successfully`)
          setShowDeleteDialog(false)
        } else {
          toast.error(result.error || 'Failed to delete user')
        }
      } catch (error) {
        console.error('Error deleting user:', error)
        toast.error('Failed to delete user')
      }
    })
  }

  return (
    <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm" className="h-8 w-8 p-0">
          <Trash2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-destructive flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5" />
            <span>Delete User</span>
          </DialogTitle>
          <DialogDescription className="space-y-3">
            <div>Are you sure you want to permanently delete this user? This action cannot be undone.</div>
            <div className="bg-muted/50 rounded-lg border p-3">
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">Name:</span> {userName}
                </div>
                <div>
                  <span className="font-medium">Email:</span> {userEmail}
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium">Role:</span>
                  <Badge variant={userRole === 'admin' ? 'destructive' : 'secondary'} className="text-xs">
                    {userRole}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="text-destructive text-sm font-medium">
              ⚠️ This will delete the user from both Clerk and the local database.
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col gap-2 sm:flex-row">
          <Button
            variant="outline"
            onClick={() => setShowDeleteDialog(false)}
            disabled={isPending}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDeleteUser} disabled={isPending} className="w-full sm:w-auto">
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete User
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
