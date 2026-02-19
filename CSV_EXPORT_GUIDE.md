# CSV Export Functionality Guide

## Overview
The Reports page includes a role-specific CSV export feature that generates downloadable CSV files based on the logged-in user's role and permissions.

## Export Button Location
- **Page**: Reports (`/reports`)
- **Location**: Top-right corner, next to the block filter dropdown
- **Icon**: Download icon with "Export CSV" label

## Role-Specific Export Formats

### 1. District Officer Export

**Filename Format**: `{District}_District_Report_{Date}.csv`
- Example: `Kanchipuram_District_Report_2026-02-19.csv`

**Columns**:
- School ID
- School Name
- Block
- Enrollment
- Attendance
- Capacity
- Meal Uptake
- Risk Score
- Risk Level
- Cascade Risk (Yes/No)
- Shortage Reported (Yes/No)
- Allocation (₹)
- Released (₹)
- Utilized (₹)
- Released %
- Utilized %

**Data Scope**: All schools across all blocks in the district

**Use Cases**:
- District-wide performance analysis
- Budget allocation planning
- Risk assessment across blocks
- Comparative analysis between blocks

---

### 2. Block Officer Export

**Filename Format**: `{Block}_Block_Report_{Date}.csv`
- Example: `Kanchipuram_Block_Report_2026-02-19.csv`

**Columns**:
- School ID
- School Name
- UDISE Code
- Enrollment
- Attendance
- Capacity
- Meal Uptake
- Risk Score
- Risk Level
- Cascade Risk (Yes/No)
- Shortage Reported (Yes/No)
- Allocation (₹)
- Released (₹)
- Utilized (₹)
- Released %
- Utilized %

**Data Scope**: All schools within the officer's assigned block only

**Use Cases**:
- Block-level performance monitoring
- School-wise budget tracking
- Identifying high-risk schools in the block
- Resource allocation within the block

---

### 3. School Admin Export

**Filename Format**: `{School_Name}_Report_{Date}.csv`
- Example: `GHS_Kanchipuram_Report_2026-02-19.csv`

**Format**: Vertical key-value pairs (different from tabular format)

**Sections**:

#### Basic Information
- School Name
- UDISE Code
- Block
- District

#### Enrollment & Attendance
- Total Enrollment
- Current Attendance
- Attendance Rate (%)

#### Meal Service
- Meal Capacity
- Average Meal Uptake
- Capacity Utilization (%)

#### Risk Assessment
- Risk Score
- Risk Level
- Cascade Risk (Yes/No)
- Shortage Reported (Yes/No)
- Hostel Attached (Yes/No)
- Last Inspection Date

#### Financial Data (FY 2024-25)
- Total Allocation (₹)
- Released Amount (₹)
- Utilized Amount (₹)
- Released Percentage (%)
- Utilized Percentage (%)
- Utilization Efficiency (%)
- Per Student Allocation (₹)

**Data Scope**: Single school's complete detailed report

**Use Cases**:
- School performance documentation
- Budget utilization reports
- Compliance documentation
- Audit preparation

---

## Technical Implementation

### CSV Generation Process
1. User clicks "Export CSV" button
2. System identifies user role and permissions
3. Filters data based on role (district/block/school)
4. Generates financial data for each school dynamically
5. Formats data into CSV structure
6. Creates downloadable blob
7. Triggers browser download with appropriate filename

### Data Sources
- **School Data**: From `appStore.schools`
- **Financial Data**: Generated dynamically using `getSchoolFinancialData()`
- **User Context**: From `authStore` (role, district, block, schoolId)

### File Encoding
- **Format**: UTF-8 with BOM
- **Delimiter**: Comma (,)
- **Text Qualifier**: Double quotes (")
- **Line Ending**: LF (\n)

### Date Format
- **Filename Date**: ISO format (YYYY-MM-DD)
- **Report Dates**: As stored in database

---

## Usage Examples

### District Officer Workflow
1. Login as District Officer
2. Navigate to Reports page
3. Review district-wide data
4. Click "Export CSV"
5. Download: `Kanchipuram_District_Report_2026-02-19.csv`
6. Open in Excel/Google Sheets for analysis
7. Use for monthly district reports

### Block Officer Workflow
1. Login as Block Officer (e.g., Kanchipuram Block)
2. Navigate to Reports page
3. View block-specific schools
4. Click "Export CSV"
5. Download: `Kanchipuram_Block_Report_2026-02-19.csv`
6. Share with district office
7. Use for block-level planning

### School Admin Workflow
1. Login as School Admin
2. Navigate to Reports page
3. View school details
4. Click "Export CSV"
5. Download: `GHS_Kanchipuram_Report_2026-02-19.csv`
6. Submit for compliance
7. Use for internal documentation

---

## Data Accuracy

### Financial Calculations
All financial percentages are calculated to 2 decimal places:
- Released % = (Released Amount / Allocation Amount) × 100
- Utilized % = (Utilized Amount / Allocation Amount) × 100
- Utilization Efficiency = (Utilized Amount / Released Amount) × 100

### Enrollment Metrics
- Attendance Rate = (Current Attendance / Total Enrollment) × 100
- Capacity Utilization = (Avg Meal Uptake / Meal Capacity) × 100

---

## Browser Compatibility
- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari
- ✅ Opera

---

## Future Enhancements
- [ ] Export to Excel (.xlsx) format
- [ ] Custom date range selection
- [ ] Multi-sheet exports with charts
- [ ] Scheduled automated exports
- [ ] Email delivery option
- [ ] PDF report generation
- [ ] Custom column selection
- [ ] Export templates
