'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import Form from 'next/form'

const CATEGORIES = ['Academic', 'Faculty Issue', 'Result Delay', 'Harassment', 'Infrastructure', 'Other']

const RESOLUTION_TYPES = ['Immediate Action', 'Investigation Required', 'Policy Change', 'No Specific Preference']

export default function SubmitComplaintPage() {
  return (
    <Card className="mx-auto w-[70%] border-none shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Submit a Complaint</CardTitle>
        <CardDescription>
          Fill out the form below to submit your complaint. All fields marked with * are required.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-6">
        <Form action="" className="space-y-4">
          {/* Category Selection */}
          <div className="flex flex-col gap-2">
            <label className="font-medium text-gray-700">Category *</label>

            <Select>
              <SelectTrigger className="w-full">
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
          </div>

          {/* Title */}
          <div className="flex flex-col gap-2">
            <label className="font-medium text-gray-700">Title *</label>
            <input
              type="text"
              className="w-full rounded-lg border border-gray-200 p-3 transition-all"
              placeholder="Brief description of your complaint"
              required
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-2">
            <label className="font-medium text-gray-700">Description *</label>
            <textarea
              className="min-h-[200px] w-full rounded-lg border border-gray-200 p-3 transition-all focus:border-transparent focus:ring-2 focus:ring-[#24c0b7]"
              placeholder="Please provide detailed information about your complaint"
              required
            />
          </div>

          {/* File Upload */}
          <div className="flex flex-col gap-2">
            <label className="font-medium text-gray-700">Attachments (Optional)</label>
            <div className="rounded-lg border-2 border-dashed border-gray-200 p-6 text-center transition-colors hover:border-[#24c0b7]">
              <input type="file" className="hidden" id="file-upload" accept=".pdf,.jpg,.jpeg,.png" />
              <label htmlFor="file-upload" className="cursor-pointer text-[#24c0b7] hover:text-[#24c0b7]/90">
                Click to upload or drag and drop
              </label>
              <p className="mt-2 text-xs text-gray-500">Supported formats: PDF, JPG, PNG (Max size: 5MB)</p>
            </div>
          </div>

          {/* Resolution Type */}
          <div className="flex flex-col gap-2">
            <label className="font-medium text-gray-700">Expected Resolution Type (Optional)</label>

            <Select>
              <SelectTrigger className="w-full">
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
          </div>

          <Separator className="bg-gray-200" />

          {/* Submit Button */}
          <Button
            type="submit"
            className="transition-color w-full bg-[#24c0b7] py-6 hover:bg-[#f1f5f9] hover:text-black"
          >
            <p className="text-lg font-bold">Submit Complaint</p>
          </Button>
        </Form>
      </CardContent>
    </Card>
  )
}
