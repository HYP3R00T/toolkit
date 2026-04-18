import { toPng } from 'html-to-image'
import { useRef, useState } from 'react'
import arrowLeftSvg from '@/assets/icons/arrow-left.svg?raw'
import arrowRightSvg from '@/assets/icons/arrow-right.svg?raw'
import arrowUpSvg from '@/assets/icons/arrow-up.svg?raw'
import checkSvg from '@/assets/icons/check.svg?raw'
import closeSvg from '@/assets/icons/close.svg?raw'
import copySvg from '@/assets/icons/copy.svg?raw'
import githubSvg from '@/assets/icons/github.svg?raw'
import lightningSvg from '@/assets/icons/lightning.svg?raw'
import mailSvg from '@/assets/icons/mail.svg?raw'
import menuSvg from '@/assets/icons/menu.svg?raw'
import toggleSvg from '@/assets/icons/toggle.svg?raw'
import userSvg from '@/assets/icons/user.svg?raw'
import { Button } from '@/components/ui/Button'
import { convertSvgToCurrentColor } from '@/lib/assets'
import { cn } from '@/lib/cn'

type BackgroundId = 'sunset' | 'blue' | 'dream'
type ToneId = 'foreground' | 'background'

type BackgroundOption = {
  id: BackgroundId
  label: string
  gradient: string
}

type IconOption = {
  id: string
  label: string
  svg: string
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
]

const ICON_OPTIONS: IconOption[] = [
  { id: 'lightning', label: 'Lightning', svg: lightningSvg },
  { id: 'check', label: 'Check', svg: checkSvg },
  { id: 'arrow-up', label: 'Arrow up', svg: arrowUpSvg },
  { id: 'user', label: 'User', svg: userSvg },
  { id: 'mail', label: 'Mail', svg: mailSvg },
  { id: 'github', label: 'GitHub', svg: githubSvg },
  { id: 'toggle', label: 'Toggle', svg: toggleSvg },
  { id: 'close', label: 'Close', svg: closeSvg },
  { id: 'menu', label: 'Menu', svg: menuSvg },
  { id: 'copy', label: 'Copy', svg: copySvg },
  { id: 'arrow-left', label: 'Arrow left', svg: arrowLeftSvg },
  { id: 'arrow-right', label: 'Arrow right', svg: arrowRightSvg },
]

function Glyph({
  svg,
  className,
  style,
}: {
  svg: string
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'inline-flex shrink-0 items-center justify-center [&>svg]:block [&>svg]:size-full',
        className,
      )}
      style={style}
      dangerouslySetInnerHTML={{ __html: convertSvgToCurrentColor(svg) }}
    />
  )
}

function CardPreview({
  background,
  icon,
  tone,
  className,
}: {
  background: BackgroundOption
  icon: IconOption
  tone: ToneId
  className?: string
}) {
  return (
    <div
      className={cn('relative overflow-hidden border border-border', className)}
      style={{ backgroundImage: background.gradient }}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <Glyph
          svg={icon.svg}
          className={cn(
            tone === 'foreground' ? 'text-foreground-0' : 'text-background-0',
          )}
          style={{ width: '64px', height: '64px' }}
        />
      </div>
    </div>
  )
}

export default function NotionCardGenerator() {
  const [backgroundId, setBackgroundId] = useState<BackgroundId>('sunset')
  const [iconId, setIconId] = useState('lightning')
  const [tone, setTone] = useState<ToneId>('foreground')
  const [isExporting, setIsExporting] = useState(false)
  const exportRef = useRef<HTMLDivElement>(null)

  const selectedBackground =
    BACKGROUND_OPTIONS.find((option) => option.id === backgroundId) ??
    BACKGROUND_OPTIONS[0]
  const selectedIcon =
    ICON_OPTIONS.find((option) => option.id === iconId) ?? ICON_OPTIONS[0]

  const handleDownload = async () => {
    if (!exportRef.current || isExporting) return

    setIsExporting(true)

    try {
      const pngDataUrl = await toPng(exportRef.current, {
        cacheBust: true,
        pixelRatio: 1,
      })

      const link = document.createElement('a')
      link.download = `notion-card-${selectedBackground.id}-${selectedIcon.id}.png`
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
          icon={selectedIcon}
          tone={tone}
          className="aspect-video w-full"
        />

        <p className="text-foreground-1 text-sm leading-relaxed">
          Live preview. The export uses the same state and downloads a fixed
          16:9 image.
        </p>
      </div>

      <aside className="border-border bg-background-1 space-y-6 border p-6 md:p-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-foreground-0 text-xl font-semibold">Editor</h2>
            <p className="text-foreground-2 mt-1 text-sm">
              Fixed export size: 1600 × 900.
            </p>
          </div>

          <Button onClick={handleDownload} disabled={isExporting}>
            {isExporting ? 'Exporting…' : 'Download PNG'}
          </Button>
        </div>

        <div className="space-y-3">
          <p className="mb-2 text-sm font-medium">Background</p>
          <div className="grid gap-2">
            {BACKGROUND_OPTIONS.map((background) => {
              const isActive = background.id === backgroundId

              return (
                <Button
                  key={background.id}
                  variant={isActive ? 'default' : 'outline'}
                  onClick={() => setBackgroundId(background.id)}
                  className="justify-start gap-3 text-left"
                  aria-pressed={isActive}
                >
                  <span
                    aria-hidden="true"
                    className="border-border h-8 w-8 shrink-0 border"
                    style={{ backgroundImage: background.gradient }}
                  />
                  <span>{background.label}</span>
                </Button>
              )
            })}
          </div>
        </div>

        <div className="space-y-3">
          <p className="mb-2 text-sm font-medium">Icon</p>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
            {ICON_OPTIONS.map((icon) => {
              const isActive = icon.id === iconId

              return (
                <div key={icon.id} className="space-y-2 text-center">
                  <Button
                    variant={isActive ? 'default' : 'outline'}
                    onClick={() => setIconId(icon.id)}
                    size="icon-sm"
                    className="mx-auto"
                    aria-pressed={isActive}
                    title={icon.label}
                  >
                    <Glyph
                      svg={icon.svg}
                      style={{ width: '14px', height: '14px' }}
                    />
                  </Button>
                  <span className="text-foreground-2 block text-xs uppercase tracking-[0.18em]">
                    {icon.label}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        <div className="space-y-3">
          <p className="mb-2 text-sm font-medium">Icon tone</p>
          <div className="grid grid-cols-2 gap-2">
            {(
              [
                { id: 'foreground' as const, label: 'Foreground' },
                { id: 'background' as const, label: 'Background' },
              ] as const
            ).map((option) => {
              const isActive = option.id === tone

              return (
                <Button
                  key={option.id}
                  variant={isActive ? 'default' : 'outline'}
                  onClick={() => setTone(option.id)}
                  className="justify-start gap-3 text-left"
                  aria-pressed={isActive}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      'border-border h-4 w-4 shrink-0 border',
                      option.id === 'foreground'
                        ? 'bg-foreground-0'
                        : 'bg-background-0',
                    )}
                  />
                  <span>{option.label}</span>
                </Button>
              )
            })}
          </div>
        </div>

        <div className="border-border border p-4 text-sm leading-relaxed">
          The preview stays flat: no overlay, no translucent shell, no rounded
          corners.
        </div>
      </aside>

      <div
        className="pointer-events-none absolute top-0"
        style={{ left: '-5000px' }}
      >
        <div ref={exportRef}>
          <CardPreview
            background={selectedBackground}
            icon={selectedIcon}
            tone={tone}
            className="h-225 w-400"
          />
        </div>
      </div>
    </section>
  )
}
