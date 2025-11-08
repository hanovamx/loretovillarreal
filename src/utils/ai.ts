import type { AIInsights } from '../types'
import { randomBool, randomFloat, randomInt, randomItem, sampleSize } from './random'

const sceneTypes = ['portrait', 'group', 'event', 'product', 'landscape'] as const
const lightingTypes = ['studio', 'natural', 'mixed', 'low_light'] as const

const expressionTags = [
  'smile',
  'serious_expression',
  'laughing',
  'closed_eyes',
  'open_eyes',
  'looking_at_camera',
  'looking_away',
] as const

const qualityTags = [
  'sharp_focus',
  'slight_blur',
  'well_exposed',
  'overexposed',
  'underexposed',
  'professional_lighting',
] as const

const sceneTags = [
  'indoor',
  'outdoor',
  'studio_shot',
  'natural_light',
  'portrait',
  'full_body',
  'headshot',
  'black_background',
  'white_background',
] as const

const moodTags = [
  'elegant',
  'celebratory',
  'professional',
  'casual',
  'dramatic',
  'romantic',
  'joyful',
] as const

const dominantColorsPalette = [
  '#000000',
  '#FFFFFF',
  '#F43F5E',
  '#F59E0B',
  '#10B981',
  '#3B82F6',
  '#8B5CF6',
  '#F97316',
  '#F3F4F6',
  '#6366F1',
] as const

const categorySuggestions = [
  'professional_headshot',
  'family_portrait',
  'event_highlight',
  'graduation_feature',
  'corporate_profile',
  'editorial_portrait',
  'wedding_moment',
] as const

const personTagsForCount = (count: number) => {
  if (count >= 3) return ['group_photo']
  if (count === 2) return ['couple_photo']
  return ['solo_photo']
}

export const generateAITags = async (
  fileHash: string,
): Promise<{ tags: string[]; insights: AIInsights }> => {
  await new Promise((resolve) => setTimeout(resolve, randomInt(900, 1500)))
  return generateAITagsSync(fileHash)
}

export const generateAITagsSync = (fileHash: string): { tags: string[]; insights: AIInsights } => {
  const facesCount = randomInt(1, 4)
  const baseTags = [`face_detected_${facesCount}`]
  const faceIds = Array.from({ length: facesCount }, (_, idx) => `${fileHash}_face_${idx + 1}`)
  const expressionSelection = sampleSize(expressionTags, facesCount + 1)
  const qualitySelection = sampleSize(qualityTags, 2)
  const sceneSelection = sampleSize(sceneTags, 3)
  const personTags = personTagsForCount(facesCount)

  const hasClosedEyes = expressionSelection.includes('closed_eyes') || randomBool(0.15)
  const hasBlur = qualitySelection.includes('slight_blur')
  const hasTechnical = hasBlur || randomBool(0.05)
  const hasOverexposure = qualitySelection.includes('overexposed') || randomBool(0.07)

  const insights: AIInsights = {
    faces_count: facesCount,
    face_ids: faceIds,
    quality_score: randomFloat(6.5, 9.8, 1),
    composition_score: randomFloat(7.0, 9.7, 1),
    has_closed_eyes: hasClosedEyes,
    has_blur: hasBlur,
    has_technical_issues: hasTechnical,
    has_overexposure: hasOverexposure,
    is_group_photo: facesCount >= 3,
    dominant_colors: sampleSize(dominantColorsPalette, randomInt(3, 5)),
    scene_type: randomItem(sceneTypes),
    lighting_type: randomItem(lightingTypes),
    suggested_category: randomItem(categorySuggestions),
    mood: randomItem(moodTags),
  }

  const tags = [
    ...baseTags,
    ...personTags,
    ...expressionSelection,
    ...qualitySelection,
    ...sceneSelection,
    insights.mood,
  ]
    .map((tag) => tag.replaceAll(' ', '_'))
    .filter((value, idx, array) => array.indexOf(value) === idx)

  return {
    tags,
    insights,
  }
}

