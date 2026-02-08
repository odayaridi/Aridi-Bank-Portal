// export interface CreateTransaction {
//   senderAccountNb: number;
//   receiverAccountNb: number;
//   amount: number;
//   message?: string;
// }

export interface CreateTransaction {
  senderAccountNb: number;
  receiverAccountNb: number;
  amount: number;
  message?: string;
  documentNumber?: string,
  countryFull?: string
}
