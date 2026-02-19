# API Documentation - Mid-Day Meal Digital Twin System

## Base URL
```
Development: http://localhost:8000/api/v1
Production: https://api.midday-meal.tn.gov.in/api/v1
```

## Authentication

All endpoints (except `/auth/login` and `/auth/register`) require JWT authentication.

### Headers
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

---

## 🔐 Authentication Endpoints

### 1. User Registration
**POST** `/auth/register`

Register a new user (District Officer, Block Officer, or School Admin).

**Request Body:**
```json
{
  "email": "officer@gov.in",
  "password": "SecurePass123!",
  "full_name": "Rajesh Kumar",
  "role": "district_officer",
  "district": "Kanchipuram",
  "block": "Kanchipuram",
  "employee_id": "EMP001",
  "designation": "District Education Officer",
  "phone": "+919876543210"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "uuid-here",
    "email": "officer@gov.in",
    "full_name": "Rajesh Kumar",
    "role": "district_officer",
    "district": "Kanchipuram"
  },
  "message": "User registered successfully"
}
```

### 2. User Login
**POST** `/auth/login`

Authenticate user and receive JWT tokens.

**Request Body:**
```json
{
  "email": "officer@gov.in",
  "password": "SecurePass123!"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "bearer",
    "expires_in": 1800,
    "user": {
      "id": "uuid-here",
      "email": "officer@gov.in",
      "full_name": "Rajesh Kumar",
      "role": "district_officer",
      "district": "Kanchipuram"
    }
  }
}
```

### 3. Refresh Token
**POST** `/auth/refresh`

Get new access token using refresh token.

**Request Body:**
```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "access_token": "new-access-token",
    "token_type": "bearer",
    "expires_in": 1800
  }
}
```

### 4. Get Current User
**GET** `/auth/me`

Get authenticated user's profile.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid-here",
    "email": "officer@gov.in",
    "full_name": "Rajesh Kumar",
    "role": "district_officer",
    "district": "Kanchipuram",
    "block": null,
    "school_id": null,
    "employee_id": "EMP001",
    "created_at": "2026-01-15T10:30:00Z"
  }
}
```

---

## 🏫 School Management Endpoints

### 1. List Schools
**GET** `/schools`

Get list of schools (filtered by user role).

**Query Parameters:**
- `district` (optional): Filter by district
- `block` (optional): Filter by block
- `risk_level` (optional): Filter by risk level (low, medium, high, critical)
- `page` (optional, default: 1): Page number
- `limit` (optional, default: 50): Items per page
- `search` (optional): Search by name or UDISE code

**Response (200):**
```json
{
  "success": true,
  "data": {
    "schools": [
      {
        "id": "33120100101",
        "name": "GHS Kanchipuram",
        "district": "Kanchipuram",
        "block": "Kanchipuram",
        "enrollment": 420,
        "capacity": 450,
        "current_attendance": 385,
        "avg_meal_uptake": 370,
        "risk_score": 45,
        "risk_level": "medium",
        "cascade_risk": false,
        "hostel_attached": true,
        "last_inspection": "2026-01-15",
        "shortage_reported": false,
        "latitude": 12.8342,
        "longitude": 79.7036
      }
    ],
    "total": 156,
    "page": 1,
    "pages": 4
  }
}
```

### 2. Get School Details
**GET** `/schools/{school_id}`

Get detailed information about a specific school.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "33120100101",
    "name": "GHS Kanchipuram",
    "district": "Kanchipuram",
    "block": "Kanchipuram",
    "enrollment": 420,
    "capacity": 450,
    "current_attendance": 385,
    "avg_meal_uptake": 370,
    "risk_score": 45,
    "risk_level": "medium",
    "cascade_risk": false,
    "hostel_attached": true,
    "last_inspection": "2026-01-15",
    "shortage_reported": false,
    "latitude": 12.8342,
    "longitude": 79.7036,
    "financial_data": {
      "allocation_amount": 628320,
      "released_amount": 596704,
      "utilized_amount": 610000,
      "financial_year": "2024-25"
    },
    "recent_alerts": [],
    "forecast": []
  }
}
```

### 3. Create School
**POST** `/schools`

Create a new school (District Officer only).

**Request Body:**
```json
{
  "id": "33120100999",
  "name": "New Government School",
  "district": "Kanchipuram",
  "block": "Kanchipuram",
  "enrollment": 300,
  "capacity": 350,
  "hostel_attached": false,
  "latitude": 12.8342,
  "longitude": 79.7036
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "33120100999",
    "name": "New Government School",
    "message": "School created successfully"
  }
}
```

### 4. Update School
**PUT** `/schools/{school_id}`

Update school information.

**Request Body:**
```json
{
  "enrollment": 320,
  "capacity": 360,
  "current_attendance": 295
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "33120100101",
    "message": "School updated successfully"
  }
}
```

### 5. Search Schools
**GET** `/schools/search`

Search schools by name, UDISE code, or block.

**Query Parameters:**
- `q` (required): Search query
- `district` (optional): Filter by district

**Response (200):**
```json
{
  "success": true,
  "data": {
    "results": [
      {
        "id": "33120100101",
        "name": "GHS Kanchipuram",
        "block": "Kanchipuram",
        "district": "Kanchipuram",
        "enrollment": 420
      }
    ],
    "count": 1
  }
}
```

---

## 💰 Financial Management Endpoints

### 1. Get School Financial Data
**GET** `/financial/schools/{school_id}`

Get financial data for a specific school.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "school_id": "33120100101",
    "school_name": "GHS Kanchipuram",
    "district": "Kanchipuram",
    "block": "Kanchipuram",
    "enrollment": 420,
    "allocation_amount": 628320,
    "released_amount": 596704,
    "utilized_amount": 610000,
    "released_percentage": 94.97,
    "utilized_percentage": 97.08,
    "utilization_efficiency": 102.23,
    "per_student_allocation": 1496,
    "financial_year": "2024-25"
  }
}
```

### 2. Get District Financial Summary
**GET** `/financial/districts/{district_name}`

Get aggregated financial data for a district.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "district": "Kanchipuram",
    "total_schools": 52,
    "total_enrollment": 18500,
    "total_allocation": 27676000,
    "total_released": 26292200,
    "total_utilized": 26900000,
    "released_percentage": 94.99,
    "utilized_percentage": 97.19,
    "financial_year": "2024-25",
    "blocks": [
      {
        "block": "Kanchipuram",
        "schools": 13,
        "allocation": 6500000,
        "released": 6175000,
        "utilized": 6320000
      }
    ]
  }
}
```

### 3. Get Block Financial Summary
**GET** `/financial/blocks/{block_name}`

Get financial data for a specific block.

**Query Parameters:**
- `district` (required): District name

**Response (200):**
```json
{
  "success": true,
  "data": {
    "block": "Kanchipuram",
    "district": "Kanchipuram",
    "school_count": 13,
    "total_enrollment": 4500,
    "total_allocation": 6732000,
    "total_released": 6395400,
    "total_utilized": 6550000,
    "released_percentage": 95.00,
    "utilized_percentage": 97.30,
    "schools": []
  }
}
```

### 4. Allocate Funds
**POST** `/financial/allocate`

Allocate funds to schools (District Officer only).

**Request Body:**
```json
{
  "school_id": "33120100101",
  "amount": 650000,
  "financial_year": "2024-25",
  "notes": "Additional allocation for increased enrollment"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "allocation_id": "uuid-here",
    "school_id": "33120100101",
    "amount": 650000,
    "message": "Funds allocated successfully"
  }
}
```

### 5. Update Utilization
**PUT** `/financial/update-utilization`

Update fund utilization (School Admin only).

**Request Body:**
```json
{
  "school_id": "33120100101",
  "utilized_amount": 620000,
  "month": "February",
  "year": 2026
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "school_id": "33120100101",
    "utilized_amount": 620000,
    "message": "Utilization updated successfully"
  }
}
```

---

## 🤖 ML Prediction Endpoints

### 1. Get Risk Score
**GET** `/predictions/risk/{school_id}`

Get AI-predicted risk score for a school.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "school_id": "33120100101",
    "risk_score": 45,
    "risk_level": "medium",
    "confidence": 0.87,
    "predicted_at": "2026-02-19T11:23:45Z",
    "factors": [
      {
        "factor": "Attendance Drop",
        "impact": 0.82,
        "description": "15% decline in past week"
      }
    ]
  }
}
```

### 2. Get 7-Day Forecast
**GET** `/predictions/forecast/{school_id}`

Get 7-day meal demand forecast.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "school_id": "33120100101",
    "forecast": [
      {
        "date": "2026-02-20",
        "predicted_demand": 370,
        "lower_bound": 325,
        "upper_bound": 415,
        "capacity": 450,
        "confidence": 0.92
      }
    ],
    "model_accuracy": 92.1,
    "generated_at": "2026-02-19T11:23:45Z"
  }
}
```

### 3. Get Risk Factors
**GET** `/predictions/risk-factors/{school_id}`

Get detailed risk factor analysis.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "school_id": "33120100101",
    "risk_factors": [
      {
        "factor": "Attendance Drop",
        "impact": 0.82,
        "description": "15% decline in past week attendance pattern",
        "severity": "high"
      },
      {
        "factor": "Seasonal Weather",
        "impact": 0.65,
        "description": "Monsoon forecast — likely transport disruptions",
        "severity": "medium"
      }
    ],
    "total_risk_score": 45,
    "analysis_date": "2026-02-19"
  }
}
```

---

## 🚨 Alert Management Endpoints

### 1. List Alerts
**GET** `/alerts`

Get alerts (filtered by user role).

**Query Parameters:**
- `severity` (optional): Filter by severity (info, warning, critical)
- `category` (optional): Filter by category
- `is_read` (optional): Filter by read status
- `page` (optional): Page number
- `limit` (optional): Items per page

**Response (200):**
```json
{
  "success": true,
  "data": {
    "alerts": [
      {
        "id": "uuid-here",
        "title": "High Risk: GHS Kanchipuram",
        "message": "Risk score at 75%. Immediate attention required.",
        "severity": "critical",
        "category": "high_risk",
        "school_id": "33120100101",
        "school_name": "GHS Kanchipuram",
        "block": "Kanchipuram",
        "is_read": false,
        "created_at": "2026-02-19T10:30:00Z"
      }
    ],
    "total": 15,
    "unread_count": 8
  }
}
```

### 2. Mark Alert as Read
**POST** `/alerts/mark-read/{alert_id}`

Mark an alert as read.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "alert_id": "uuid-here",
    "is_read": true,
    "message": "Alert marked as read"
  }
}
```

### 3. Get Unread Count
**GET** `/alerts/unread-count`

Get count of unread alerts.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "unread_count": 8,
    "by_severity": {
      "critical": 2,
      "warning": 4,
      "info": 2
    }
  }
}
```

---

## 📊 Reports & Export Endpoints

### 1. Export CSV
**GET** `/reports/export/csv`

Export data as CSV (role-specific).

**Query Parameters:**
- `type` (required): Report type (schools, financial, alerts)
- `district` (optional): Filter by district
- `block` (optional): Filter by block
- `start_date` (optional): Start date
- `end_date` (optional): End date

**Response (200):**
```
Content-Type: text/csv
Content-Disposition: attachment; filename="report.csv"

[CSV Data]
```

### 2. Dashboard Data
**GET** `/reports/dashboard/{role}`

Get dashboard data for specific role.

**Path Parameters:**
- `role`: User role (district_officer, block_officer, school_admin)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "kpis": {
      "total_schools": 52,
      "high_risk_schools": 8,
      "avg_risk_score": 42,
      "cascade_alerts": 3
    },
    "financial_summary": {},
    "risk_trend": [],
    "intelligence_summary": {}
  }
}
```

---

## 🔧 Optimization Endpoints

### 1. Get Recommendations
**GET** `/optimization/recommendations`

Get resource optimization recommendations.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "recommendations": [
      {
        "id": "uuid-here",
        "school_id": "33120100101",
        "school_name": "GHS Kanchipuram",
        "current_allocation": 450,
        "recommended_allocation": 480,
        "risk_before": 75,
        "risk_after": 45,
        "children_impacted": 85,
        "reason": "Attendance surge predicted",
        "status": "pending"
      }
    ],
    "total": 15
  }
}
```

### 2. Approve Recommendation
**POST** `/optimization/approve/{recommendation_id}`

Approve an optimization recommendation.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "recommendation_id": "uuid-here",
    "status": "approved",
    "message": "Recommendation approved successfully"
  }
}
```

---

## 📡 WebSocket Endpoints

### 1. Dashboard Live Updates
**WS** `/ws/dashboard`

Real-time dashboard updates.

**Message Format:**
```json
{
  "type": "dashboard_update",
  "data": {
    "kpis": {},
    "timestamp": "2026-02-19T11:23:45Z"
  }
}
```

### 2. Alert Notifications
**WS** `/ws/alerts`

Real-time alert notifications.

**Message Format:**
```json
{
  "type": "new_alert",
  "data": {
    "alert": {},
    "timestamp": "2026-02-19T11:23:45Z"
  }
}
```

---

## ⚠️ Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Invalid or missing token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource doesn't exist |
| 409 | Conflict - Resource already exists |
| 422 | Validation Error - Invalid data format |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error |
| 503 | Service Unavailable |

---

## 🔄 Rate Limiting

- **Per IP**: 60 requests/minute
- **Per User**: 1000 requests/hour
- **WebSocket**: 100 messages/minute

---

## 📝 Notes

- All timestamps are in ISO 8601 format (UTC)
- All amounts are in Indian Rupees (₹)
- Pagination starts at page 1
- Default page size is 50 items
- Maximum page size is 100 items
