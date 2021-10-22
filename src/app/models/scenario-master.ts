export interface ScenarioMaster {
    active?: string;
    clientId?: number;
    clientName?: string;
    defaultNotes?: string;
    scenarioID?: number;
    scenarioName?: string;
    callbackApplicable?:string;

    //ui variables
    uiActive?: boolean;
    configurationFlag?: boolean;
}
