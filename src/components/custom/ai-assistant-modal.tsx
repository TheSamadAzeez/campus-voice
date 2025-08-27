'use client'

import { useState } from 'react'
import { MessageSquareText, Bot, Sparkles, Headset } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

export function AIAssistantModal() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="h-10 w-10 rounded-2xl">
          <Headset className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md" showCloseButton={false}>
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#24c0b7] to-blue-500">
            <Bot className="h-8 w-8 text-white" />
          </div>
          <DialogTitle className="text-center text-xl font-semibold">AI Assistant Coming Soon!</DialogTitle>
          <DialogDescription className="text-center text-base">
            We&apos;re working hard to bring you an intelligent AI assistant to help with your campus needs.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6 space-y-4">
          <div className="rounded-lg border border-dashed border-gray-300 p-4">
            <div className="flex items-center space-x-3">
              <Sparkles className="h-5 w-5 text-yellow-500" />
              <div>
                <h4 className="font-medium text-gray-900">Smart Assistance</h4>
                <p className="text-sm text-gray-600">Get instant help with complaints, campus info, and more</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-dashed border-gray-300 p-4">
            <div className="flex items-center space-x-3">
              <MessageSquareText className="h-5 w-5 text-blue-500" />
              <div>
                <h4 className="font-medium text-gray-900">24/7 Support</h4>
                <p className="text-sm text-gray-600">Available anytime to answer your questions and provide guidance</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">Stay tuned for updates!</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
