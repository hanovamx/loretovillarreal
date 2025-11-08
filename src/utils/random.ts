export const randomItem = <T>(items: readonly T[]): T => {
  return items[Math.floor(Math.random() * items.length)]
}

export const randomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export const randomFloat = (min: number, max: number, decimals = 1): number => {
  const factor = 10 ** decimals
  return Math.round((Math.random() * (max - min) + min) * factor) / factor
}

export const randomBool = (trueRatio = 0.5) => Math.random() < trueRatio

export const sampleSize = <T>(items: readonly T[], size: number): T[] => {
  const clone = [...items]
  const result: T[] = []
  for (let i = 0; i < size && clone.length; i += 1) {
    const index = Math.floor(Math.random() * clone.length)
    result.push(clone.splice(index, 1)[0])
  }
  return result
}

