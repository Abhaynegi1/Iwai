import { SetMetadata } from "@nestjs/common";
import type { AttendeeRole, UserRole } from "@iwai/shared";

export const ROLES_KEY = "roles";
export const Roles = (...roles: (UserRole | AttendeeRole)[]) =>
  SetMetadata(ROLES_KEY, roles);
