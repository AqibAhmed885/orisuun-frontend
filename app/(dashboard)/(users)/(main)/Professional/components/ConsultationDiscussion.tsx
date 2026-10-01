"use client"
import React, { useEffect, useRef, useState } from 'react'
import { AttachFileIcon } from '@/icons/chats/textarea-icons'
import { ALLOWED_FILE_TYPES, uploadFileToAzure, validateFile } from '@/app/api/dashboard/azure-upload'

type Props = {
  notes: string
  setNotes: React.Dispatch<React.SetStateAction<string>>
  onAttachmentsChange?: (attachments: UploadedAttachment[]) => void
}

const supportedImage = ['png', 'jpg', 'jpeg', 'gif']

type UploadStatus = 'uploading' | 'uploaded' | 'error'

type UploadedAttachment = {
  id: string
  name: string
  url?: string
  type: string
  size: number
  status: UploadStatus
  progress: number
  error?: string
}

const PdfIcon = () => (
  <svg width="24" height="28" viewBox="0 0 24 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="28" rx="2" fill="#DD2025" />
    <path d="M6.52426 10.0234H4.5V17.4576H6.09835V14.9517L6.45147 14.9718C6.7932 14.9671 7.1318 14.9059 7.45354 14.7906C7.73638 14.6945 7.99633 14.5411 8.21709 14.3399C8.44177 14.1495 8.61801 13.9085 8.73128 13.6367C8.88809 13.1856 8.94361 12.7055 8.89391 12.2304C8.88508 11.891 8.82557 11.5548 8.71735 11.233C8.61982 11.0004 8.47481 10.7907 8.29159 10.6174C8.10837 10.444 7.89098 10.3108 7.65333 10.2263C7.44751 10.1497 7.23413 10.0952 7.01678 10.0637C6.85343 10.0371 6.68821 10.0236 6.52272 10.0234M6.22999 13.5763H6.09215V11.2841H6.39262C6.52454 11.2746 6.65692 11.2949 6.77997 11.3434C6.90301 11.3919 7.01359 11.4675 7.10351 11.5645C7.28986 11.8138 7.38941 12.1174 7.38694 12.4287C7.38694 12.8097 7.38694 13.1551 7.04311 13.3982C6.79547 13.5346 6.51347 13.596 6.23154 13.5748M11.9156 10.0033C11.7437 10.0033 11.5764 10.0157 11.4587 10.0203L11.0947 10.0296H9.88668V17.4638H11.3085C11.8518 17.4778 12.3926 17.3857 12.9006 17.1928C13.3097 17.0312 13.6718 16.7698 13.9538 16.4323C14.2302 16.0934 14.4275 15.6971 14.5315 15.2723C14.6536 14.792 14.713 14.298 14.7081 13.8025C14.7384 13.2173 14.6931 12.6306 14.5733 12.057C14.4586 11.6352 14.2464 11.2463 13.9538 10.9217C13.7243 10.6592 13.4419 10.4481 13.1252 10.3022C12.8539 10.1764 12.5684 10.0839 12.2749 10.0265C12.1582 10.0074 12.04 9.99858 11.9218 10.0002M11.6399 16.0978H11.485V11.3523H11.5052C11.8245 11.3154 12.1476 11.373 12.4344 11.518C12.6445 11.6858 12.8158 11.8971 12.9362 12.1375C13.0663 12.3905 13.1412 12.6681 13.1562 12.9522C13.1701 13.2929 13.1562 13.5717 13.1562 13.8025C13.1619 14.0683 13.1448 14.3341 13.1051 14.597C13.0563 14.8666 12.9681 15.1275 12.8433 15.3714C12.7023 15.5988 12.5097 15.7898 12.2811 15.9289C12.0902 16.0529 11.8638 16.1105 11.6368 16.0931M19.5 10.0296H15.7364V17.4638H17.3286V14.5149H19.342V13.1334H17.3286V11.4111H19.4969V10.0296" fill="white" />
  </svg>
)

const PngIcon = () => (
  <svg width="24" height="28" viewBox="0 0 24 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#clip0_133_37426)">
      <path d="M16.5 0L23.5 7V22.6C23.5 24.85 23.5 25.975 22.927 26.764C22.7421 27.0184 22.5184 27.2421 22.264 27.427C21.475 28 20.349 28 18.1 28H5.9C3.65 28 2.525 28 1.736 27.427C1.48162 27.2421 1.25788 27.0184 1.073 26.764C0.5 25.975 0.5 24.849 0.5 22.6V5.4C0.5 3.15 0.5 2.025 1.073 1.236C1.25788 0.981617 1.48162 0.757885 1.736 0.573C2.525 0 3.651 0 5.9 0H16.5Z" fill="url(#paint0_linear_133_37426)" />
      <path d="M16.5 0L23.5 7H19.7C18.58 7 18.02 7 17.592 6.782C17.2157 6.59026 16.9097 6.28431 16.718 5.908C16.5 5.48 16.5 4.92 16.5 3.8V0Z" fill="white" fillOpacity="0.55" />
      <path d="M8.65463 16.5938C8.68979 16.5332 8.74026 16.4829 8.80098 16.4479C8.86171 16.4129 8.93055 16.3945 9.00063 16.3945C9.0707 16.3945 9.13955 16.4129 9.20027 16.4479C9.261 16.4829 9.31147 16.5332 9.34663 16.5938L12.1496 21.3998C12.1852 21.4606 12.2041 21.5296 12.2044 21.6C12.2047 21.6704 12.1864 21.7396 12.1514 21.8007C12.1164 21.8618 12.0659 21.9125 12.005 21.9479C11.9441 21.9832 11.875 22.0018 11.8046 22.0018H6.19663C6.12624 22.0018 6.05711 21.9832 5.99621 21.9479C5.93532 21.9125 5.88483 21.8618 5.84983 21.8007C5.81483 21.7396 5.79656 21.6704 5.79688 21.6C5.7972 21.5296 5.81608 21.4606 5.85163 21.3998L8.65463 16.5938Z" fill="white" />
      <path d="M14.1514 13.6282C14.186 13.5657 14.2367 13.5136 14.2983 13.4773C14.3598 13.441 14.43 13.4219 14.5014 13.4219C14.5729 13.4219 14.643 13.441 14.7046 13.4773C14.7661 13.5136 14.8169 13.5657 14.8514 13.6282L19.1714 21.4042C19.2052 21.4651 19.2225 21.5338 19.2216 21.6034C19.2207 21.6731 19.2016 21.7413 19.1663 21.8013C19.1309 21.8613 19.0805 21.911 19.02 21.9456C18.9595 21.9801 18.8911 21.9983 18.8214 21.9982H10.1814C10.1118 21.9983 10.0433 21.9801 9.98287 21.9456C9.92239 21.911 9.87198 21.8613 9.83663 21.8013C9.80127 21.7413 9.78219 21.6731 9.78128 21.6034C9.78038 21.5338 9.79767 21.4651 9.83144 21.4042L14.1514 13.6272V13.6282Z" fill="white" />
      <path d="M7.3 13.6C8.29411 13.6 9.1 12.7941 9.1 11.8C9.1 10.8059 8.29411 10 7.3 10C6.30589 10 5.5 10.8059 5.5 11.8C5.5 12.7941 6.30589 13.6 7.3 13.6Z" fill="white" />
    </g>
    <defs>
      <linearGradient id="paint0_linear_133_37426" x1="1.5" y1="-1" x2="23.5" y2="28" gradientUnits="userSpaceOnUse">
        <stop stopColor="#84C4FF" />
        <stop offset="1" stopColor="#2DA5DC" />
      </linearGradient>
      <clipPath id="clip0_133_37426">
        <rect width="24" height="28" fill="white" />
      </clipPath>
    </defs>
  </svg>
)

const getExtension = (fileName: string) => fileName.split('.').pop()?.toLowerCase() || ''

const ConsultationDiscussion: React.FC<Props> = ({ notes, setNotes, onAttachmentsChange }) => {
  const [attachments, setAttachments] = useState<UploadedAttachment[]>([])
  const [uploadingCount, setUploadingCount] = useState(0)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    onAttachmentsChange?.(attachments.filter((attachment) => attachment.status === 'uploaded' && attachment.url))
  }, [attachments, onAttachmentsChange])

  const handleFilesSelected = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    const nextFiles = Array.from(files)
    event.target.value = ''

    const fileQueue = nextFiles.map((file) => {
      const id = `${file.name}-${file.size}-${file.lastModified}-${crypto.randomUUID()}`
      return {
        id,
        file,
      }
    })

    const validEntries = fileQueue.filter(({ file }) => {
      const validation = validateFile(file, 20, [
        ...ALLOWED_FILE_TYPES.IMAGES,
        ...ALLOWED_FILE_TYPES.DOCUMENTS,
      ])
      return validation.isValid
    })

    const invalidEntries = fileQueue.filter(({ file }) => {
      const validation = validateFile(file, 20, [
        ...ALLOWED_FILE_TYPES.IMAGES,
        ...ALLOWED_FILE_TYPES.DOCUMENTS,
      ])
      return !validation.isValid
    })

    if (invalidEntries.length > 0) {
      setAttachments((prev) => [
        ...prev,
        ...invalidEntries.map(({ id, file }) => ({
          id,
          name: file.name,
          type: file.type || 'application/octet-stream',
          size: file.size,
          status: 'error' as const,
          progress: 0,
          error: 'Only image and document files up to 20MB are allowed.',
        })),
      ])
    }

    if (!validEntries.length) return

    setUploadingCount((count) => count + validEntries.length)
    setAttachments((prev) => [
      ...prev,
      ...validEntries.map(({ id, file }) => ({
        id,
        name: file.name,
        type: file.type || 'application/octet-stream',
        size: file.size,
        status: 'uploading' as const,
        progress: 0,
      })),
    ])

    await Promise.all(validEntries.map(async ({ id, file }) => {
      const uploadResult = await uploadFileToAzure(file, 'chat-documents', (progress) => {
        setAttachments((prev) => prev.map((attachment) => (
          attachment.id === id ? { ...attachment, progress } : attachment
        )))
      })

      setAttachments((prev) => prev.map((attachment) => {
        if (attachment.id !== id) return attachment
        if (!uploadResult.success || !uploadResult.url) {
          return {
            ...attachment,
            status: 'error',
            error: uploadResult.error || 'Failed to upload file.',
          }
        }

        return {
          ...attachment,
          status: 'uploaded',
          progress: 100,
          url: uploadResult.url,
        }
      }))
    }))

    setUploadingCount((count) => Math.max(0, count - validEntries.length))
  }

  const removeAttachment = (id: string) => {
    setAttachments(prev => prev.filter((attachment) => attachment.id !== id))
  }

  return (
    <div className="mt-6 p-6 border border-gray-200 rounded-[18px] bg-white">
      <div className="mb-4 font-semibold text-base">What you want to discuss</div>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Describe what kind of guidance you want and attach if you have any documents related to this meeting..."
        className="w-full min-h-[180px] rounded-[18px] border border-gray-200 bg-[#FBFCFE] px-5 py-4 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#93C5FD] focus:ring-1 focus:ring-[#DBEAFE] resize-none"
      />
      <div className="mt-3 flex items-center justify-end text-sm text-slate-500">
        <span>{notes.length} characters (min. 90)</span>
      </div>
      <div className="mt-5 flex n gap-4">
        <div className="flex flex-wrap gap-4">
          {attachments.map((file) => {
            const ext = getExtension(file.name)
            const isPdf = ext === 'pdf'
            const isImage = supportedImage.includes(ext)
            const badgeLabel = file.status === 'uploading'
              ? `Uploading ${file.progress}%`
              : file.status === 'uploaded'
                ? 'Uploaded'
                : 'Upload failed'

            return (
              <div key={file.id} className="flex min-w-[260px] items-center justify-between gap-4 rounded-2xl border border-[#E6EDF5] bg-[#F3F6FA] px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="h-7 w-6">
                    {isPdf ? <PdfIcon /> : isImage ? <PngIcon /> : <PngIcon />}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-900 truncate max-w-[180px]">{file.name}</div>
                    <div className="text-xs text-slate-500">{ext.toUpperCase() || 'FILE'}</div>
                    <div className={`mt-1 text-[11px] ${file.status === 'error' ? 'text-red-500' : 'text-slate-500'}`}>
                      {file.status === 'error' ? file.error : badgeLabel}
                    </div>
                  </div>
                </div>
                <button onClick={() => removeAttachment(file.id)} className="text-slate-500 hover:text-slate-800">×</button>
              </div>
            )
          })}
        </div>
        <label className="flex items-center cursor-pointer  rounded-full  bg-white p-3 text-[#101828] transition hover:border-[#2563EB] hover:text-[#1D4ED8]">
          <AttachFileIcon className="text-current" />
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={[...ALLOWED_FILE_TYPES.IMAGES, ...ALLOWED_FILE_TYPES.DOCUMENTS].join(',')}
            className="hidden"
            onChange={handleFilesSelected}
          />
        </label>
        {uploadingCount > 0 && (
          <div className="ml-auto text-xs text-slate-500 self-center">
            Uploading {uploadingCount} file{uploadingCount > 1 ? 's' : ''}...
          </div>
        )}
      </div>
    </div>
  )
}

export default ConsultationDiscussion
