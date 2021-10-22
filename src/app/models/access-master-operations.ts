export interface AccessMasterOperations {
  accid?: number;
  active?: string;
  clientId?: number;
  empid?: number;
  name?: string;
  pseudoName?: string;
  ntlg?: string;
  password?: string;
  role?: number;
  target?: number;

  //ui variables
  uiActive?: boolean;
  configurationFlag?: boolean;
}
