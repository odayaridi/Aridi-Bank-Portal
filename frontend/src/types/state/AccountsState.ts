import type { AccountInfo } from "../account/AccountInfo";

export interface AccountsState {
  accounts: number[];
  selectedAccount: number | null;
  accountInfo: AccountInfo | null;
}
