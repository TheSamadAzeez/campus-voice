const CATEGORIES = [
  'academic',
  'facility',
  'administration',
  'harassment',
  'infrastructure',
  'result',
  'other',
] as const

const RESOLUTION_TYPES = [
  'Immediate Action',
  'Investigation Required',
  'Policy Change',
  'No Specific Preference',
] as const

const FACULTIES = ['Science', 'Management Science', 'Arts', 'Law', 'Transport', 'Education', 'Other'] as const

export { CATEGORIES, RESOLUTION_TYPES, FACULTIES }
