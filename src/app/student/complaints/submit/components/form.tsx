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
import { useState, useOptimistic } from 'react'
import { toast } from 'sonner'
import { createComplaintWithAttachment } from '@/utils/actions/complaints'
import { deleteFromCloudinary } from '@/utils/helper-functions'

type ComplaintValues = {
  category: string
  faculty: string
  title: string
  description: string
  resolutionType?: string
}

export function ComplaintForm() {
  const [fileData, setFileData] = useState<any[]>([])
  const [optimisticFileData, updateOptimisticFileData] = useOptimistic(
    fileData,
    (state, action: { type: 'remove'; index: number }) => {
      if (action.type === 'remove') {
        return state.filter((_, i) => i !== action.index)
      }
      return state
    },
  )

  const form = useForm<ComplaintValues>({
    resolver: zodResolver(complaintSchema),
  })

  const {
    register,
    handleSubmit,
    control,
    formState: { isSubmitting, errors },
  } = form

  const handleUpload = (result: any) => {
    // Handle the uploaded file result here
    const fileInfo = result?.info
    if (fileInfo) {
      console.log('✅ File uploaded successfully:', fileInfo.original_filename)

      if (optimisticFileData.length >= 3) {
        toast.error('Maximum 3 files allowed')
        return
      }

      setFileData((prev) => [...prev, fileInfo])
      toast.success(`File "${fileInfo.original_filename}" uploaded successfully`)
    } else {
      console.error('❌ Upload failed - no file info received')
    }
  }

  const removeFile = (index: number) => {
    const fileToRemove = optimisticFileData[index]

    // Optimistic update: Remove from UI immediately
    updateOptimisticFileData({ type: 'remove', index })
    toast.success('File removed successfully')

    // Update the actual state immediately for the form submission
    setFileData((prev) => prev.filter((_, i) => i !== index))

    // Delete from Cloudinary in the background
    if (fileToRemove?.public_id || fileToRemove?.publicId) {
      const publicId = fileToRemove.public_id || fileToRemove.publicId

      deleteFromCloudinary(publicId)
        .then((success) => {
          if (!success) {
            // Only show error if it's a real failure, not just "file not found"
            console.warn('Failed to delete file from cloud storage, but file was removed from form')
          }
        })
        .catch((error) => {
          console.error('Error deleting from Cloudinary:', error)
          // Reduced error visibility since the file was already removed from the form
          console.warn('Failed to delete file from cloud storage, but file was removed from form')
        })
    }
  }

  const getFileTypeIcon = (resourceType: string, format: string) => {
    if (resourceType === 'image') return '🖼️'
    if (resourceType === 'video') return '🎥'
    if (resourceType === 'audio') return '🎵'
    if (format === 'pdf') return '📄'
    return '📎'
  }

  const onSubmit = async (data: ComplaintValues) => {
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

    // Add file data for multiple files
    if (fileData && fileData.length > 0) {
      fileData.forEach((file, index) => {
        // Handle different possible property names from Cloudinary
        const secureUrl = file.secure_url || file.url
        const publicId = file.public_id || file.publicId
        const bytes = file.bytes || file.size
        const resourceType = file.resource_type || file.resourceType || file.type
        const originalFilename = file.original_filename || file.originalFilename || file.name || file.filename

        formData.append(`cloudinaryUrl_${index}`, secureUrl)
        formData.append(`cloudinaryPublicId_${index}`, publicId || '')
        formData.append(`fileSize_${index}`, (bytes || 0).toString())
        formData.append(`fileType_${index}`, resourceType || 'unknown')
        formData.append(`fileName_${index}`, originalFilename || 'unknown')
      })
      formData.append('fileCount', fileData.length.toString())
    }

    const result = await createComplaintWithAttachment(formData)

    if (result.success) {
      toast.success('Complaint submitted successfully!', {
        description: 'Your complaint has been submitted and will be reviewed shortly.',
      })
      form.reset()
      setFileData([])
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
          Attachments (Optional - Max 3 files, 3MB each)
        </Label>
        <div className="space-y-3">
          {optimisticFileData.length < 3 && (
            <CldUploadButton
              className="cursor-pointer rounded-3xl bg-[#24c0b7] p-3 font-bold text-white transition-colors hover:bg-[#f1f5f9] hover:text-[#24c0b7] disabled:cursor-not-allowed disabled:opacity-50"
              uploadPreset="ml_default"
              options={{
                maxFiles: 1,
                maxFileSize: 3 * 1024 * 1024,
                multiple: false,
                sources: ['local', 'camera'],
                clientAllowedFormats: [
                  'jpg',
                  'jpeg',
                  'png',
                  'gif',
                  'webp',
                  'bmp',
                  'svg', // Images
                  'mp4',
                  'mov',
                  'avi',
                  'wmv',
                  'flv',
                  'webm',
                  'm4v', // Videos
                  'mp3',
                  'wav',
                  'ogg',
                  'aac',
                  'm4a',
                  'flac', // Audio
                  'pdf', // Documents
                ],
                resourceType: 'auto',
              }}
              onSuccess={(result: any) => {
                console.log('🎉 Upload SUCCESS callback triggered:', result)
                handleUpload(result)
              }}
              onError={(error: any) => {
                console.error('❌ Upload ERROR:', error)
                toast.error('Upload failed. Please try again.')
              }}
              onUpload={(result: any) => {
                console.log('📤 Upload PROGRESS callback triggered:', result)
              }}
            >
              {optimisticFileData.length === 0 ? 'Upload Attachment' : 'Upload Another File'}
            </CldUploadButton>
          )}

          {/* Display uploaded files info */}
          {optimisticFileData.length > 0 && (
            <div className="space-y-3">
              <p className="text-sm font-medium text-gray-700">Uploaded files:</p>
              <div className="flex flex-wrap gap-3">
                {optimisticFileData.map((file, index) => (
                  <div key={index} className="flex flex-1 items-center justify-between">
                    {/* File info and remove button */}
                    <div className="flex flex-1 items-center justify-between rounded-lg border border-gray-200 p-3">
                      <div className="flex min-w-0 items-center gap-2">
                        <span className="flex-shrink-0 text-lg">
                          {getFileTypeIcon(file.resource_type || file.resourceType, file.format)}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-gray-900">
                            {file.original_filename || file.name || `File ${index + 1}`}
                          </p>
                          <p className="text-xs text-gray-500">
                            {file.resource_type || file.resourceType || 'unknown'}
                            {' • '}
                            {Math.round((file.bytes || 0) / 1024)} KB
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="ml-2 flex-shrink-0 rounded-full p-1 text-red-500 transition-colors hover:bg-red-50"
                        title="Remove file"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {optimisticFileData.length === 0 && (
            <p className="text-sm text-gray-500">
              No files uploaded yet. Supported formats: Images, Videos, Audio, and PDF files.
            </p>
          )}

          {optimisticFileData.length >= 3 && (
            <p className="text-sm text-amber-600">Maximum of 3 files reached. Remove a file to upload another.</p>
          )}
        </div>
      </div>

      {/* Resolution Type */}
      <div className="hidden flex-col gap-2">
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
