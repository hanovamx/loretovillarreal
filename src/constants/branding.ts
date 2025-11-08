export const BRANDING_HERO_IMAGES = [
  'https://cdn.prod.website-files.com/673d3aa2c37f6e0535a1ef2a/673ea12f33b0c0400e01721d_01_VUELTA_Postal_Helicoidal_5x7_pulgadas-p-1600.webp',
  'https://cdn.prod.website-files.com/673d3aa2c37f6e0535a1ef2a/673ea12f7ab2e9ccc395e7c3_02_VUELTA_Postal_Helicoidal_5x7_pulgadas.webp',
  'https://cdn.prod.website-files.com/673d3aa2c37f6e0535a1ef2a/673ea12fceb64d8f7b5d4a0c_03_VUELTA_Postal_Helicoidal_5x7_pulgadas-p-1600.webp',
  'https://cdn.prod.website-files.com/673d3aa2c37f6e0535a1ef2a/673ea12fe0ca7c0f9bc5a9e2_06_VUELTA_Postal_Helicoidal_5x7_pulgadas-p-1600.webp',
]

export const BRANDING_PORTRAIT_IMAGES = [
  'https://cdn.prod.website-files.com/673d3aa2c37f6e0535a1ef2a/673ea786acaac1335d2f00d2_Rasgos_Comunes_GABRIELA_BOESH_DE_ASSAD.webp',
  'https://cdn.prod.website-files.com/673d3aa2c37f6e0535a1ef2a/673ea786da44347e264e9226_LAYLA-KAMAR-RASGOS-COMUNES_10439-2.webp',
  'https://cdn.prod.website-files.com/673d3aa2c37f6e0535a1ef2a/673ea786f734e9a1b547d74e_CARLA-ZAMBRANO-RASGOS-COMUNES_10780-Recovered.webp',
  'https://cdn.prod.website-files.com/673d3aa2c37f6e0535a1ef2a/6799322a47bdb76c5b3440c0_05%204%20L1037645-Edit-p-1080.webp',
  'https://cdn.prod.website-files.com/673d3aa2c37f6e0535a1ef2a/6799322a1e1ddbbad0673ad1_05%205%20L1033521-Edit-p-1080.webp',
  'https://cdn.prod.website-files.com/673d3aa2c37f6e0535a1ef2a/6799322b419f2ee7fd685984_05%206%20L1041658-Edit-p-800.webp',
]

export const getBrandingImage = (collection: string[], seed: string | number) => {
  if (collection.length === 0) return ''
  const index = Math.abs(typeof seed === 'number' ? seed : Array.from(String(seed)).reduce((acc, char) => acc + char.charCodeAt(0), 0)) % collection.length
  return collection[index]
}

