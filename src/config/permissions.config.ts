// src/config/permissions.config.ts

// أنواع الأدوار المعتمدة في النظام
export type AppRole =
  | "admin"
  | "doctor"
  | "patient"
  | "receptionist"
  | "pharmacist"
  | "lab_technician"
  | "accountant"
  | "support"
  | "intern"
  | "moderator"
  | "viewer";

// أنواع الإجراءات التي يمكن تنفيذها
export type AppAction = "manage" | "create" | "read" | "update" | "delete";

// الكيانات التي يمكن التحكم بها في النظام
export type AppSubject =
  | "User"
  | "Doctor"
  | "Patient"
  | "Admin"
  | "Moderator"
  | "Viewer"
  | "Bot"
  | "Role"
  | "Permission"
  | "Clinic"
  | "Specialty"
  | "Appointment"
  | "WorkingHours"
  | "Payment"
  | "MedicalRecord"
  | "Prescription"
  | "Notification"
  | "Conversation"
  | "Log"
  | "Analytics"
  | "Settings"
  | "Company"
  | "all";

interface IActionSubject {
  action: string;
  subject: string;
  options?: any;
}
const per = (
  action: AppAction,
  subject: AppSubject,
  options?: any
): IActionSubject => ({
  action,
  subject,
  options,
});

export const rolePermissions: Record<AppRole, IActionSubject[]> = {
  admin: [per("manage", "all")],

  moderator: [
    per("read", "User"),
    per("update", "User"),
    per("delete", "User"),
    per("read", "Doctor"),
    per("read", "Patient"),
    per("read", "MedicalRecord"),
    per("read", "Prescription"),
    per("read", "Appointment"),
    per("update", "Patient"),
    per("delete", "Patient"),
  ],

  doctor: [
    per("read", "Patient", { id: true }),
    per("read", "Appointment"),
    per("create", "MedicalRecord"),
    per("update", "MedicalRecord"),
    per("read", "MedicalRecord"),
    per("create", "Prescription"),
    per("read", "Prescription"),
    per("read", "Notification"),
  ],

  receptionist: [
    per("create", "Appointment"),
    per("update", "Appointment"),
    per("delete", "Appointment"),
    per("read", "Patient"),
    per("read", "Doctor"),
    per("read", "Appointment"),
  ],

  patient: [
    per("create", "Appointment"),
    per("read", "Patient"),
    per("update", "Patient"),
    per("read", "Appointment"),
    per("read", "MedicalRecord"),
    per("read", "Prescription"),
    per("read", "Notification"),
    per("read", "Doctor"),
    per("read", "Settings"),
  ],

  pharmacist: [], // يمكن تحديثه لاحقًا حسب الصلاحيات المطلوبة
  lab_technician: [],
  accountant: [],
  support: [],
  intern: [],
  viewer: [],
};
