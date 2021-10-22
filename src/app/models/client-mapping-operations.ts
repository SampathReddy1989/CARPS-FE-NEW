export interface ClientMappingOperations {
    aliasName?: string;
    clientId?: number;
    clientName?: string;
    dBFieldName?: string;
    duplicateField?: number;
    filterField?: number;
    mandatoryField?: number;
    ordinalPosition?: string;
    rowId?: number;
    sortField?: number;

    // ui variabled
    uiMandatory?:boolean;
    uiDuplicate?: boolean;
    uiFilter?: boolean;
    uiSort?: boolean;
    uiFlag?: boolean;
}
