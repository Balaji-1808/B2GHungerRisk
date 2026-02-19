# Registration & Login Guide

## How the System Works Now

### ✅ Real Schools in Database
All schools from the database are now **automatically included** in the system when you select a district!

### 🎯 Complete Flow

#### 1. **Register as School Admin**

**Step-by-step:**
1. Go to: http://localhost:5173/register/school-admin
2. Fill in your name: "Dinesh"
3. Select district: "Cuddalore"
4. Search for school: Type "GHS Cuddalore"
5. Click on "GHS Cuddalore" from dropdown
6. Auto-fills:
   - School Name: GHS Cuddalore
   - UDISE Code: 33030100101
   - Block: Cuddalore
7. Complete other fields and register

#### 2. **After Registration**
- System loads Cuddalore district data
- Includes ALL database schools + generated schools
- Your school "GHS Cuddalore" is now in the system!

#### 3. **View Your School**
- Dashboard shows "My School" section
- Click "View Full Details" or go to "My School" in sidebar
- See complete school data with metrics

### 📊 What You'll See

**Dashboard:**
- Your school name: "GHS Cuddalore"
- Enrollment, attendance, capacity
- Risk score and metrics
- Link to detailed view

**My School Page:**
- Complete school profile
- 7-day forecast
- Risk factors analysis
- Historical data
- Shortage reporting

### 🏫 Example Schools to Try

**Kanchipuram District:**
```
Name: GHS Kanchipuram Main
UDISE: 33010100101
Block: Kanchipuram
```

**Tiruvallur District:**
```
Name: GHS Villivakkam
UDISE: 33020100101
Block: Villivakkam
```

**Cuddalore District:**
```
Name: GHS Cuddalore
UDISE: 33030100101
Block: Cuddalore
```

**Villupuram District:**
```
Name: GHS Tirukollur
UDISE: 33040100101
Block: Tirukollur
```

### 🔄 How Data Generation Works

**For each district:**
1. System loads all database schools (2-3 per block)
2. Generates 2-3 additional schools per block
3. Total: 4-5 schools per block
4. Each school gets realistic data:
   - Enrollment: 150-500 students
   - Capacity: Based on enrollment
   - Risk scores: 0-100%
   - Attendance patterns
   - Meal uptake data

### ✨ Key Features

**No More "School Not Found":**
- All database schools are included
- Additional schools generated for variety
- Every block has 4-5 schools minimum

**Realistic Data:**
- Each school has unique metrics
- Risk scores vary
- Some schools have cascade risks
- Shortage reports for high-risk schools

**Role-Based Views:**
- **District Officer:** Sees all schools in district
- **Block Officer:** Sees schools in their block only
- **School Admin:** Sees their school only

### 🎮 Quick Test

**Complete Registration Flow:**
```
1. Register → School Admin
2. Name: "Dinesh"
3. District: "Cuddalore"
4. Search: "GHS Panruti"
5. Select from dropdown
6. Complete registration
7. Login with credentials
8. See "My School" with full data!
```

### 📝 Notes

- **117 real schools** in database
- **200+ total schools** with generated ones
- **4 districts** fully populated
- **52 blocks** with schools
- All searchable and accessible

## Troubleshooting

**If you don't see your school:**
1. Make sure you selected the correct district
2. Check that UDISE code matches database
3. Try refreshing the page
4. Clear localStorage and re-register

**To reset everything:**
```javascript
// In browser console:
localStorage.clear();
location.reload();
```

Enjoy your fully populated school system! 🎉
