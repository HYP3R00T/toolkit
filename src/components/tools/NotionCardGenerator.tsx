import { toPng } from 'html-to-image'
import { useEffect, useRef, useState } from 'react'

import arrowUpIconRaw from '@/assets/icons/arrow-up.svg?raw'
import checkIconUrl from '@/assets/icons/check.svg?url'
import closeIconRaw from '@/assets/icons/close.svg?raw'
import lightningIconUrl from '@/assets/icons/lightning.svg?url'
import userIconUrl from '@/assets/icons/user.svg?url'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { convertSvgToCurrentColor } from '@/lib/assets'
import { cn } from '@/lib/cn'

type BackgroundId = 'sunset' | 'blue' | 'dream' | 'cyberpunk'

type BackgroundOption = {
  id: BackgroundId
  label: string
  gradient: string
}

type CenterAsset = {
  id: string
  label: string
  src: string
}

const BACKGROUND_OPTIONS: BackgroundOption[] = [
  {
    id: 'sunset',
    label: 'Sunset flare',
    gradient: 'linear-gradient(-45deg, rgb(247, 112, 98), rgb(254, 81, 150))',
  },
  {
    id: 'blue',
    label: 'Deep Blue',
    gradient: 'linear-gradient(-45deg, rgb(224, 195, 252), rgb(142, 197, 252))',
  },
  {
    id: 'dream',
    label: 'Frozen Dreams',
    gradient: 'linear-gradient(-45deg, rgb(253, 203, 241), rgb(230, 222, 233))',
  },
  {
    id: 'cyberpunk',
    label: 'Cyberpunk',
    gradient: 'linear-gradient(-45deg, rgb(143, 102, 255), rgb(102, 227, 255))',
  },
]

const DEFAULT_CENTER_ASSETS: CenterAsset[] = [
  {
    id: 'default-lightning',
    label: 'Lightning',
    src: lightningIconUrl,
  },
  {
    id: 'default-check',
    label: 'Check',
    src: checkIconUrl,
  },
  {
    id: 'default-user',
    label: 'User',
    src: userIconUrl,
  },
]

function InlineSvgIcon({
  svg,
  className,
}: {
  svg: string
  className?: string
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'inline-flex items-center justify-center [&>svg]:block [&>svg]:size-full',
        className,
      )}
      dangerouslySetInnerHTML={{ __html: convertSvgToCurrentColor(svg) }}
    />
  )
}

function CardPreview({
  background,
  centerImageSrc,
  centerImageAlt,
  className,
}: {
  background: BackgroundOption
  centerImageSrc: string
  centerImageAlt: string
  className?: string
}) {
  return (
    <div
      className={cn('relative overflow-hidden border border-border', className)}
      style={{ backgroundImage: background.gradient }}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <img
          src={centerImageSrc}
          alt={centerImageAlt}
          className="h-[14%] w-[14%] min-h-8 min-w-8 object-contain"
          draggable={false}
        />
      </div>
    </div>
  )
}

export default function NotionCardGenerator() {
  const [backgroundId, setBackgroundId] = useState<BackgroundId>('cyberpunk')
  const [selectedAssetId, setSelectedAssetId] = useState('default-lightning')
  const [uploadedAssetSrc, setUploadedAssetSrc] = useState<string | null>(null)
  const [uploadedObjectUrl, setUploadedObjectUrl] = useState<string | null>(
    null,
  )
  const [isExporting, setIsExporting] = useState(false)

  const exportRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const selectedBackground =
    BACKGROUND_OPTIONS.find((option) => option.id === backgroundId) ??
    BACKGROUND_OPTIONS[0]

  const centerAssets = uploadedAssetSrc
    ? [
        ...DEFAULT_CENTER_ASSETS,
        {
          id: 'uploaded-image',
          label: 'Uploaded',
          src: uploadedAssetSrc,
        },
      ]
    : DEFAULT_CENTER_ASSETS

  const selectedCenterAsset =
    centerAssets.find((asset) => asset.id === selectedAssetId) ??
    centerAssets[0]

  const centerControlsGridClass = uploadedAssetSrc
    ? 'grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:items-center'
    : 'grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center'

  useEffect(() => {
    return () => {
      if (uploadedObjectUrl) URL.revokeObjectURL(uploadedObjectUrl)
    }
  }, [uploadedObjectUrl])

  const applyUploadedFile = async (file: File) => {
    if (!file.type.startsWith('image/')) return

    if (uploadedObjectUrl) {
      URL.revokeObjectURL(uploadedObjectUrl)
    }

    if (file.type === 'image/svg+xml') {
      const svgSource = await file.text()
      setUploadedObjectUrl(null)
      setUploadedAssetSrc(
        `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgSource)}`,
      )
    } else {
      const nextObjectUrl = URL.createObjectURL(file)
      setUploadedObjectUrl(nextObjectUrl)
      setUploadedAssetSrc(nextObjectUrl)
    }

    setSelectedAssetId('uploaded-image')
  }

  const clearUploadedFile = () => {
    if (uploadedObjectUrl) URL.revokeObjectURL(uploadedObjectUrl)

    setUploadedObjectUrl(null)
    setUploadedAssetSrc(null)
    setSelectedAssetId(DEFAULT_CENTER_ASSETS[0].id)

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleFileInputChange: React.ChangeEventHandler<HTMLInputElement> = (
    event,
  ) => {
    const file = event.target.files?.[0]
    if (!file) return

    void applyUploadedFile(file)
  }

  const handleDownload = async () => {
    if (!exportRef.current || isExporting) return

    setIsExporting(true)

    try {
      const pngDataUrl = await toPng(exportRef.current, {
        cacheBust: true,
        pixelRatio: 1,
      })

      const link = document.createElement('a')
      link.download = `notion-card-${selectedBackground.id}-${selectedAssetId}.png`
      link.href = pngDataUrl
      link.click()
      link.remove()
    } catch (error) {
      console.error('Failed to export Notion card preview', error)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <section className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
      <div className="space-y-6">
        <CardPreview
          background={selectedBackground}
          centerImageSrc={selectedCenterAsset.src}
          centerImageAlt={selectedCenterAsset.label}
          className="aspect-video w-full"
        />

        <p className="text-foreground-1 text-sm leading-relaxed">
          Live preview. The export uses the same state and downloads a fixed
          16:9 image.
        </p>
      </div>

      <aside className="border-border bg-background-1 space-y-6 border p-6 md:p-8">
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-foreground-0 text-xl font-semibold">Editor</h2>

            <Button onClick={handleDownload} disabled={isExporting}>
              {isExporting ? 'Exporting...' : 'Download PNG'}
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-medium">Background</p>
          <div className="flex items-center gap-2">
            <Select
              value={backgroundId}
              onChange={(event) =>
                setBackgroundId(event.target.value as BackgroundId)
              }
              className="bg-background-0"
            >
              {BACKGROUND_OPTIONS.map((background) => (
                <option key={background.id} value={background.id}>
                  {background.label}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-medium">Center image</p>
          <div className={centerControlsGridClass}>
            <Select
              value={selectedAssetId}
              onChange={(event) => setSelectedAssetId(event.target.value)}
              className="bg-background-0 min-w-0"
            >
              {centerAssets.map((asset) => (
                <option key={asset.id} value={asset.id}>
                  {asset.label}
                </option>
              ))}
            </Select>

            <Button
              size="sm"
              variant="default"
              onClick={() => fileInputRef.current?.click()}
              className="h-9 gap-1.5 px-3"
              title="Upload image"
              aria-label="Upload your own image"
            >
              <InlineSvgIcon svg={arrowUpIconRaw} className="size-4" />
              <span>Upload</span>
            </Button>

            {uploadedAssetSrc && (
              <Button
                size="sm"
                onClick={clearUploadedFile}
                variant="default"
                className="h-9 gap-1.5 px-3"
                title="Remove uploaded image"
                aria-label="Remove uploaded image"
              >
                <InlineSvgIcon svg={closeIconRaw} className="size-4" />
                <span>Remove</span>
              </Button>
            )}
          </div>

          <p className="text-foreground-2 text-xs">
            Choose a default or upload your own PNG, JPG, or SVG.
          </p>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileInputChange}
          />
        </div>
      </aside>

      <div
        className="pointer-events-none absolute top-0"
        style={{ left: '-5000px' }}
      >
        <div ref={exportRef}>
          <CardPreview
            background={selectedBackground}
            centerImageSrc={selectedCenterAsset.src}
            centerImageAlt={selectedCenterAsset.label}
            className="h-135 w-240"
          />
        </div>
      </div>
    </section>
  )
}
