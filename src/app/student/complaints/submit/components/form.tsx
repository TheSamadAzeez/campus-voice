'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { CATEGORIES, FACULTIES, RESOLUTION_TYPES } from '../enums'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { CldUploadButton } from 'next-cloudinary'
import { ScrollArea } from '@/components/ui/scroll-area'

const complaintSchema = z.object({
  category: z.string().nonempty('category is required'),
  faculty: z.string().nonempty('faculty is required'),
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
  description: z.string().min(1, 'Description is required'),
  resolutionType: z.string().optional(),
})

type ComplaintValues = {
  category: string
  faculty: string
  title: string
  description: string
  resolutionType?: string
}

export function ComplaintForm() {
  const form = useForm<ComplaintValues>({
    resolver: zodResolver(complaintSchema),
  })

  const {
    register,
    handleSubmit,
    control,
    formState: { isSubmitting, errors, isValid },
  } = form

  return (
    <form noValidate onSubmit={handleSubmit(() => {})} className="w-full space-y-4">
      {/* Category Selection */}
      <div className="flex flex-col gap-2">
        <Label className="font-medium text-gray-700">Category *</Label>

        <Controller
          name="category"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger id="category" className="w-full">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        <p className="text-xs text-red-600">{errors.category?.message}</p>
      </div>

      {/* Faculty Selection */}
      <div className="flex flex-col gap-2">
        <Label className="font-medium text-gray-700">Faculty *</Label>

        <Controller
          name="faculty"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger id="faculty" className="w-full">
                <SelectValue placeholder="Select a faculty" />
              </SelectTrigger>
              <SelectContent>
                {FACULTIES.map((faculty) => (
                  <SelectItem key={faculty} value={faculty}>
                    {faculty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        <p className="text-xs text-red-600">{errors.faculty?.message}</p>
      </div>

      {/* Title */}
      <div className="flex flex-col gap-2">
        <Label className="font-medium text-gray-700">Title *</Label>
        <Input
          id="title"
          {...register('title')}
          type="text"
          className="w-full rounded-lg border border-gray-200 p-3 transition-all"
          placeholder="Brief description of your complaint"
          maxLength={100}
        />
        <p className="text-xs text-red-600">{errors.title?.message}</p>
      </div>

      {/* Description */}
      <div className="flex flex-col gap-2">
        <Label className="font-medium text-gray-700">Description *</Label>
        <Textarea
          id="description"
          {...register('description')}
          className="min-h-[200px] w-full rounded-lg border border-gray-200 p-3 transition-all focus:border-transparent focus:ring-2 focus:ring-[#24c0b7]"
          placeholder="Please provide detailed information about your complaint"
        />
        <p className="text-xs text-red-600">{errors.description?.message}</p>
      </div>

      {/* File Upload */}
      <div className="flex items-center justify-between gap-2">
        <Label htmlFor="file-upload" className="font-medium text-gray-700">
          Attachments (Max size: 3MB)
        </Label>
        <CldUploadButton
          className="cursor-pointer rounded-3xl bg-[#f1f5f9] p-4 font-bold text-[#24c0b7] transition-colors hover:bg-[#24c0b7] hover:text-white"
          uploadPreset="your_unsigned_preset"
          options={{ maxFiles: 5, maxFileSize: 3 * 1024 * 1024 }} // 3MB
          onUpload={() => {}}
        >
          Upload Attachment
        </CldUploadButton>
      </div>

      {/* Resolution Type */}
      <div className="flex flex-col gap-2">
        <Label className="font-medium text-gray-700">Expected Resolution Type (Optional)</Label>

        <Controller
          name="resolutionType"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger id="resolutionType" className="w-full">
                <SelectValue placeholder="Select a resolution type" />
              </SelectTrigger>
              <SelectContent>
                {RESOLUTION_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <Separator className="bg-gray-200" />

      {/* Submit Button */}
      <Button
        type="submit"
        className="transition-color w-full bg-[#24c0b7] py-6 hover:bg-[#f1f5f9] hover:text-black"
        disabled={isSubmitting}
      >
        <p className="text-lg font-bold">{isSubmitting ? 'Submitting' : 'Submit Complaint'}</p>
      </Button>
    </form>
  )
}
