export interface AgentInboxOperations {
  account?: string;
  accountCount?: string;
  adjustmentAmount?: number;
  agentlist?: string;
  allowedAmount?: number;
  billedAmount?: number;
  claim?: string;
  claimNotes?: string;
  clientid?: number;
  coinsurance?: number;
  copay?: number;
  currUser?: string;
  deductible?: number;
  diagnosisCode?: string;
  dob?: string;
  dos?: string;
  encounter?: string;
  fieldDate1To?: string;
  fieldDate1from?: string;
  fieldDate2From?: string;
  fieldDate2To?: string;
  fieldDate3From?: string;
  fieldDate3To?: string;
  fieldDate4From?: string;
  fieldDate4To?: string;
  fieldInt1?: number;
  fieldInt2?: number;
  fieldInt3?: number;
  fieldInt4?: number;
  fieldInt5?: number;
  fieldVchar1?: string;
  fieldVchar2?: string;
  fieldVchar3?: string;
  fieldVchar4?: string;
  fieldVchar5?: string;
  fupDateFrom?: string;
  fupDateTo?: string;
  impid?: string;
  inheritanceFlag?: number;
  insuranceBalance?: number;
  itemText?: string;
  mRN?: string;
  modifier?: string;
  opid?: number;
  paidAmount?: number;
  patientBalance?: number;
  patientFirstName?: string;
  patientLastName?: string;
  pageIndex?:number;
  pageSize?:number;
  payer?: string;
  payerGroup?: string;
  payerID?: string;
  procedureCode?: string;
  provider1?: string;
  provider2?: string;
  receivedDate?: string;
  rowid?: string;
  sortBy?: string;
  totalBalance?: number;
}
