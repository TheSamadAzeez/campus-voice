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
import { CldUploadButton } from 'next-cloudinary'
import { complaintSchema } from '../zod'
import { useState } from 'react'
import { toast } from 'sonner'
import { createComplaintWithAttachment } from '@/utils/actions/complaints'

type ComplaintValues = {
  category: string
  faculty: string
  title: string
  description: string
  resolutionType?: string
}

export function ComplaintForm() {
  const [fileData, setFileData] = useState<any>(null)

  const form = useForm<ComplaintValues>({
    resolver: zodResolver(complaintSchema),
  })

  const {
    register,
    handleSubmit,
    control,
    formState: { isSubmitting, errors, isValid },
  } = form

  const handleUpload = (result: any) => {
    // Handle the uploaded file result here
    setFileData(result?.info)
  }

  const onSubmit = async (data: ComplaintValues) => {
    console.log('Form submitted with data:', data)
    console.log('File data:', fileData)

    const formData = new FormData()

    formData.append('title', data.title)
    formData.append('description', data.description)
    formData.append('category', data.category.toLowerCase())

    // Map faculty values to database enum values
    const facultyMap: Record<string, string> = {
      Science: 'science',
      'Management Science': 'management science',
      Arts: 'art',
      Law: 'law',
      Transport: 'transport',
      Education: 'education',
      Other: 'other',
    }

    const dbFaculty = facultyMap[data.faculty] || 'other'
    formData.append('faculty', dbFaculty)

    // Map the display values to database enum values
    const resolutionTypeMap: Record<string, string> = {
      'Immediate Action': 'immediate action',
      'Investigation Required': 'investigation',
      'Policy Change': 'policy change',
      'No Specific Preference': 'other',
    }

    const dbResolutionType = data.resolutionType ? resolutionTypeMap[data.resolutionType] || 'other' : 'other'
    formData.append('resolutionType', dbResolutionType)

    // Add file data only if file was uploaded
    if (fileData && fileData.secure_url) {
      formData.append('cloudinaryUrl', fileData.secure_url)
      formData.append('cloudinaryPublicId', fileData.public_id)
      formData.append('fileSize', fileData.bytes.toString())
      formData.append('fileType', fileData.resource_type)
      formData.append('fileName', fileData.original_filename)
    }

    console.log('Submitting form data...')

    const result = await createComplaintWithAttachment(formData)

    console.log('Submission result:', result)

    if (result.success) {
      toast.success('Complaint submitted successfully!', {
        description: 'Your complaint has been submitted and will be reviewed shortly.',
      })
      form.reset()
      setFileData(null)
    } else {
      toast.error('Failed to submit complaint', {
        description: result.error || 'An unexpected error occurred. Please try again later.',
      })
    }
  }

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
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
                  <SelectItem className="capitalize" key={category} value={category}>
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
      <div className="flex flex-col gap-2">
        <Label htmlFor="file-upload" className="font-medium text-gray-700">
          Attachments (Optional - Max size: 3MB)
        </Label>
        <div className="flex items-center justify-between gap-2">
          <CldUploadButton
            className="cursor-pointer rounded-3xl bg-[#24c0b7] p-3 font-bold text-white transition-colors hover:bg-[#f1f5f9] hover:text-[#24c0b7]"
            uploadPreset="ml_default"
            options={{ maxFiles: 5, maxFileSize: 3 * 1024 * 1024 }} // 3MB
            onUpload={handleUpload}
          >
            Upload Attachment
          </CldUploadButton>
          {fileData && <span className="text-sm text-green-600">✓ {fileData.original_filename} uploaded</span>}
        </div>
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
        className="w-full bg-[#24c0b7] py-6 text-white transition-colors hover:bg-[#f1f5f9] hover:text-[#24c0b7]"
        disabled={isSubmitting}
      >
        <p className="text-lg font-bold">{isSubmitting ? 'Submitting...' : 'Submit Complaint'}</p>
      </Button>
    </form>
  )
}
