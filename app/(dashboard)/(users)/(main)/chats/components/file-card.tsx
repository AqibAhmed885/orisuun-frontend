import Image from "next/image"
import DownloadIcon from "@/public/chat/download-icon"
import { AudioPlayer } from "../../../../../../components/ui/audio-player"
import MiscellaneousIcon from "@/public/chat/files-icon"
import DocIcon from "@/icons/chats/doc"
import { formatFileSize } from "@/utils/utils"
import PdfIcon from "@/icons/chats/pdf-icon"
import VideoIcon from "@/icons/chats/video-icon"
import AdobeIcon from "@/icons/chats/adobe-icon"
import CsvIcon from "@/icons/chats/csv-icon"
import EmailIcon from "@/icons/chats/email-icon"
import ExcelIcon from "@/icons/chats/excel-icon"
import FigmaIcon from "@/icons/chats/figma"
import GifIcon from "@/icons/chats/gif-icon"
import HeicIcon from "@/icons/chats/heic-icon"
import HtmlIcon from "@/icons/chats/html-icon"
import IcsIcon from "@/icons/chats/ics-icon"
import PowerPointIcon from "@/icons/chats/powerpoint"
import { DeleteIcon } from "@/icons/chats/textarea-icons"
import WebmIcon from "@/icons/chats/webm"
import WebpIcon from "@/icons/chats/webp"
import ZipIcon from "@/icons/chats/zip-icon"

type FileCardProps = {
  fileName: string
  fileSize: string
  fileType:
  | "pdf"
  | "video"
  | "image"
  | "audio"
  | "document"
  | "zip"
  | "adobe"
  | "csv"
  | "email"
  | "gif"
  | "heic"
  | "excel"
  | "ics"
  | "webp"
  | "powerpoint"
  | "figma"
  | "webm"
  | "html"
  | "other"
  fileUrl: string | string[]
  isUploading?: boolean
  fileUploadingProgress?: number
  isSent?: boolean
  handleRemoveAttachment?: () => void
}

const FileCard: React.FC<FileCardProps> = ({
  fileName,
  fileSize,
  fileType,
  fileUrl,
  isSent,
  isUploading = false,
  fileUploadingProgress = 0,
  handleRemoveAttachment,
}) => {
  const supportedImageFormats = ["jpg", "jpeg", "png", "gif", "svg"]
  const supportedAudioFormats = ["mp3"]

  const isAudio = (fileUrl: string): boolean => {
    const extension = fileUrl.split(".").pop()?.toLowerCase()
    return supportedAudioFormats.includes(extension || "")
  }

  const isImage = (fileUrl: string): boolean => {
    const extension = fileUrl.split(".").pop()?.toLowerCase()
    return supportedImageFormats.includes(extension || "")
  }

  const fileIcons: Record<string, JSX.Element> = {
    pdf: <PdfIcon />,
    video: <VideoIcon />,
    document: <DocIcon />,
    zip: <ZipIcon />,
    adobe: <AdobeIcon />,
    csv: <CsvIcon />,
    email: <EmailIcon />,
    gif: <GifIcon />,
    heic: <HeicIcon />,
    excel: <ExcelIcon />,
    ics: <IcsIcon />,
    webp: <WebpIcon />,
    powerpoint: <PowerPointIcon />,
    figma: <FigmaIcon />,
    webm: <WebmIcon />,
    html: <HtmlIcon />,
    other: <MiscellaneousIcon />,
  }

  const calculateUploadedSize = () => {
    const totalSizeInString = fileSize.replace(/[^\d.-]/g, "")
    const totalSize = Number.parseFloat(totalSizeInString)

    const isKB = fileSize.toLowerCase().includes("kb")
    let totalSizeInMB = totalSize
    if (isKB) {
      totalSizeInMB = totalSize / 1024
    }
    const uploadedSizeInMB = (totalSizeInMB * fileUploadingProgress) / 100
    return `${uploadedSizeInMB.toFixed(2)} MB of ${totalSizeInMB.toFixed(2)} MB`
  }

  if (fileType === "image" || (typeof fileUrl === "string" && isImage(fileUrl))) {
    const imageUrls = Array.isArray(fileUrl) ? fileUrl : [fileUrl]

    return (
      <div className="relative flex gap-2 flex-wrap items-center">
        {imageUrls.map((url, index) => (
          <div key={index} className="relative">
            {isUploading && (
              <div className="absolute inset-0 rotate-90 flex items-center justify-center bg-gray-100 bg-opacity-45 rounded">
                <div
                  className="relative w-[42px] h-[42px] rounded-full"
                  style={{
                    background: `conic-gradient(transparent ${fileUploadingProgress}%, rgba(178, 178, 178, 0.7) ${fileUploadingProgress}% 100%)`,
                    transition: 'background 0.3s linear',
                  }}
                ></div>
              </div>
            )}

            {!isUploading && fileUploadingProgress === 100 && (
              <div onClick={() => handleRemoveAttachment()}>
                <DeleteIcon className="absolute shadow-md top-1 right-1 cursor-pointer" />
              </div>
            )}

            <Image
              src={url || "/placeholder.svg"}
              alt={`${fileName} ${index + 1}`}
              width={360}
              height={360}
              className="rounded object-cover max-h-36 aspect-square w-24 sm:w-28 md:w-36" // Add responsive width classes
            />
          </div>
        ))}
      </div>
    );
  }

  if (fileType === "audio" || (typeof fileUrl === "string" && isAudio(fileUrl))) {
    return (
      <div className="w-full">
        <AudioPlayer src={fileUrl as string} fileName={fileName} />
      </div>
    )
  }

  return (
    <div className="relative flex items-center justify-between border border-gray-200 rounded-lg px-3 py-2.5 md:w-64 xs:w-full xs:max-w-full md:!max-w-[269px] 3xl:!min-w-[269px] 3xl:!max-w-80 gap-3">
      <div className="flex items-center gap-2.5 w-full">
        <div className="h-8 w-8 flex items-center justify-center text-white font-semibold text-xs rounded">
          {fileIcons[fileType]}
        </div>
        <div className={`${fileUploadingProgress === 100 && !isUploading ? "" : "max-w-48"} w-full`}>
          <div className="flex justify-between gap-1">
            <p className="text-sm leading-4 max-w-[150px] font-medium text-gray-800 truncate">{fileName}</p>
            {isUploading && fileUploadingProgress < 100 ? (
              <p className="text-xs leading-4 text-gray-500">{fileUploadingProgress}%</p>
            ) : !isUploading && fileUploadingProgress === 100 ? (
              <div className="cursor-pointer" onClick={() => handleRemoveAttachment()}>
                <DeleteIcon className="3xl:w-[16px] 3xl:h-[16px] 2k:w-[20px] 2k:h-[20px]" />
              </div>
            ) : (
              ""
            )}
          </div>
          {(isUploading || !isSent) && (
            <div className="w-full">
              <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden my-[2px]">
                <div
                  className={`h-1 ${fileUploadingProgress === 100 ? "bg-green-500" : "bg-red-500"
                    } rounded-full transition-all`}
                  style={{ width: `${fileUploadingProgress}%` }}
                />
              </div>
              <p className="text-xs leading-4 text-gray-500">
                {fileUploadingProgress === 100 ? `${calculateUploadedSize()}` : `${calculateUploadedSize()}`}
              </p>
            </div>
          )}{" "}
          {isSent && (
            <div className="w-full">
              <p className="text-xs leading-4 text-gray-500">{formatFileSize(fileSize)}</p>
            </div>
          )}
        </div>
      </div>

      {!isUploading && isSent && (
        <a
          href={fileUrl as string} // Assuming fileUrl is a string when the file is
          download
          className="text-gray-500 hover:text-gray-700"
          target="_blank"
          rel="noopener noreferrer"
        >
          <DownloadIcon />
        </a>
      )}
    </div>
  )
}

export default FileCard

