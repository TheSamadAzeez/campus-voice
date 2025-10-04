'use client'

import { useState, useTransition } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { updateUserRole } from '@/utils/actions/user'
import { toast } from 'sonner'
import { Loader2, Shield, UserCheck } from 'lucide-react'

interface RoleUpdateSelectProps {
  userId: string
  currentRole: string
  userName: string
}

export function RoleUpdateSelect({ userId, currentRole, userName }: RoleUpdateSelectProps) {
  const [isPending, startTransition] = useTransition()
  const [role, setRole] = useState(currentRole)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [pendingRole, setPendingRole] = useState<'admin' | 'student' | null>(null)

  const handleRoleChange = (newRole: 'admin' | 'student') => {
    if (newRole === role) return

    setPendingRole(newRole)
    setShowConfirmDialog(true)
  }

  const confirmRoleChange = () => {
    if (!pendingRole) return

    startTransition(async () => {
      try {
        const result = await updateUserRole(userId, pendingRole)

        if (result.success) {
          setRole(pendingRole)
          toast.success(`${userName}'s role updated to ${pendingRole}`)
        } else {
          toast.error(result.error || 'Failed to update role')
        }
      } catch (error) {
        console.error('Error updating role:', error)
        toast.error('Failed to update role')
      } finally {
        setShowConfirmDialog(false)
        setPendingRole(null)
      }
    })
  }

  const cancelRoleChange = () => {
    setShowConfirmDialog(false)
    setPendingRole(null)
  }

  return (
    <>
      <div className="flex items-center space-x-2">
        <Select value={role} onValueChange={handleRoleChange} disabled={isPending}>
          <SelectTrigger className="w-[70px]">
            {isPending ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="h-3 w-3 animate-spin" />
                <span className="text-xs">Updating...</span>
              </div>
            ) : (
              <SelectValue>
                <div
                  className={`h-3 w-3 rounded-full ${
                    role === 'admin' ? 'bg-[#b961ff]' : role === 'department-admin' ? 'bg-[#ff6900]' : 'bg-[#3e8aff]'
                  }`}
                />
              </SelectValue>
            )}
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="student">
              <Badge className="bg-[#d4e5ff] text-xs text-[#3e8aff]">Student</Badge>
            </SelectItem>
            <SelectItem value="department-admin">
              <Badge className="bg-[#ffe1cc] text-xs text-[#ff6900]">Department-Admin</Badge>
            </SelectItem>
            <SelectItem value="admin">
              <Badge className="bg-[#efdaff] text-xs text-[#b961ff]">Admin</Badge>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              {pendingRole === 'admin' ? (
                <Shield className="text-destructive h-5 w-5" />
              ) : (
                <UserCheck className="text-muted-foreground h-5 w-5" />
              )}
              <span>Confirm Role Change</span>
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to change <strong>{userName}</strong>&apos;s role from{' '}
              <Badge variant={role === 'admin' ? 'destructive' : 'secondary'} className="mx-1">
                {role}
              </Badge>
              to{' '}
              <Badge variant={pendingRole === 'admin' ? 'destructive' : 'secondary'} className="mx-1">
                {pendingRole}
              </Badge>
              ?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={cancelRoleChange} disabled={isPending}>
              Cancel
            </Button>
            <Button
              onClick={confirmRoleChange}
              disabled={isPending}
              variant={pendingRole === 'admin' ? 'destructive' : 'default'}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                `Change to ${pendingRole}`
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
