# Sensitive Complaints Feature

## Overview

This feature adds a new "Sensitive" category for complaints that require special handling and high priority processing. Sensitive complaints include cases such as staff misconduct, harassment, bullying, and other serious matters.

## Changes Made

### 1. Database Schema Updates

#### `/src/db/schema/enums.ts`

- Added `'sensitive'` to the `complaintCategoryEnum`

#### `/src/db/schema/complaints.ts`

- Added new field: `sensitiveType: varchar('sensitive_type', { length: 255 })`
- This field stores the specific type of sensitive complaint (e.g., "Staff Misconduct", "Sexual Harassment")

### 2. Form Enums Updates

#### `/src/app/student/complaints/submit/enums.ts`

- Added `'sensitive'` to the `CATEGORIES` array
- Created new `SENSITIVE_TYPES` array with the following options:
  - Staff Misconduct
  - Sexual Harassment
  - Bullying
  - Discrimination
  - Abuse of Power
  - Other Sensitive Matter

### 3. Validation Schema Updates

#### `/src/app/student/complaints/submit/zod.ts`

- Added `sensitiveType` field (optional)
- Added validation refinement to require `sensitiveType` when category is 'sensitive'
- Error message: "Sensitive type is required for sensitive complaints"

### 4. Form Component Updates

#### `/src/app/student/complaints/submit/components/form.tsx`

- Added `sensitiveType` to the `ComplaintValues` type
- Added state management for `selectedCategory`
- Added conditional rendering of "Sensitive Type" dropdown when "Sensitive" category is selected
- Added warning message: "⚠️ Sensitive complaints are automatically marked as high priority"
- Form submission now includes `sensitiveType` in the FormData when applicable

### 5. Backend Action Updates

#### `/src/utils/actions/complaints.ts`

- Modified `createComplaintWithAttachment` function to:
  - Extract `sensitiveType` from form data
  - Detect if complaint is sensitive (`category === 'sensitive'`)
  - Automatically set `priority: 'high'` for sensitive complaints
  - Automatically set `sensitive: true` flag for sensitive complaints
  - Store the `sensitiveType` value in the database

## Feature Behavior

### User Flow

1. Student selects "Sensitive" category from the dropdown
2. A new "Sensitive Complaint Type" dropdown appears immediately below
3. Student must select a specific type of sensitive complaint
4. A warning appears: "⚠️ Sensitive complaints are automatically marked as high priority"
5. Student completes the rest of the form (faculty, department, title, description, attachments)
6. On submission:
   - Complaint is automatically marked as HIGH priority
   - Sensitive flag is set to `true`
   - Sensitive type is stored for admin review

### Backend Processing

- All sensitive complaints bypass normal priority assignment
- Priority is forced to "high" regardless of other factors
- The `sensitive` boolean flag allows easy filtering of sensitive complaints
- The `sensitiveType` field provides additional context for handling

## Database Migration

The schema changes have been applied to the database using:

```bash
pnpm db:push
```

## Testing Checklist

- [ ] Verify "Sensitive" appears in category dropdown
- [ ] Verify sensitive type dropdown appears when "Sensitive" is selected
- [ ] Verify sensitive type dropdown hides when other category is selected
- [ ] Verify validation error if sensitive category selected but no type chosen
- [ ] Verify form submission creates complaint with high priority
- [ ] Verify complaint has sensitive flag set to true
- [ ] Verify sensitiveType is stored in database
- [ ] Verify admin can see sensitive complaints with high priority

## Security Considerations

- Sensitive complaints are automatically flagged for priority handling
- Consider adding additional access controls for viewing sensitive complaints
- Consider implementing encrypted storage for sensitive complaint details
- Consider audit logging for who views sensitive complaints
