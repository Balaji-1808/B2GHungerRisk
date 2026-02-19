# Financial Allocation System - Mid-Day Meal Scheme

## Overview
The system automatically generates realistic financial allocations for all schools based on their enrollment size, following Tamil Nadu Mid-Day Meal Scheme norms.

## Allocation Formula

### Base Calculation
```
Cost per child per day: ₹6.80 (average of primary and upper primary)
Working days per year: 220 days
Base allocation per child: ₹6.80 × 220 = ₹1,496 per year

School Allocation = Enrollment × ₹1,496
```

### Realistic Variations
- **Allocation Amount**: Base amount ± 5% variation (to account for different school types, infrastructure needs)
- **Released Amount**: 93-97% of allocation (realistic government fund release patterns)
- **Utilized Amount**: 96-100% of released amount (efficient utilization)

## Examples by School Size

### Small School (200 students)
- Allocation: ₹2,99,200 (₹2.99 Lakh)
- Released: ₹2,84,000 - ₹2,90,000 (95%)
- Utilized: ₹2,72,000 - ₹2,90,000 (97%)

### Medium School (400 students)
- Allocation: ₹5,98,400 (₹5.98 Lakh)
- Released: ₹5,68,000 - ₹5,80,000 (95%)
- Utilized: ₹5,45,000 - ₹5,80,000 (97%)

### Large School (700 students)
- Allocation: ₹10,47,200 (₹10.47 Lakh)
- Released: ₹9,95,000 - ₹10,15,000 (95%)
- Utilized: ₹9,55,000 - ₹10,15,000 (97%)

## How It Works

### 1. Dynamic Generation
When a school is accessed, the system:
1. Checks if static financial data exists (for 20 predefined schools)
2. If not found, generates financial data based on enrollment
3. Caches the generated data for consistency

### 2. District-Level Aggregation
District financial summaries are calculated by:
- Summing all school allocations in the district
- Calculating average release and utilization percentages
- Displaying total amounts in Lakhs or Crores

### 3. Block-Level Aggregation
Block financial summaries show:
- Number of schools in the block
- Total allocation, released, and utilized amounts
- Efficiency metrics (utilization rate)

## Financial Data Display

### Dashboard
- **District Officer**: District-wide financial summary
- **Block Officer**: Block-level financial summary with school count
- **School Admin**: Individual school financial metrics

### Reports Page
- Detailed financial tables with UDISE codes
- Per-student allocation breakdown
- Release and utilization percentages

### School Detail Page
- Complete financial summary for the school
- Per-student cost breakdown
- Utilization efficiency metrics

## Data Consistency
- Uses seeded random generation for consistent results
- Same school always gets same financial allocation
- Data persists across sessions via caching

## Compliance with Government Norms
Based on Tamil Nadu Mid-Day Meal Scheme guidelines:
- Primary (Classes 1-5): ₹5.45 per child per day
- Upper Primary (Classes 6-8): ₹8.17 per child per day
- Average used: ₹6.80 per child per day
- Covers: Rice, Dal, Vegetables, Cooking costs, Fuel, and Cook wages

## Future Enhancements
- Integration with actual government financial APIs
- Real-time budget tracking
- Quarterly fund release schedules
- Expense category breakdown (food, fuel, wages)
