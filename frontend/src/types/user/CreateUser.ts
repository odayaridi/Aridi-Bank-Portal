// export interface CreateUser {
//   username: string;
//   email: string;
//   password: string;
//   firstName: string;
//   lastName: string;
//   dob: string;
//   phoneNumber: string;
//   country: string;
//   city: string;
// }

export interface CreateUser {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dob: string;
  phoneNumber: string;
  country: string;
  city: string;
  documentNumber?: string,
  countryFull?: string
}
