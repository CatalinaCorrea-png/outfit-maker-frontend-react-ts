// El <input type="color"> solo acepta "#rrggbb": con cualquier otra cosa muestra negro
// y la avisa en consola. Las prendas pueden tener "#fff" o un nombre ("navy", del seed).
const HEX6 = /^#[0-9a-fA-F]{6}$/
const HEX3 = /^#([0-9a-fA-F])([0-9a-fA-F])([0-9a-fA-F])$/

export const toHexColor = (color: string, fallback = "#000000"): string => {
  const value = color.trim()
  if (HEX6.test(value)) return value.toLowerCase()

  const short = HEX3.exec(value)
  if (short) return `#${short[1]}${short[1]}${short[2]}${short[2]}${short[3]}${short[3]}`.toLowerCase()

  // Nombres CSS: el canvas los traduce. Si no lo entiende, deja el valor anterior:
  // por eso se arranca con un centinela y se compara.
  const ctx = document.createElement("canvas").getContext("2d")
  if (!ctx) return fallback
  ctx.fillStyle = "#010203"
  ctx.fillStyle = value
  const parsed = ctx.fillStyle
  return parsed !== "#010203" && HEX6.test(parsed) ? parsed : fallback
}
