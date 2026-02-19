# Login & Registration System

## Registration Feature

The application now includes a **full registration system** for all three user roles. You can create your own account with custom credentials!

### How to Register

1. Go to the main login page
2. Click on one of the "Register" buttons at the bottom, OR
3. Click on a role card to go to the login page, then click "Register here"
4. Fill out the registration form with your details
5. Your credentials will be saved and you can use them to log in!

### Registration Fields

**District Officer Registration:**
- Full Name *
- Official Email (@gov.in) *
- Phone Number (+91XXXXXXXXXX) *
- District (auto-filled)
- Employee ID *
- Designation (dropdown) *
- Password *
- Years of Experience (optional)
- Assigned Blocks (optional, multi-select)

**Block Officer Registration:**
- Full Name *
- Official Email (@gov.in) *
- Phone Number (+91XXXXXXXXXX) *
- Block Name (dropdown) *
- District (auto-filled)
- Employee ID *
- Designation (dropdown) *
- Password *

**School Admin Registration:**
- Full Name *
- School/Hostel Name *
- UDISE Code / Hostel Registration Number *
- Block (dropdown) *
- District (auto-filled)
- Phone Number (+91XXXXXXXXXX) *
- Official Email (optional)
- Password *
- Total Enrollment (optional)
- Kitchen Capacity (optional)
- School Type (optional)

## Login System

### Option 1: Use Registered Credentials
If you've registered, use your email and password to log in.

### Option 2: Demo Mode (Any Credentials)
You can still use **ANY credentials** to log in for demo purposes!

**Quick Demo Credentials:**
- Username: `admin` or anything
- Password: `password` or anything

## How It Works

### Registration Flow:
1. Fill out the registration form
2. Credentials are saved in browser localStorage
3. Automatically logged in after registration
4. Can use those credentials to log in again later

### Login Flow:
1. If you registered: Use your registered email and password
2. If not registered: Use any credentials (demo mode)
3. System checks registered credentials first, then allows any login

## Role-Specific Features

### District Officer
- Full district-wide dashboard
- Access to all blocks and schools
- Optimization Center (exclusive)
- Simulation Lab
- All reports and analytics

### Block Officer  
- Block-specific dashboard
- Schools within their block only
- Block-level reports
- Simulation Lab
- Limited to their assigned block

### School Admin
- Single school dashboard
- School-specific metrics and reports
- Limited to their assigned school
- No access to optimization or simulation

## Notes

- Registration data is stored in browser localStorage (client-side only)
- No backend server required
- Perfect for testing and showcasing the UI/UX
- Clear localStorage to reset all registrations
- This is a **prototype/demo application** with mock data
