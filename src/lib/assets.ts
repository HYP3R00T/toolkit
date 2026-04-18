export type CarouselImage =
  | string
  | {
      src: string
      alt?: string
    }

export function resolveImageSource(image: CarouselImage): string {
  return typeof image === 'string' ? image : image.src
}

export function resolveImageAlt(
  image: CarouselImage,
  projectTitle: string,
  imageAlt?: string,
  index?: number,
): string {
  if (imageAlt) return imageAlt
  if (typeof image !== 'string' && image.alt) return image.alt
  if (projectTitle) return `${projectTitle} - Image ${index ?? 0 + 1}`
  return `Image ${index ?? 0 + 1}`
}

export function convertSvgToCurrentColor(svg: string): string {
  return svg
    .trim()
    .replace(/stroke="#[0-9a-fA-F]{3,8}"/g, 'stroke="currentColor"')
    .replace(/fill="#[0-9a-fA-F]{3,8}"/g, 'fill="currentColor"')
}
