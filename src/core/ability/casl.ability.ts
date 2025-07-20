import {
  AbilityBuilder,
  createMongoAbility,
  MongoAbility,
} from "@casl/ability";
import type { Actions, Subjects } from "../../config/casl.config";

export type AppAbility = MongoAbility<[Actions, Subjects]>;

export function defineAbilitiesFor(role: string, userId?: string): AppAbility {
  const { can, cannot, build } = new AbilityBuilder<AppAbility>(
    createMongoAbility
  );

  if (role === "admin") {
    can("manage", "all");
  } else {
    can("read", "Post");
    can("update", "Post", { authorId: userId });
    cannot("delete", "Post");
  }

  return build();
}
