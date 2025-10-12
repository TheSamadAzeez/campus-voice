# Role-Based Complaint Filtering Implementation

## Overview

This document outlines the implementation of role-based filtering for complaints and related data (feedback, notifications, and statistics) in the Campus Voice application.

## Changes Made

### 1. Complaint Filtering (`/src/utils/actions/complaints.ts`)

#### `getAllComplaints()`

- **Admin Role**: Now only sees sensitive complaints (where `sensitive = true`)
- **Department Admin Role**: Only sees non-sensitive complaints (where `sensitive = false`) for their assigned department

#### `getAdminComplaintsStats()`

- **Admin Role**: Statistics now only include sensitive complaints
- **Department Admin Role**: Statistics only include non-sensitive complaints from their assigned department

#### `getAllComplaintChartData()`

- **Admin Role**: Chart data now only includes sensitive complaints
- **Department Admin Role**: Chart data only includes non-sensitive complaints from their assigned department
- Faculty distribution chart is hidden for admins (only shown for department admins with their department data)

### 2. Feedback Filtering (`/src/utils/actions/feedback.ts`)

#### `getAllFeedback()`

- **Admin Role**: Only sees feedback for sensitive complaints
- **Department Admin Role**: Only sees feedback for non-sensitive complaints from their assigned department

#### `getFeedbackStats()`

- **Admin Role**: Statistics and analytics only include feedback from sensitive complaints
- **Department Admin Role**: Statistics and analytics only include feedback from non-sensitive complaints in their assigned department
- Resolved complaint counts are filtered accordingly for accurate response rate calculations

### 3. Notification Routing (`/src/utils/actions/notifications.ts`)

#### `createAdminNotification()`

Updated to accept two new optional parameters:

- `isSensitive?: boolean` - Indicates if the complaint is sensitive
- `department?: string` - The department associated with the complaint

**Routing Logic**:

- **Sensitive Complaints** (`isSensitive = true`):
  - Notifications sent only to users with `role = 'admin'`
  - Department admins will NOT receive these notifications
- **Non-Sensitive Complaints** (`isSensitive = false` and `department` is provided):
  - Notifications sent only to department admins with matching department
  - Users with `role = 'department-admin'` AND `department = [complaint department]`
- **Fallback**: If neither condition is met, notifications go to all admins

#### Updated Notification Calls:

**In complaint creation** (`createComplaintWithAttachment`):

```typescript
await createAdminNotification({
  complaintId: result.id,
  title: 'New Complaint Submitted',
  message: `A new complaint "${title}" has been submitted...`,
  type: 'new_complaint',
  isSensitive: isSensitive,
  department: !isSensitive ? department : undefined,
})
```

**In feedback submission** (`provideFeedback`):

```typescript
await createAdminNotification({
  complaintId: complaintId,
  title: 'New Feedback Received',
  message: `Feedback with ${rating}/5 stars has been submitted...`,
  type: 'feedback_request',
  isSensitive: complaint.sensitive,
  department: !complaint.sensitive ? complaint.department : undefined,
})
```

## Role Hierarchy Summary

### Admin (`role = 'admin'`)

- **Can See**: Only sensitive complaints
- **Can Access**:
  - Sensitive complaints list
  - Sensitive complaint details
  - Feedback for sensitive complaints
  - Statistics for sensitive complaints only

### Department Admin (`role = 'department-admin'`)

- **Can See**: Only non-sensitive complaints from their assigned department
- **Cannot See**: Sensitive complaints (regardless of department)
- **Can Access**:
  - Non-sensitive complaints list (filtered by department)
  - Non-sensitive complaint details (filtered by department)
  - Feedback for non-sensitive complaints (filtered by department)
  - Statistics for non-sensitive complaints only (filtered by department)

### Student (`role = 'student'`)

- **Can See**: Only their own complaints (unchanged)
- **Can Access**: All their complaints regardless of sensitivity status

## Database Schema

No database schema changes were required. The implementation uses existing fields:

- `complaints.sensitive` - Boolean flag indicating if complaint is sensitive
- `complaints.department` - Department associated with the complaint
- `users.role` - User's role (admin, department-admin, student)
- `users.department` - Department assigned to department admin

## Testing Recommendations

### Test Cases for Admin:

1. Login as admin and verify only sensitive complaints are visible
2. Check statistics only reflect sensitive complaints
3. Verify chart data only includes sensitive complaints
4. Confirm receiving notifications for new sensitive complaints
5. Verify NOT receiving notifications for non-sensitive complaints

### Test Cases for Department Admin:

1. Login as department admin and verify only seeing non-sensitive complaints from their department
2. Verify NOT seeing sensitive complaints
3. Verify NOT seeing complaints from other departments
4. Check statistics only reflect non-sensitive complaints from their department
5. Confirm receiving notifications for new complaints in their department
6. Verify NOT receiving notifications for sensitive complaints

### Test Cases for Students:

1. Verify students can still submit both sensitive and non-sensitive complaints
2. Verify students can view all their own complaints regardless of type
3. Verify students receive notifications for their own complaints

## Security Considerations

- All filtering happens server-side in the action functions
- Database queries use Drizzle ORM's type-safe query builder
- Role verification happens before any data access
- No client-side filtering - all security is enforced at the API level

## Impact on Existing Features

- Dashboard statistics will show different numbers based on role
- Admin dashboard will only show sensitive complaint metrics
- Department admin dashboard will only show their department's non-sensitive metrics
- Notification counts may differ between admin types
- All existing student functionality remains unchanged
