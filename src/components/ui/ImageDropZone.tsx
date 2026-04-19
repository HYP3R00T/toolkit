import type {
  ClipboardEvent,
  DragEvent,
  HTMLAttributes,
  ReactNode,
} from 'react'
import { useId, useRef, useState } from 'react'

import { cn } from '@/lib/cn'

export interface ImageDropZoneProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  onFiles: (files: File[]) => void
  accept?: string
  multiple?: boolean
  title?: string
  class?: string
  className?: string
  children?: ReactNode
}

const baseClasses =
  'relative overflow-hidden border border-dashed border-border bg-background-0 px-5 py-6 text-center transition-all duration-200 focus:outline-none'

function ImageDropZoneComponent({
  onFiles,
  accept = 'image/*',
  multiple = false,
  title = 'Add image',
  class: classNameFromAstro,
  className,
  children,
  ...rest
}: ImageDropZoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const dragCounter = useRef(0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const helpId = useId()

  const extractImageFiles = (items?: DataTransferItemList | null) => {
    return Array.from(items ?? []).flatMap((item) => {
      if (item.kind !== 'file' || !item.type.startsWith('image/')) return []

      const file = item.getAsFile()
      return file ? [file] : []
    })
  }

  const handleDragEnter = (event: DragEvent<HTMLDivElement>) => {
    if (!Array.from(event.dataTransfer.types).includes('Files')) return

    event.preventDefault()
    dragCounter.current += 1
    setIsDragging(true)
  }

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    if (!Array.from(event.dataTransfer.types).includes('Files')) return

    event.preventDefault()
    event.dataTransfer.dropEffect = 'copy'
  }

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    if (!Array.from(event.dataTransfer.types).includes('Files')) return

    event.preventDefault()
    dragCounter.current = Math.max(0, dragCounter.current - 1)

    if (dragCounter.current === 0) {
      setIsDragging(false)
    }
  }

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    dragCounter.current = 0
    setIsDragging(false)

    const files = extractImageFiles(event.dataTransfer.items)
    if (files.length === 0) return

    onFiles(files)
  }

  const handlePaste = (event: ClipboardEvent<HTMLDivElement>) => {
    const files = extractImageFiles(event.clipboardData?.items)
    if (files.length === 0) return

    event.preventDefault()
    onFiles(files)
  }

  const handleFileInputChange: React.ChangeEventHandler<HTMLInputElement> = (
    event,
  ) => {
    const files = Array.from(event.target.files ?? [])
    if (files.length === 0) return

    onFiles(files)
    event.currentTarget.value = ''
  }

  const triggerFilePicker = () => {
    fileInputRef.current?.click()
  }

  const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return

    event.preventDefault()
    triggerFilePicker()
  }

  return (
    <div
      tabIndex={0}
      role="region"
      aria-label={title}
      aria-describedby={helpId}
      className={cn(
        baseClasses,
        'cursor-pointer hover:border-accent hover:bg-accent/5',
        isDragging
          ? 'border-accent bg-accent/15 text-foreground-0 ring-2 ring-accent ring-offset-2 ring-offset-background-0 shadow-[0_0_0_1px_var(--accent),0_0_0_9999px_rgba(0,0,0,0.18)]'
          : 'text-foreground-1',
        'focus-visible:border-accent focus-visible:bg-accent/10 focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background-0',
        className ?? classNameFromAstro,
      )}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onPaste={handlePaste}
      onClick={triggerFilePicker}
      onKeyDown={handleKeyDown}
      {...rest}
    >
      <div
        className={cn(
          'mx-auto flex max-w-sm flex-col items-center gap-3 transition-opacity duration-200',
          isDragging ? 'opacity-25' : 'opacity-100',
        )}
      >
        {children ?? (
          <>
            <div className="flex size-10 items-center justify-center border border-border bg-background-1 text-foreground-2">
              <span className="text-lg leading-none">+</span>
            </div>

            <p className="text-sm font-medium text-foreground-0">{title}</p>
          </>
        )}
      </div>

      <p id={helpId} className="sr-only">
        Click to browse for an image, or drag and drop and paste one here.
      </p>

      {isDragging && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-background-0/60 backdrop-blur-sm">
          <p className="text-sm font-medium text-foreground-0">
            Release to drop image
          </p>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={handleFileInputChange}
        tabIndex={-1}
        aria-hidden="true"
      />
    </div>
  )
}

export { ImageDropZoneComponent as ImageDropZone }
export default ImageDropZoneComponent
