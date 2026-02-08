export interface UpdateUser {
  username: string;    
  newUsername?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  password?:string;
  country?: string;
  city?: string;
}
