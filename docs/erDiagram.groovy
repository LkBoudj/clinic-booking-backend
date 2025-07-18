erDiagram
  direction BT

  USERS {
    string(24) id PK "User ID"  
    string(50) first_name  "First Name"  
    string(50) last_name  "Last Name"  
    string(100) email UK "Email Address"  
    string hashed_password  "Encrypted Password"  
    enum gender "Gender: male, female"
    date date_of_birth "Date of Birth"
    string(200) address "Home Address"
    string(20) gosi_number  "In the future"
    string(15) phone UK "Phone Number"
    string(20) national_id UK "National ID"
    boolean is_email_verified "Email Verified?"
    boolean is_phone_verified "Phone Verified?"
    string status  "Status: active / deleted / suspended"
    date created_at  
    date updated_at
  }

  ROLES {
    string id PK "Unique identifier for the role"  
    string name  "Role name (e.g., patient, doctor, admin)"  
    string description  "Role description"  
  }

  USER_ROLES {
    string id PK "Link ID"  
    string user_id FK "References USERS.id"  
    string role_id FK "References ROLES.id"
  }

  PERMISSIONS {
    string id PK "Unique identifier for the permission"  
    string code UK "Unique code for the permission"  
    string name  "Permission name"  
    string description  "Permission description"  
  }

  ROLE_PERMISSIONS {
    string id PK "Role-Permission Link ID"
    string role_id FK "References ROLES.id"  
    string permission_id FK "References PERMISSIONS.id"  
  }

  USER_PERMISSIONS {
    string id PK "User-Permission Link ID"  
    string user_id FK "References USERS.id"  
    string permission_id FK "References PERMISSIONS.id"  
  }

  PATIENTS {
    string(24) id PK "Patient ID (Same as USER ID)"
    string(20) medical_record_number UK "Medical Record Number"
    string(50) insurance_provider "Insurance Provider"
    string(30) insurance_number "Insurance Policy Number"
    string blood_type "Blood Type: A+, A-, B+, B-, AB+, AB-, O+, O-"
    text medical_history "Medical History"
  }

  DOCTORS {
    string(24) id PK "Doctor ID (Same as USER ID)"
    string(50) specialty "Medical Specialty"
    string(100) license_number UK "Medical License Number"
    string(50) work_place "Primary Workplace or Clinic"
    int years_of_experience "Years of Experience"
	string(24) department_id FK
    text biography "Doctor Bio or Summary"
	string(24) department_id FK
    string(24) specialty_id FK
  }
  
  CLINICS {
        string(24) id PK
        string(100) name
        string(24) branch_id FK
        string(20) license_number "رقم ترخيص العيادة"
        bool is_active
    }

  DEPARTMENTS {
        string(24) id PK
        string(100) name
        string(24) clinic_id FK
    }
  SPECIALTIES {
        string(24) id PK
        string(80) name
    }

	APPOINTMENTS {
        string(24) id PK "Appointment ID"
        string(24) patient_id FK "Linked to PATIENT"
        string(24) doctor_id FK "Linked to DOCTOR"
        datetime scheduled_at "Date and Time of the Appointment"
        string(30) status "Appointment Status (pending, confirmed, canceled, completed)"
        text notes "Additional Notes or Reason for Visit"
        string(24) created_by FK "User who created the appointment"
        datetime created_at "Timestamp of Creation"
        datetime updated_at "Last Update Timestamp"
    }
MEDICAL_RECORDS {
        string(24) id PK "Record ID"
        string(24) patient_id FK "مُعرف المريض"
        string(24) doctor_id FK "الطبيب المسؤول"
        string(24) appointment_id FK "موعد الكشف المرتبط"
        string(24) created_by FK "من أنشأ السجل"
        date record_date "تاريخ السجل"
        text symptoms "الأعراض"
        text diagnosis "التشخيص"
        text treatment "العلاج"
        text notes "ملاحظات إضافية"
    }
      PRESCRIPTIONS {
        string(24) id PK "Prescription ID"
        string(24) patient_id FK "مُعرف المريض"
        string(24) doctor_id FK "الطبيب الموصي"
        string(24) medical_record_id FK "السجل الطبي المرتبط"
        string(24) created_by FK "من أنشأ الوصفة"
        date issue_date "تاريخ الإصدار"
        text medication_list "قائمة الأدوية (اسم، جرعة، مدة)"
        text instructions "تعليمات الاستخدام"
        text notes "ملاحظات إضافية"
    }
  
    PRESCRIPTION_ITEMS {
        string(24) id PK "رقم العنصر"
        string(24) prescription_id FK "رقم الوصفة"
        string(100) drug_name "اسم الدواء"
        string(50) dosage "الجرعة"
        string(50) frequency "عدد الجرعات في اليوم"
        string(50) duration "مدة الاستخدام"
        text notes "ملاحظات إضافية"
    }

	 AUDIT_LOGS {
    string(24) id PK
    string(24) created_by FK
    string target_table
    string target_id
    string action
    string description
    datetime created_at
  }

  NOTIFICATIONS {
    string(24) id PK
    string(24) user_id FK
    string(24) patient_id FK
    string type
    string message
    boolean is_read
    datetime sent_at
  }

  LAB_TESTS {
    string(24) id PK
    string(24) patient_id FK
    string(24) requested_by FK
    string test_type
    string notes
    datetime requested_at
    enum status ['pending', 'in_progress', 'completed']
  }

  TEST_RESULTS {
    string(24) id PK
    string(24) lab_test_id FK
    string(24) patient_id FK
    string(24) reviewed_by FK
    string result
    string notes
    datetime reviewed_at
  }

  INVOICES {
    string(24) id PK
    string(24) patient_id FK
    string(24) insurance_claim_id FK
    decimal amount
    datetime issued_at
    enum status ['unpaid', 'paid', 'pending']
  }

  PAYMENTS {
    string(24) id PK
    string(24) invoice_id FK
    string(24) patient_id FK
    string(24) user_id FK
    enum method ['cash', 'card', 'insurance']
    decimal amount
    datetime paid_at
    string transaction_ref
  }

  INSURANCE_CLAIMS {
    string(24) id PK
    string(24) patient_id FK
    string(24) doctor_id FK
    string insurance_number
    string company_name
    decimal claimed_amount
    enum status ['submitted', 'approved', 'rejected']
    datetime submitted_at
    datetime resolved_at
  }

	USERS ||--o{ USER_ROLES : "has"
	ROLES ||--o{ USER_ROLES : "assigned"
	ROLES ||--o{ ROLE_PERMISSIONS : "has"
	PERMISSIONS ||--o{ ROLE_PERMISSIONS : "grants"
	USERS ||--o{ USER_PERMISSIONS : "has"
	PERMISSIONS ||--o{ USER_PERMISSIONS : "grants"
	USERS ||--|| PATIENTS : "is"
	USERS ||--|| DOCTORS : "is"
	SPECIALTIES ||--o{ DOCTOR : "specialty"
	PATIENTS ||--o{ APPOINTMENTS : has
	DOCTORS ||--o{ APPOINTMENTS : attends
	USERS ||--o{ APPOINTMENTS : creates
		USERS ||--o{ MEDICAL_RECORDS : "created_by"
	USERS ||--o{ MEDICAL_RECORDS : "patient_id"
	DOCTORS ||--o{ MEDICAL_RECORDS : "doctor_id"
	APPOINTMENTS ||--o{ MEDICAL_RECORDS : "appointment_id"
    USERS ||--o{ PRESCRIPTIONS : "created_by"
    USERS ||--o{ PRESCRIPTIONS : "patient_id"
    DOCTORS ||--o{ PRESCRIPTIONS : "doctor_id"
    MEDICAL_RECORDS ||--o{ PRESCRIPTIONS : "medical_record_id"
	PRESCRIPTIONS ||--o{ PRESCRIPTION_ITEMS : "prescription_id"
	  USERS ||--o{ AUDIT_LOGS : created_by
  USERS ||--o{ NOTIFICATIONS : user_id
  USERS ||--o{ PAYMENTS : user_id

  PATIENTS ||--o{ LAB_TESTS : patient_id
  PATIENTS ||--o{ INVOICES : patient_id
  PATIENTS ||--o{ INSURANCE_CLAIMS : patient_id
  PATIENTS ||--o{ PAYMENTS : patient_id
  PATIENTS ||--o{ TEST_RESULTS : patient_id
  PATIENTS ||--o{ NOTIFICATIONS : patient_id

  DOCTORS ||--o{ LAB_TESTS : requested_by
  DOCTORS ||--o{ TEST_RESULTS : reviewed_by
  DOCTORS ||--o{ INSURANCE_CLAIMS : doctor_id

  LAB_TESTS ||--o{ TEST_RESULTS : lab_test_id
  INVOICES ||--o{ PAYMENTS : invoice_id
  INSURANCE_CLAIMS ||--o{ INVOICES : insurance_claim_id


