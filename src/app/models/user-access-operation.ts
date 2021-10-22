export interface UserAccessOperation {
    clientId?: number;
    empid?: number;
    name?: string;
    ntlg?: string;
    psuedoName?: string;
    role?: number;
    prodTarget?: number;
    active?: string;
    uid?: number;
    clientName?: string;

    //ui variables
    uiActive?: boolean;
    configurationFlag?: boolean;
}
