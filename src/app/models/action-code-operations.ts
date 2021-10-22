export interface ActionCodeOperations {
    actionCode?: string;
    actionId?: number;
    active?: string;
    billable?: number;
    clientId?: number;
    clientName?: string;
    externalAccountable?: number;
    internalAccountable?: number;
    statusCode?: string;
    statusId?: number;

    //ui variables
    uiBill?: boolean;
    uiInternal?: boolean;
    uiExternal?: boolean;
    uiActive?: boolean;
    configurationFlag?: boolean;
}
