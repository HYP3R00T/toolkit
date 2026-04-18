import { useState } from 'react'
import arrowLeftSvg from '@/assets/icons/arrow-left.svg?raw'
import arrowRightSvg from '@/assets/icons/arrow-right.svg?raw'
import { Button } from '@/components/ui/Button'
import {
  type CarouselImage,
  convertSvgToCurrentColor,
  resolveImageAlt,
  resolveImageSource,
} from '@/lib/assets'
import { cn } from '@/lib/cn'

export interface ImageCarouselProps {
  images: CarouselImage[]
  projectTitle?: string
  imageAlt?: string
  className?: string
}

function IconSvg({ svg }: { svg: string }) {
  return (
    <span
      aria-hidden="true"
      className="text-foreground-0 block [&>svg]:block [&>svg]:size-6 [&>svg]:shrink-0"
      dangerouslySetInnerHTML={{ __html: convertSvgToCurrentColor(svg) }}
    />
  )
}

function ImageCarouselComponent({
  images,
  projectTitle = '',
  imageAlt,
  className,
}: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const totalImages = images.length

  const goToPrev = () => {
    setCurrentIndex(
      (currentValue) => (currentValue - 1 + totalImages) % totalImages,
    )
  }

  const goToNext = () => {
    setCurrentIndex((currentValue) => (currentValue + 1) % totalImages)
  }

  const showControls = totalImages > 1

  return (
    <div
      className={cn(
        'relative min-h-60 aspect-video overflow-hidden object-cover group',
        className,
      )}
    >
      <div className="h-full w-full">
        {images.map((image, index) => {
          const isActive = index === currentIndex

          return (
            <div
              key={`${resolveImageSource(image)}-${index}`}
              className={cn(
                'carousel-slide absolute inset-0',
                isActive && 'is-active',
              )}
              data-index={index}
            >
              <img
                src={resolveImageSource(image)}
                alt={resolveImageAlt(image, projectTitle, imageAlt, index + 1)}
                className="my-0 h-full w-full object-cover"
              />
            </div>
          )
        })}
      </div>

      {showControls && (
        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
          {images.map((_, index) => (
            <span
              key={index}
              className={cn(
                'h-0.5 w-6',
                index === currentIndex
                  ? 'bg-foreground-0'
                  : 'bg-foreground-0/30',
              )}
              data-index={index}
            />
          ))}
        </div>
      )}

      {showControls && (
        <div className="bg-background-0/0 pointer-events-auto absolute inset-0 flex items-center justify-between p-4 opacity-100 transition-opacity duration-300 md:pointer-events-none md:opacity-0 md:group-hover:opacity-100">
          <Button
            aria-label="Previous image"
            onClick={goToPrev}
            size="icon"
            variant="default"
            className="carousel-prev bg-background-0/10! backdrop-blur-2xl pointer-events-auto self-center"
          >
            <IconSvg svg={arrowLeftSvg} />
          </Button>

          <Button
            aria-label="Next image"
            onClick={goToNext}
            size="icon"
            variant="default"
            className="carousel-next bg-background-0/10! backdrop-blur-2xl pointer-events-auto self-center"
          >
            <IconSvg svg={arrowRightSvg} />
          </Button>
        </div>
      )}

      <style>{`
        .carousel-slide {
          opacity: 0;
          transition: opacity 500ms ease-in-out;
          pointer-events: none;
        }

        .carousel-slide.is-active {
          opacity: 1;
          pointer-events: auto;
        }
      `}</style>
    </div>
  )
}

export { ImageCarouselComponent as ImageCarousel }
export default ImageCarouselComponent
