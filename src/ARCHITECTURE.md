# Hospital Appointment Booking System - Architecture & Design Document

This document outlines the Database Design, API Schema, UI Screen Layouts, and overall technical architecture for the Hospital Appointment Booking System.

---

## 1. Database Design (Relational / Schema Specification)

The application models its schema around three primary entities: **Patients**, **Doctors**, and **Appointments**. 

Below is the entity-relationship database design, structured with primary keys, foreign keys, and appropriate field types.

### A. `patients` Table
Stores patient profile details, demographic records, and high-level medical context.

| Column Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(36)` | `PRIMARY KEY` | Unique patient identifier (UUID). |
| `name` | `VARCHAR(100)` | `NOT NULL` | Full legal name of the patient. |
| `email` | `VARCHAR(150)` | `NOT NULL`, `UNIQUE` | Email used for registration and system access. |
| `phone` | `VARCHAR(20)` | `NOT NULL` | Contact number for updates and emergency. |
| `dob` | `DATE` | `NOT NULL` | Date of Birth (YYYY-MM-DD). |
| `gender` | `VARCHAR(15)` | `NOT NULL` | Choices: `Male`, `Female`, `Other`. |
| `blood_group` | `VARCHAR(5)` | `NULL` | Optional: e.g., `O+`, `A-`, `B+`. |
| `medical_history`| `TEXT` | `NULL` | Free-form summary of prior conditions or allergies. |
| `created_at` | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP`| Timestamp when patient registered. |

### B. `doctors` Table
Maintains medical practitioner catalogs, medical specialties, experience, and consultation setups.

| Column Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(36)` | `PRIMARY KEY` | Unique doctor identifier (UUID). |
| `name` | `VARCHAR(100)` | `NOT NULL` | Title & full name (e.g., Dr. Evelyn Carter). |
| `specialty` | `VARCHAR(100)` | `NOT NULL` | e.g., Cardiology, Pediatrics, Dermatology, Neurology. |
| `rating` | `DECIMAL(3,2)` | `DEFAULT 5.00` | Average star rating calculated from patient feedback. |
| `reviews_count` | `INT` | `DEFAULT 0` | Total number of reviews received. |
| `experience` | `INT` | `NOT NULL` | Total years of practice. |
| `image_url` | `VARCHAR(255)` | `NULL` | Profile portrait URL. |
| `about` | `TEXT` | `NULL` | Biography, clinical focus, and educational background. |
| `available_days` | `JSON` | `NOT NULL` | Array of strings, e.g., `["Monday", "Wednesday", "Friday"]`. |
| `time_slots` | `JSON` | `NOT NULL` | Array of session slots, e.g., `["09:00 AM", "10:00 AM"]`. |
| `consult_fee` | `DECIMAL(10,2)` | `NOT NULL` | Price per standard booking. |
| `hospital_name` | `VARCHAR(150)` | `NOT NULL` | primary affiliate hospital center. |

### C. `appointments` Table
The transaction log that connects patients, doctors, dates, times, and clinical details.

| Column Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(36)` | `PRIMARY KEY` | Unique appointment identifier (UUID). |
| `patient_id` | `VARCHAR(36)` | `FOREIGN KEY REFERENCES patients(id)` | Associated patient. |
| `doctor_id` | `VARCHAR(36)` | `FOREIGN KEY REFERENCES doctors(id)` | Associated doctor. |
| `date` | `DATE` | `NOT NULL` | Booked consultation date (YYYY-MM-DD). |
| `time_slot` | `VARCHAR(15)` | `NOT NULL` | Booked time slot (e.g., "11:00 AM"). |
| `status` | `VARCHAR(15)` | `DEFAULT 'scheduled'` | Status: `scheduled`, `cancelled`, `completed`. |
| `reason` | `VARCHAR(255)` | `NOT NULL` | Chief complaint / purpose of visit. |
| `notes` | `TEXT` | `NULL` | Clinical follow-up remarks or diagnostic summary. |
| `created_at` | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP`| Timestamp when booking occurred. |

---

## 2. API Structure (RESTful Endpoint Definitions)

### A. Authentication & Registration
* **`POST /api/auth/register`**
  - **Description**: Registers a new patient.
  - **Request Body**:
    ```json
    {
      "name": "Sarah Connor",
      "email": "sarah@example.com",
      "phone": "+1 (555) 019-2834",
      "dob": "1985-11-10",
      "gender": "Female",
      "bloodGroup": "O+",
      "medicalHistory": "Mild asthma"
    }
    ```
  - **Response (201 Created)**: Returns the newly created patient record with a session token.

* **`POST /api/auth/login`**
  - **Description**: Authenticates existing patient or administrator.
  - **Request Body**:
    ```json
    { "email": "sarah@example.com", "role": "patient" }
    ```
  - **Response (200 OK)**: Authenticated patient/admin model.

---

### B. Doctor Directory
* **`GET /api/doctors`**
  - **Query Parameters**: `specialty` (optional), `search` (optional)
  - **Description**: Returns all doctors, optionally filtered by keyword or speciality.
  - **Response (200 OK)**: Array of doctor profiles.

* **`GET /api/doctors/:id/available-slots?date=YYYY-MM-DD`**
  - **Description**: Computes active unbooked time-slots for a doctor on a specific date.
  - **Response (200 OK)**: `["09:00 AM", "11:00 AM", "04:00 PM"]`

---

### C. Appointment Management
* **`GET /api/appointments`**
  - **Query Parameters**: `patientId` (optional), `doctorId` (optional)
  - **Description**: Returns bookings. If requested by patient, returns only their history. If requested by Admin, returns master log.
  - **Response (200 OK)**: Array of appointment cards.

* **`POST /api/appointments`**
  - **Description**: Books a new appointment. Checks for double-booking conflicts.
  - **Request Body**:
    ```json
    {
      "patientId": "pat-1",
      "doctorId": "doc-1",
      "date": "2026-06-26",
      "timeSlot": "10:00 AM",
      "reason": "Routine annual cardiovascular screening."
    }
    ```
  - **Response (201 Created)**: Created appointment summary.

* **`PUT /api/appointments/:id/cancel`**
  - **Description**: Patient or administrator cancels an appointment. Returns the slot to the available pool.
  - **Request Body**:
    ```json
    { "reason": "Conflict in work schedule" }
    ```
  - **Response (200 OK)**: Updated appointment status.

* **`PUT /api/appointments/:id/complete`**
  - **Description**: Admin/Doctor changes status to `completed` and attaches medical summary note.
  - **Request Body**:
    ```json
    { "notes": "Freckles are completely benign. Prescribed daily sunblock." }
    ```
  - **Response (200 OK)**: Updated status with prescription notes.

---

## 3. Front-End UI Architecture (Modular React Components)

The frontend is implemented with modular, high-contrast layouts structured around user roles and key workflows.

- **`src/App.tsx`**: System Shell. Controls active views, authentication context, theme context, and persistent database synchronizations.
- **`src/components/`**:
  - **`DoctorCard.tsx`**: Individual grid component displaying credentials, ratings, experience, hospital tags, fees, and triggering the booking scheduler.
  - **`BookingModal.tsx`**: Multistep form layout enforcing date-matching limits, field validation, and conflict checking.
  - **`AppointmentList.tsx`**: Tabbed presentation organizing 'Upcoming Appointments' vs 'Past Records' with clear conditional rendering.
  - **`AdminDashboard.tsx`**: Professional analytics board featuring clinical metrics, revenue calculations, registration trends, and custom filters.
  - **`AuthModal.tsx`**: Tabbed forms for signing in, signing up, or switching user personas (Patient vs Admin demo).
  - **`DocSection.tsx`**: Interactive, tabbed in-app developer guide displaying the relational DB design & API schema for inspectors.
