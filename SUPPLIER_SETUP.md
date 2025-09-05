# Supplier Signup Implementation

This document outlines the supplier signup functionality that has been implemented in the Syntis application.

## Authentication & Route Protection

### Route Protection
The application uses server-side authentication checks to protect routes and handle authentication redirects:

- **Non-authenticated users** accessing the root path (`/`) are redirected to `/auth/login`
- **Authenticated users** are shown their role-appropriate dashboard
- **Public routes** like `/landing` are accessible to non-authenticated users

### Implementation
- **Root page**: `src/app/page.tsx` - Checks authentication and redirects if needed
- **Supabase middleware**: `src/lib/supabase/middleware.ts` - Available for future use

### Protected Routes
The following routes require authentication:
- `/` (root - redirects to role-based dashboard)
- `/admin/*` (admin pages)
- `/client/*` (client pages)
- `/supplier/*` (supplier pages)

### Public Routes
The following routes are accessible without authentication:
- `/landing` (public landing page)
- `/auth/*` (authentication pages)
- `/api/*` (API endpoints)

## Overview

The supplier signup system allows businesses to create accounts and join the Syntis supplier network. The implementation includes:

- A comprehensive signup form for suppliers
- API endpoint for account creation
- Success page after signup
- Supplier dashboard
- Role-based access control
- Admin functionality to add suppliers to clients

## Routes Created

### 1. Supplier Signup Page
- **URL**: `/supplier/signup`
- **File**: `src/app/supplier/signup/page.tsx`
- **Component**: `SupplierSignUpForm`

### 2. Supplier Signup Success Page
- **URL**: `/supplier/signup-success`
- **File**: `src/app/supplier/signup-success/page.tsx`

### 3. Supplier Dashboard
- **URL**: `/supplier/dashboard`
- **File**: `src/app/supplier/dashboard/page.tsx`
- **Component**: `SupplierDashboard`

### 4. Public Landing Page
- **URL**: `/landing`
- **File**: `src/app/landing/page.tsx`

## API Endpoints

### Supplier Creation API (Consolidated)
- **URL**: `/api/supplier/create`
- **Method**: POST
- **File**: `src/app/api/supplier/create/route.ts`
- **Usage**: 
  - **Public Signup**: Include `password` field for self-service registration
  - **Admin Creation**: Omit `password` field for admin-created accounts (generates temp password automatically)
  - **Client Assignment**: Include `clientId` field to automatically link supplier to client

### Admin Supplier Creation API
- **URL**: `/api/supplier/create` (same as public signup)
- **Method**: POST
- **File**: `src/app/api/supplier/create/route.ts`
- **Authentication**: Admin must be logged in (no additional checks needed)
- **Features**: 
  - Creates supplier profile AND user account
  - Generates temporary password automatically
  - Sends invitation email automatically
  - Assigns supplier role
  - Can optionally assign to specific client
  - Returns temporary password for admin reference

**Request Body:**
```json
{
  "companyName": "string (required)",
  "contactEmail": "string (required)",
  "contactPhone": "string (optional)",
  "address": "string (optional)",
  "businessType": "string (optional)",
  "ein": "string (optional)",
  "domain": "string (optional)",
  "password": "string (required, min 8 characters)"
}
```

**Response:**
```json
{
  "success": true,
  "supplier_id": "uuid",
  "user_id": "uuid",
  "temp_password": "temporary-password",
  "message": "Supplier created successfully with login credentials"
}
```

## Database Changes

The supplier signup process creates records in the following tables:

### 1. `auth.users` (Supabase Auth)
- User account with email and password
- User metadata includes company name

### 2. `suppliers`
- Company information
- Contact details
- Business type and EIN
- Status (initially set to "pending")

### 3. `user_roles`
- Role assignment ("supplier")
- Active status
- Assignment timestamp

### 4. `supplier_client_relationships`
- Links suppliers to clients
- Relationship status and dates
- Notes and metadata

## Components

### SupplierSignUpForm
- **File**: `src/components/supplier-sign-up-form.tsx`
- **Features**:
  - Company information collection
  - Contact details
  - Business type and EIN
  - Password creation with validation
  - Form validation and error handling
  - API integration

### SupplierDashboard
- **File**: `src/components/SupplierDashboard.tsx`
- **Features**:
  - Welcome message with company name
  - Status badge (pending/active/suspended)
  - Risk level display
  - Next renewal date
  - Document management status
  - Action cards for profile completion
  - Recent activity feed

### AddSupplierToClientDialog
- **File**: `src/components/AddSupplierToClientDialog.tsx`
- **Features**:
  - Dialog for admins to add suppliers to clients
  - Two modes: "Select Existing Supplier" and "Create New Supplier"
  - Dropdown to select from available suppliers
  - Relationship status configuration
  - Start/end date setting
  - Notes field
  - Automatic filtering of already-associated suppliers
  - Integrated supplier creation form

### SupplierForm
- **File**: `src/components/SupplierForm.tsx`
- **Features**:
  - Reusable form component for supplier creation
  - Company information collection
  - Optional password fields for account creation
  - Form validation and error handling
  - Configurable submit button text
  - Used by both signup and admin creation flows

## Admin Functionality

### Adding Suppliers to Clients
Admins can now add existing suppliers or create new ones through the client detail page:

1. **Location**: Admin client detail page (`/admin/client-manager/[clientId]`)
2. **Button**: "Add Supplier to Client" in the Associated Suppliers card
3. **Dialog Features**:
   - **Select Mode**: Choose from existing suppliers (excludes already associated ones)
   - **Create Mode**: Create a new supplier using the same form as signup (without password fields)
   - Set relationship status (active, inactive, pending, terminated, suspended)
   - Configure start and end dates
   - Add notes about the relationship
4. **Database**: Creates records in `suppliers` and `supplier_client_relationships` tables
5. **User Account Creation**: Automatically creates user account with temporary password
6. **Email Invitation**: Sends invitation email with login credentials
7. **Success Feedback**: Shows temporary password to admin for reference

## User Flow

### Public Supplier Signup Flow
1. **Landing Page**: User visits `/landing` and chooses "Sign Up as Supplier"
2. **Signup Form**: User fills out company and account information
3. **API Call**: Form data is sent to `/api/supplier/create`
4. **Account Creation**: 
   - User account created in Supabase Auth
   - Supplier profile created in `suppliers` table
   - Supplier role assigned in `user_roles` table
5. **Success Page**: User is redirected to `/supplier/signup-success`
6. **Email Verification**: User receives confirmation email
7. **Dashboard Access**: After email verification, user can access `/supplier/dashboard`

### Admin-Created Supplier Flow
1. **Admin Creation**: Admin creates supplier through client management dialog
2. **Account Creation**: API creates user account with temporary password
3. **Email Invitation**: Supplier receives invitation email with login link
4. **First Login**: Supplier uses temporary password to log in
5. **Password Change**: Supplier should change password on first login
6. **Access**: Full access to supplier dashboard and features

### Admin Association Flow
1. **Client Management**: Admins can add suppliers to clients via the client detail page
2. **Relationship Configuration**: Set status, dates, and notes for the relationship
3. **Database Update**: Creates record in `supplier_client_relationships` table

## Security Features

- Password validation (minimum 8 characters)
- Email format validation
- Required field validation
- Error handling for duplicate emails
- Role-based access control
- Email verification requirement
- Admin-only access to supplier-client relationship management

## Status Management

Suppliers start with a "pending" status and can be:
- **pending**: Initial state after signup
- **active**: Approved by admin
- **suspended**: Temporarily suspended
- **rejected**: Application rejected

Relationship statuses include:
- **active**: Currently active relationship
- **inactive**: Inactive relationship
- **pending**: Pending approval
- **terminated**: Relationship ended
- **suspended**: Temporarily suspended

## Next Steps

To complete the supplier functionality, consider implementing:

1. **Admin Approval Process**: Allow admins to review and approve supplier applications
2. **Document Upload**: Enable suppliers to upload business documents
3. **Profile Management**: Allow suppliers to edit their profile information
4. **Risk Assessment**: Implement risk factor evaluation for suppliers
5. **Client Relationships**: Enable suppliers to connect with clients
6. **Notifications**: Email notifications for status changes and requirements
7. **Relationship Management**: Allow editing and terminating supplier-client relationships
8. **Bulk Operations**: Enable admins to add multiple suppliers to clients at once

## Testing

To test the supplier signup:

1. Visit `/landing`
2. Click "Sign Up as Supplier"
3. Fill out the form with test data
4. Submit and verify the success page
5. Check the database for created records
6. Verify email confirmation process

To test admin functionality:

1. Login as an admin user
2. Navigate to a client detail page (`/admin/client-manager/[clientId]`)
3. Click "Add Supplier to Client" in the Associated Suppliers card
4. Select a supplier and configure the relationship
5. Submit and verify the supplier appears in the list

## Environment Variables

Ensure the following environment variables are set:
- `NEXT_PUBLIC_BASE_URL`: Base URL for email redirects
- Supabase configuration variables

## Dependencies

The implementation requires the following additional packages:
- `@radix-ui/react-select`: For dropdown components in the admin dialog

## Cystack API Integration

### Rating Score System
Cystack provides a rating score system with letter grades and detailed reasons:

**Grade System:**
- **Grade**: "B" (example grade)

**Reason Codes:**
- **0**: "No account or email leaks detected"
- **1**: "TLS 1.3 with strong cipher (TLS_AES_256_GCM_SHA384) is used"
- **2**: "No blacklisting detected"
- **3**: "All subdomains are secured with HTTPS"
- **4**: "Weak cipher suites detected (TLS 1.0/1.1 with CBC)"
- **5**: "No WAF or perimeter firewall detected"

### Implementation Notes
- Each reason code corresponds to a specific security assessment
- Multiple reasons can be returned for a single assessment
- Grade is determined based on the combination of detected issues
- Integration should handle both positive (0-3) and negative (4-5) reason codes
