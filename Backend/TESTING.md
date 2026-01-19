# Testing Guide for Resume Platform

## Prerequisites
- Server running (`npm run dev`) on `http://localhost:8000`

## 1. Optimize Resume (AI Generation)
**Endpoint**: `POST http://localhost:8000/api/resumes/optimize`
**Headers**: `Content-Type: application/json`

**Body (`raw` -> `JSON`):**
```json
{
    "userId": "test-user-123",
    "jd": "We are looking for a Senior Software Engineer with experience in Node.js, React, and MongoDB. Must have strong leadership skills and experience with AWS.",
    "resumeData": {
        "personalInfo": {
            "name": "Alex Johnson",
            "email": "alex@example.com",
            "phone": "555-0100"
        },
        "summary": "Junior developer looking for a job.",
        "skills": ["JavaScript", "HTML", "CSS"],
        "experience": [
            {
                "company": "Startup Inc",
                "role": "Web Developer",
                "duration": "2021-2023",
                "details": ["Made websites", "Fixed bugs"]
            }
        ],
        "projects": [
            {
                "name": "Portfolio",
                "description": "My personal site"
            }
        ]
    }
}
```

## 2. Preview Resume (Generate PDF)
**Endpoint**: `POST http://localhost:8000/api/resumes/preview`
**Headers**: `Content-Type: application/json`

**Body (`raw` -> `JSON`):**
*Copy the `optimizedResume` object from the response of step 1, or use sample data.*

```json
{
    "templateId": "templateA",
    "resumeData": { ...PASTE_YOUR_RESUME_DATA_HERE... }
}
```
*Note: Valid `templateId`s are `"templateA"` and `"templateB"`.*

## 3. Download Resume (Save & Final PDF)
**Endpoint**: `POST http://localhost:8000/api/resumes/download`
**Headers**: `Content-Type: application/json`

**Body (`raw` -> `JSON`):**
```json
{
    "userId": "test-user-123",
    "templateId": "templateB",
    "resumeData": { ...PASTE_YOUR_RESUME_DATA_HERE... }
}
```
