// Prepara una foto de celular antes de subirla: la achica (las originales pesan 3-5 MB)
// y genera la miniatura de la card. Todo en el navegador, sin dependencias.

// Lado más largo de la original: alcanza para el detalle y baja el peso ~10x
const MAX_SIDE = 1600

// Miniatura en el 4:5 de la card, al doble de su ancho para pantallas retina
const THUMB_WIDTH = 400
const THUMB_HEIGHT = 500
const THUMB_RATIO = THUMB_WIDTH / THUMB_HEIGHT

const QUALITY = 0.85

export type PreparedImage = {
  original: Blob
  thumb: Blob
}

// El navegador no pudo leer el archivo. El caso típico: fotos HEIC de iPhone,
// que Chrome no sabe decodificar.
export class UnreadableImageError extends Error {}

const toBlob = (canvas: HTMLCanvasElement) =>
  new Promise<Blob>((resolve, reject) =>
    // Si el navegador no sabe codificar WebP devuelve PNG: el back acepta los dos
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new UnreadableImageError())),
      "image/webp",
      QUALITY
    )
  )

// Dibuja un recorte (sx, sy, sw, sh) de la imagen en un canvas de dw x dh
const draw = (
  bitmap: ImageBitmap,
  [sx, sy, sw, sh]: [number, number, number, number],
  [dw, dh]: [number, number]
) => {
  const canvas = document.createElement("canvas")
  canvas.width = Math.round(dw)
  canvas.height = Math.round(dh)
  canvas.getContext("2d")?.drawImage(bitmap, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height)
  return toBlob(canvas)
}

export const prepareImage = async (file: File): Promise<PreparedImage> => {
  let bitmap: ImageBitmap
  try {
    // Respeta la orientación EXIF: las fotos verticales del celular no salen acostadas
    bitmap = await createImageBitmap(file)
  } catch {
    throw new UnreadableImageError(file.name)
  }

  try {
    const { width, height } = bitmap

    // Original: entera, achicada solo si se pasa del máximo (nunca se agranda)
    const scale = Math.min(1, MAX_SIDE / Math.max(width, height))
    const original = await draw(bitmap, [0, 0, width, height], [width * scale, height * scale])

    // Miniatura: recorte centrado al 4:5, como el object-fit: cover de la card
    const [cropWidth, cropHeight] = width / height > THUMB_RATIO
      ? [height * THUMB_RATIO, height]
      : [width, width / THUMB_RATIO]
    const thumb = await draw(
      bitmap,
      [(width - cropWidth) / 2, (height - cropHeight) / 2, cropWidth, cropHeight],
      [THUMB_WIDTH, THUMB_HEIGHT]
    )

    return { original, thumb }
  } finally {
    bitmap.close()
  }
}
