// src/core/ability/defineAbility.ts
import {
  AbilityBuilder,
  createMongoAbility,
  MongoAbility,
} from "@casl/ability";
import { AppRole, rolePermissions } from "../../config/permissions.config";

type Action = "manage" | "create" | "read" | "update" | "delete";
type Subject = string | "all";

interface Permission {
  action: Action;
  subject: Subject;
}

export default function defineAbilityFor(roles: AppRole | AppRole[]) {
  const { can, build } = new AbilityBuilder(createMongoAbility);

  const assignedRoles = Array.isArray(roles) ? roles : [roles];

  // Grant full access if the user has "admin" role
  if (assignedRoles.includes("admin")) {
    can("manage", "all");
  } else {
    const aggregatedPermissions = new Set<string>();

    assignedRoles.forEach((role) => {
      const permissions = rolePermissions[role] || [];
      permissions.forEach(({ action, subject, options }) => {
        const key = `${action}:${subject}`;

        if (!aggregatedPermissions.has(key)) {
          can(action as Action, subject as Subject);
          aggregatedPermissions.add(key);
        }
      });
    });
  }

  return build({
    detectSubjectType: (object: any) =>
      object?.__type || object?.type || object?.constructor?.name,
  });
}
