import z from "zod";
import {
  connectToDatabase,
  disconnectFromDatabase,
} from "../../config/db.config";
import PermissionModel, {
  IPermission,
} from "../../modules/auth/models/permission.model";
import RoleModel from "../../modules/auth/models/role.model";

export const rolesData = [
  "admin",
  "doctor",
  "patient",
  "receptionist",
  "pharmacist",
  "lab_technician",
  "accountant",
  "support",
  "intern",
  "moderator",
  "viewer",
] as const;

const actions = ["create", "update", "delete", "read"];

const subjects = [
  "User", // إدارة المستخدمين
  "Doctor", // ملف الطبيب وصلاحياته
  "Patient", // بيانات المرضى
  "Admin", // مدراء النظام
  "Moderator", // مشرفو النظام
  "Viewer", // حسابات العرض فقط
  "Bot", // كيانات الأتمتة، إن كانت تتطلب إذنًا
  "Role", // إدارة الأدوار
  "Permission", // ربط الأدوار بالصلاحيات
  "Clinic", // إدارة بيانات العيادات
  "Specialty", // تخصصات الأطباء
  "Appointment", // إدارة المواعيد
  "WorkingHours", // جدول عمل الأطباء
  "Payment", // الفواتير والمدفوعات
  "MedicalRecord", // السجلات الطبية (حساسة وتتطلب حماية)
  "Prescription", // الوصفات الطبية (مرتبطة بالأطباء)
  "Notification", // إرسال التنبيهات للجهات المختلفة
  "Conversation", // الوصول لمحادثات الدعم أو المرضى
  "Log", // سجل الأنشطة
  "Analytics", // تقارير وتحليلات الأداء
  "Settings", // إعدادات النظام العامة
  "Company", // الشركات المرتبطة (تأمين مثلاً)
] as const;

const permissionsData: Pick<IPermission, "action" | "subject">[] = [
  { action: "manage", subject: "all" },
];
actions.map((action) => {
  subjects.forEach((subject) => {
    permissionsData.push({
      action,
      subject,
    });
  });
});

interface IActionSubject {
  action: string;
  subject: string;
}
const rolePermissions: Record<string, IActionSubject[]> = {
  admin: [{ action: "manage", subject: "all" }],

  moderator: [
    { action: "read", subject: "User" },
    { action: "read", subject: "Doctor" },
    { action: "read", subject: "Patient" },
    { action: "read", subject: "MedicalRecord" },
    { action: "read", subject: "Prescription" },
    { action: "read", subject: "Appointment" },
    { action: "delete", subject: "User" },
    { action: "update", subject: "User" },
    { action: "update", subject: "Patient" },
    { action: "delete", subject: "Patient" },
  ],

  doctor: [
    { action: "read", subject: "Patient" },
    { action: "read", subject: "Appointment" },
    { action: "create", subject: "MedicalRecord" },
    { action: "update", subject: "MedicalRecord" },
    { action: "read", subject: "MedicalRecord" },
    { action: "create", subject: "Prescription" },
    { action: "read", subject: "Prescription" },
    { action: "read", subject: "Notification" },
  ],

  receptionist: [
    { action: "create", subject: "Appointment" },
    { action: "update", subject: "Appointment" },
    { action: "delete", subject: "Appointment" },
    { action: "read", subject: "Patient" },
    { action: "read", subject: "Doctor" },
    { action: "read", subject: "Appointment" },
  ],

  patient: [
    { action: "create", subject: "Appointment" },
    { action: "read", subject: "Patient" },
    { action: "update", subject: "Patient" },
    { action: "read", subject: "Appointment" },
    { action: "read", subject: "MedicalRecord" },
    { action: "read", subject: "Prescription" },
    { action: "read", subject: "Notification" },
    { action: "read", subject: "Doctor" },
    { action: "read", subject: "Settings" },
  ],
};

export const getRolePermission = (name: string) => {
  return rolePermissions[name];
};
const roles = rolesData.map((name) => ({
  name,
}));
const seedRolePermissions = async () => {
  try {
    await connectToDatabase();
    // const permissionDocs = await PermissionModel.insertMany(permissionsData);
    const roleDocs = await RoleModel.insertMany(roles);
    console.log("✅ Permissions seeded successfully:", roleDocs.length);
    // console.log(roles);
  } catch (e) {
    console.error("❌ Error while seeding permissions:", e);
  } finally {
    await disconnectFromDatabase();
    process.exit();
  }
};
