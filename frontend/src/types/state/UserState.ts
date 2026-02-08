import type { UpdateUser } from "../user/UpdateUser";

export interface UserState {
  error: string | null;
  success: boolean;
  updateFormData: Partial<UpdateUser>;
}