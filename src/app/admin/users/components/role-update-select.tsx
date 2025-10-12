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
import { Label } from '@/components/ui/label'
import { updateUserRole } from '@/utils/actions/user'
import { toast } from 'sonner'
import { Loader2, Shield, UserCheck } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { FACULTIES, DEPARTMENTS } from '@/app/student/complaints/submit/enums'

// Schema for department admin role update
const departmentAdminSchema = z.object({
  faculty: z.string().min(1, 'Faculty is required'),
  department: z.string().min(1, 'Department is required'),
})

type DepartmentAdminFormData = z.infer<typeof departmentAdminSchema>

interface RoleUpdateSelectProps {
  userId: string
  currentRole: string
  userName: string
}

export function RoleUpdateSelect({ userId, currentRole, userName }: RoleUpdateSelectProps) {
  const [isPending, startTransition] = useTransition()
  const [role, setRole] = useState(currentRole)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [pendingRole, setPendingRole] = useState<'admin' | 'student' | 'department-admin' | null>(null)

  // Form for department admin selection
  const form = useForm<DepartmentAdminFormData>({
    resolver: zodResolver(departmentAdminSchema),
    defaultValues: {
      faculty: '',
      department: '',
    },
  })

  const selectedFaculty = form.watch('faculty')
  const availableDepartments = selectedFaculty ? DEPARTMENTS[selectedFaculty as keyof typeof DEPARTMENTS] : []

  const handleRoleChange = (newRole: 'admin' | 'student' | 'department-admin') => {
    if (newRole === role) return

    setPendingRole(newRole)
    // Reset form when changing roles
    form.reset()
    setShowConfirmDialog(true)
  }

  const confirmRoleChange = async () => {
    if (!pendingRole) return

    // If role is department-admin, validate form first
    if (pendingRole === 'department-admin') {
      const isValid = await form.trigger()
      if (!isValid) {
        toast.error('Please select both faculty and department')
        return
      }
    }

    startTransition(async () => {
      try {
        let departmentInfo = null
        if (pendingRole === 'department-admin') {
          const formData = form.getValues()
          departmentInfo = {
            faculty: formData.faculty,
            department: formData.department,
          }
        }

        const result = await updateUserRole(userId, pendingRole, departmentInfo)

        if (result.success) {
          setRole(pendingRole)
          toast.success(`${userName}'s role updated to ${pendingRole}`)
          // Reset form
          form.reset()
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
    form.reset()
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
              {pendingRole === 'department-admin' ? (
                <>
                  <p className="mb-4">
                    You are about to change <strong>{userName}</strong>&apos;s role to{' '}
                    <Badge className="mx-1 bg-[#ffe1cc] text-xs text-[#ff6900]">Department-Admin</Badge>. Please select
                    the faculty and department they will be in charge of:
                  </p>
                </>
              ) : (
                <>
                  Are you sure you want to change <strong>{userName}</strong>&apos;s role from{' '}
                  <Badge
                    className={`mx-1 text-xs ${
                      role === 'admin'
                        ? 'bg-[#efdaff] text-[#b961ff]'
                        : role === 'department-admin'
                          ? 'bg-[#ffe1cc] text-[#ff6900]'
                          : 'bg-[#d4e5ff] text-[#3e8aff]'
                    }`}
                  >
                    {role}
                  </Badge>
                  to{' '}
                  <Badge
                    className={`mx-1 text-xs ${
                      pendingRole === 'admin'
                        ? 'bg-[#efdaff] text-[#b961ff]'
                        : (pendingRole as string) === 'department-admin'
                          ? 'bg-[#ffe1cc] text-[#ff6900]'
                          : 'bg-[#d4e5ff] text-[#3e8aff]'
                    }`}
                  >
                    {pendingRole}
                  </Badge>
                  ?
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          {/* Department Selection Form for Department Admin Role */}
          {pendingRole === 'department-admin' && (
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="faculty" className="text-sm font-medium">
                  Faculty <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={form.watch('faculty')}
                  onValueChange={(value) => {
                    form.setValue('faculty', value)
                    form.setValue('department', '') // Reset department when faculty changes
                  }}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select faculty" />
                  </SelectTrigger>
                  <SelectContent>
                    {FACULTIES.map((faculty) => (
                      <SelectItem key={faculty} value={faculty}>
                        {faculty}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.faculty && (
                  <p className="mt-1 text-sm text-red-500">{form.formState.errors.faculty.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="department" className="text-sm font-medium">
                  Department <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={form.watch('department')}
                  onValueChange={(value) => form.setValue('department', value)}
                  disabled={!selectedFaculty}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder={selectedFaculty ? 'Select department' : 'Select faculty first'} />
                  </SelectTrigger>
                  <SelectContent>
                    {availableDepartments.map((department) => (
                      <SelectItem key={department} value={department}>
                        {department}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.department && (
                  <p className="mt-1 text-sm text-red-500">{form.formState.errors.department.message}</p>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={cancelRoleChange} disabled={isPending}>
              Cancel
            </Button>
            <Button
              onClick={confirmRoleChange}
              disabled={isPending}
              className={`${
                pendingRole === 'admin'
                  ? 'bg-[#b961ff] text-white hover:bg-[#a855f7]'
                  : pendingRole === 'department-admin'
                    ? 'bg-[#ff6900] text-white hover:bg-[#ea580c]'
                    : 'bg-[#3e8aff] text-white hover:bg-[#2563eb]'
              }`}
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
