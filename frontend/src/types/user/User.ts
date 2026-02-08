export interface User {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  dob: string;
  phoneNumber: string;
  country: string;
  city: string;
  roleName: 'Admin' | 'User';
}
