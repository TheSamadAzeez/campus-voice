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

const DEPARTMENTS = {
  Science: [
    'Computer Science',
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'Statistics',
    'Microbiology',
    'Biochemistry',
    'Botany',
    'Zoology',
  ],
  'Management Science': [
    'Accounting',
    'Business Administration',
    'Economics',
    'Banking and Finance',
    'Marketing',
    'Public Administration',
    'Industrial Relations and Personnel Management',
    'Insurance and Actuarial Science',
  ],
  Arts: [
    'English',
    'History',
    'Philosophy',
    'Political Science',
    'Sociology',
    'Geography',
    'Linguistics',
    'French',
    'Arabic and Islamic Studies',
    'Music',
    'Theatre Arts',
    'Fine Arts',
  ],
  Law: ['Common Law', 'Civil Law', 'Commercial Law', 'Criminal Law', 'International Law', 'Constitutional Law'],
  Transport: [
    'Transport Management',
    'Maritime Transport',
    'Aviation Management',
    'Logistics and Supply Chain',
    'Transport Planning',
  ],
  Education: [
    'Educational Administration',
    'Curriculum Studies',
    'Educational Psychology',
    'Adult Education',
    'Physical and Health Education',
    'Library and Information Science',
  ],
  Other: ['General Studies', 'Inter-disciplinary Studies'],
} as const

export { CATEGORIES, RESOLUTION_TYPES, FACULTIES, DEPARTMENTS }
