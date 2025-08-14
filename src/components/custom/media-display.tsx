'use client'

import { CldImage } from 'next-cloudinary'

interface MediaDisplayProps {
  type: string
  src: string
  alt?: string
  fileName: string
}

export default function MediaDisplay({ type, src, alt, fileName }: MediaDisplayProps) {
  // Determine media type based on file type
  const getMediaType = (fileType: string) => {
    if (fileType === 'image' || fileType.startsWith('image/')) {
      return 'image'
    }
    if (fileType === 'audio' || fileType.startsWith('audio/')) {
      return 'audio'
    }
    if (fileType === 'video' || fileType.startsWith('video/')) {
      return 'video'
    }
    if (fileType.includes('pdf') || fileName.toLowerCase().endsWith('.pdf')) {
      return 'pdf'
    }
    return 'unknown'
  }

  const mediaType = getMediaType(type)

  if (mediaType === 'image') {
    return (
      <div className="flex w-80 flex-col items-center overflow-hidden rounded-lg border">
        <CldImage
          width="300"
          height="200"
          src={src}
          alt={alt || fileName || 'Image'}
          className="h-64 w-full object-cover"
        />
        <div className="w-full bg-gray-50 p-2">
          <p className="truncate text-sm text-gray-600">{fileName}</p>
        </div>
      </div>
    )
  }

  if (mediaType === 'audio') {
    return (
      <div className="w-80 rounded-lg border">
        <div className="flex h-64 flex-col justify-center p-4">
          <p className="mb-4 text-sm text-gray-600">{fileName}</p>
          <audio controls className="w-full">
            <source src={src} type="audio/mpeg" />
            <source src={src} type="audio/wav" />
            <source src={src} type="audio/mp3" />
            Your browser does not support the audio element.
          </audio>
        </div>
      </div>
    )
  }

  if (mediaType === 'video') {
    return (
      <div className="w-80 overflow-hidden rounded-lg border">
        <video
          controls
          className="h-64 w-full bg-black object-cover"
          preload="metadata"
          onError={(e) => console.error('Video failed to load:', e)}
        >
          <source src={src} type="video/mp4" />
          <source src={src} type="video/webm" />
          <source src={src} type="video/ogg" />
          Your browser does not support the video element.
        </video>
        <div className="w-full bg-gray-50 p-2">
          <p className="truncate text-sm text-gray-600">{fileName}</p>
        </div>
      </div>
    )
  }

  if (mediaType === 'pdf') {
    return (
      <div className="w-80 overflow-hidden rounded-lg border">
        <div className="w-full border-b bg-gray-50 p-2">
          <p className="truncate text-sm text-gray-600">{fileName}</p>
        </div>
        <iframe src={src} width="100%" height="256" style={{ border: 'none' }} title={fileName} />
      </div>
    )
  }

  // Fallback for unknown types - show as download link
  return (
    <div className="w-80 rounded-lg border">
      <div className="flex h-64 items-center p-4">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-700">{fileName}</p>
          <p className="text-xs text-gray-500">Unsupported media type: {type}</p>
        </div>
        <a
          href={src}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded bg-blue-100 px-3 py-1 text-xs text-blue-700 transition-colors hover:bg-blue-200"
        >
          View
        </a>
      </div>
    </div>
  )
}
