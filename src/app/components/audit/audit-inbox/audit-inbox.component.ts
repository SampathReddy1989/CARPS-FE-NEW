import {
  Component,
  OnInit,
  Input,
  ViewChild,
  TemplateRef,
} from "@angular/core";
import {
  MatSelect,
  MatSelectionList,
  MatDialog,
  MatDialogConfig,
} from "@angular/material";
import { AppComponent } from "src/app/app.component";
import { AuditInboxOperations } from "src/app/models/audit-inbox-ops";
import { AgingWiseSummaryInfo } from "src/app/models/agentwise-info";
import { UiCacheStore } from "src/app/models/ui-cache-store";
import { FileInfo } from "src/app/models/file-info";
import { StatusWiseInfo } from "src/app/models/statuswise-info";
import { DialogService } from "src/app/services/dialog/dialog.service";
import { DbFileNameAliasNameHolder } from "src/app/models/dbfieldname-alias-name-holder";
import { AuditInboxService } from "src/app/services/audit/audit-inbox/audit-inbox.service";

@Component({
  selector: "app-audit-inbox",
  templateUrl: "./audit-inbox.component.html",
  styleUrls: ["./audit-inbox.component.scss"],
  providers: [AuditInboxService],
})
export class AuditInboxComponent implements OnInit {
  @Input() name: string;
  @ViewChild("fields", null) fieldMatSelectionList: MatSelectionList;
  @ViewChild("sortOrderBy", null) sortOrderBy: MatSelect;
  @ViewChild("criteriaDialog", null) criteriaDialog: TemplateRef<any>;

  statusSummaryData: any;
  agingSummaryData: any;
  tableData: any;

  clientId: number;
  fileList: FileInfo[] = [];
  sortFieldList: DbFileNameAliasNameHolder[] = [];
  fieldList: DbFileNameAliasNameHolder[] = [];

  fieldValAppended: string = "";
  uiFieldCriteriaMap: Map<string, string> = new Map();
  selFileInfo: FileInfo;
  selDbFieldHolder: DbFileNameAliasNameHolder;
  selDbFieldSortHolder: DbFileNameAliasNameHolder;
  apiFieldValues: string[];

  agingWiseSummaryInfo: AgingWiseSummaryInfo;
  cache = false;
  pageSize: any;
  pageIndex: any;

  constructor(
    private http: AuditInboxService,
    private dialog: MatDialog,
    private dialogService: DialogService
  ) {}

  ngOnInit() {
    this.clientId = AppComponent.getCurrentClient().clientId;
    this.loadCache();
    this.getFileList();
    this.getAllFieldList();
  }

  onReloadRequest(data: any) {
    this.clientId = AppComponent.getCurrentClient().clientId;
    this.loadCache();
    this.getFileList();
    this.getAllFieldList();
  }

  private loadCache() {
    if (this.cache) {
      this.selFileInfo = UiCacheStore.fromCache(this.name.trim() + "FileInfo");
      let uiMap = UiCacheStore.fromCache(
        this.name.trim() + "uiFieldCriteriaMap"
      );
      if (uiMap) {
        this.uiFieldCriteriaMap = new Map(JSON.parse(uiMap));
        if (!this.uiFieldCriteriaMap) {
          this.uiFieldCriteriaMap = new Map();
        }
      }
      this.evalAgent(this.createAgent(null));
      this.loadSummary();
    } else {
      this.evalAgent(this.createAgent(null));
      this.loadSummary();
    }
  }

  loadSummary() {
    if (this.selFileInfo) {
      this.getAgingSummary(this.selFileInfo.impid);
      this.getStatusSummary(this.selFileInfo.impid);
    } else {
      this.getAgingSummary("-1"); //if -1 is not sent, The pie chart is not loading
      this.getStatusSummary("-1"); //if -1 is not sent, The pie chart is not loading
    }
  }

  private getAgingSummary(impid: string) {
    if (impid) {
      this.http
        .getAgingSummaryClient(AppComponent.getCurrentClient().clientId, impid)
        .subscribe(
          (data: AgingWiseSummaryInfo[]) => {
            this.agingSummaryData = data;
          },
          (error) => {
            this.dialogService.openErrorModal("Error receiving Aging summary");
          }
        );
    }
  }

  private getStatusSummary(impid: string) {
    if (impid) {
      this.http
        .getStatusSummaryClient(AppComponent.getCurrentClient().clientId, impid)
        .subscribe(
          (data: StatusWiseInfo[]) => {
            this.statusSummaryData = data;
          },
          (error) => {
            this.dialogService.openErrorModal("Error receiving Status summary");
          }
        );
    }
  }

  private createAgent(itemText: string) {
    const agent: AuditInboxOperations = new Object();
    agent.clientid = AppComponent.getCurrentClient().clientId;
    agent.currUser = AppComponent.getCurrentUser().ntlg;
    agent.pageIndex = 1;
    agent.pageSize = 7;

    if (this.selFileInfo) {
      agent.impid = this.selFileInfo.impid;
    }
    if (itemText) agent.itemText = itemText;
    return agent;
  }

  onpaginationLogic(event){
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  private evalAgent(agent: AuditInboxOperations) {
    
    let counter = 0;
    let sortValueAppended: string = "";
    this.uiFieldCriteriaMap.forEach((val, key) => {
      if (!key.includes("SORT")) {
        agent[key] = val;
      }
      if (key.includes("SORT")) {
        if (counter > 0) {
          sortValueAppended = sortValueAppended.concat(",");
        }
        sortValueAppended = sortValueAppended.concat(val);
        ++counter;
      }
    });
    agent.sortBy = sortValueAppended;
    this.http
      .getAccountAvailableForAllocationScreen(agent)
      .subscribe((data) => {
        if (data) {
          if (data.length > 1) {
            this.tableData = data;
            console.log(data);
            
          } else {
            this.tableData = [];
            console.log(data);
          }
        } else {
          console.log("Error occurred while fetching accounts", data);
        }
      });
  }

  private getFileList() {
    this.http
      .getFileList(AppComponent.getCurrentClient().clientId)
      .subscribe((data: FileInfo[]) => {
        this.fileList = data;
      });
  }

  private getAllFieldList() {
    this.http
      .getDbFilterList(AppComponent.getCurrentClient().clientId)
      .subscribe((data: DbFileNameAliasNameHolder[]) => {
        this.fieldList = data;
      });
    this.http
      .getSortFieldForClient(AppComponent.getCurrentClient().clientId)
      .subscribe((data: DbFileNameAliasNameHolder[]) => {
        this.sortFieldList = data;
      });
  }

  onStatusSummaryChange(data: any) {
    this.statusSummaryData = data;
  }

  onAgingSummaryChange(data: any) {
    this.agingSummaryData = data;
  }

  showCriteriaDialog(event) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    this.dialog.closeAll();
    this.dialog.open(this.criteriaDialog, dialogConfig);
  }

  removeFilter(key: string) {
    if (this.uiFieldCriteriaMap.has(key)) {
      this.uiFieldCriteriaMap.delete(key);
    }
    this.evalAgent(this.createAgent(this.selDbFieldHolder.dbFieldName));

    if (this.cache) {
      UiCacheStore.toCache(
        this.name.trim() + "uiFieldCriteriaMap",
        JSON.stringify(Array.from(this.uiFieldCriteriaMap.entries()))
      );
    }
  }

  getUiFilterMapValue(key: string, val: string): string {
    if (key.includes("SORT")) {
      return key.substring(4);
    }
    return (
      this.fieldList.find((x) => x.dbFieldName === key).aliasName + " : " + val
    );
  }

  getSelectedFileInfo(): string {
    if (this.selFileInfo) return this.selFileInfo.impid;
  }

  onFileChange(event) {
    this.selFileInfo = this.fileList.find((x) => x.impid === event.value);
    if (this.selFileInfo) {
      if (this.cache) {
        UiCacheStore.toCache(this.name.trim() + "FileInfo", this.selFileInfo);
      }
      this.clearCustomSearch();
      this.loadSummary();
      this.getFileList();
      this.getAllFieldList();
      this.evalAgent(this.createAgent(null));
    }
  }

  clearCustomSearch() {
    this.selDbFieldHolder = null;
    this.fieldList = null;
    this.sortFieldList = null;
    this.apiFieldValues = null;
  }

  clearCustomSearchUI(stepper) {
    stepper.reset();
    if (this.fieldValAppended) {
      this.fieldValAppended = null;
    }
  }

  resetCustomSearch($event, stepper) {
    stepper.reset();
    if (this.fieldMatSelectionList) {
      this.fieldMatSelectionList.deselectAll();
    }

    this.evalAgent(this.createAgent(this.selDbFieldHolder.dbFieldName));
  }

  resetStepper2($event, stepper2) {
    stepper2.reset();
    if (this.sortOrderBy.selected) {
      this.sortOrderBy.value = null;
    }
    this.evalAgent(this.createAgent(this.selDbFieldHolder.dbFieldName));
  }

  getSelectedFieldAliasName(): string {
    if (this.selDbFieldHolder) {
      return " : " + this.selDbFieldHolder.aliasName;
    }
  }

  onFieldSelectAll(event) {
    this.fieldMatSelectionList.selectAll();
  }

  onFieldChange(event) {
    this.selDbFieldHolder = event.value;
    this.http
      .getCustomSearchDropdownValueList(
        this.createAgent(this.selDbFieldHolder.dbFieldName)
      )
      .subscribe((data) => {
        if (data) {
          this.apiFieldValues = data;
          this.apiFieldValues.splice(0, 1);
        }
      });
  }

  onFieldAdd(event, stepper) {
    if (
      !this.isShowFieldInput() &&
      this.fieldMatSelectionList.selectedOptions.selected &&
      this.fieldMatSelectionList.selectedOptions.selected.length > 0
    ) {
      let counter = 0;
      this.fieldValAppended = "";
      this.fieldMatSelectionList.selectedOptions.selected.forEach((item) => {
        ++counter;
        this.fieldValAppended = this.fieldValAppended.concat(item.value);
        if (
          this.fieldMatSelectionList.selectedOptions.selected.length !== counter
        ) {
          this.fieldValAppended = this.fieldValAppended.concat("|");
        }
      });
    }

    if (this.fieldValAppended && this.fieldValAppended != "") {
      this.uiFieldCriteriaMap.set(
        this.selDbFieldHolder.dbFieldName,
        this.fieldValAppended
      );
    }

    this.clearCustomSearchUI(stepper);
    this.evalAgent(this.createAgent(this.selDbFieldHolder.dbFieldName));
    this.fieldValAppended = "";

    if (this.cache) {
      UiCacheStore.toCache(
        this.name.trim() + "uiFieldCriteriaMap",
        JSON.stringify(Array.from(this.uiFieldCriteriaMap.entries()))
      );
    }
  }

  isShowFieldInput(): boolean {
    if (this.selDbFieldHolder) {
      if (
        this.selDbFieldHolder.dbFieldName === "receivedDate" ||
        this.selDbFieldHolder.dbFieldName === "payer" ||
        this.selDbFieldHolder.dbFieldName === "provider1" ||
        this.selDbFieldHolder.dbFieldName === "provider2" ||
        this.selDbFieldHolder.dbFieldName === "payerID" ||
        this.selDbFieldHolder.dbFieldName === "payerGroup" ||
        this.selDbFieldHolder.dbFieldName === "Scenario" ||
        this.selDbFieldHolder.dbFieldName === "StatusCode" ||
        this.selDbFieldHolder.dbFieldName === "ActionCode" ||
        this.selDbFieldHolder.dbFieldName === "Auditor" ||
        this.selDbFieldHolder.dbFieldName === "allottedAgentlist"
      )
        return false;
    }
    return true;
  }

  isDateField() {
    if (this.isShowFieldInput() && this.selDbFieldHolder) {
      if (
        this.selDbFieldHolder.dbFieldName === "dOS" ||
        this.selDbFieldHolder.dbFieldName === "dOB"
      ) {
        return true;
      }
    }
    return false;
  }

  getSelectedSortAliasName(): string {
    if (this.selDbFieldSortHolder) {
      return " : " + this.selDbFieldSortHolder.aliasName;
    }
  }

  onFieldSortChange(event) {
    this.selDbFieldSortHolder = event.value;
  }

  onSortAdd(event, stepper) {
    if (
      this.sortOrderBy.value === undefined ||
      this.sortOrderBy.value === null
    ) {
      this.dialogService.openErrorModal("Select a sorting order for a field");
      return;
    }

    this.uiFieldCriteriaMap.set(
      "SORT" +
        this.selDbFieldSortHolder.aliasName +
        " : " +
        this.sortOrderBy.value,
      this.selDbFieldSortHolder.dbFieldName + " " + this.sortOrderBy.value
    );

    this.clearCustomSearchUI(stepper);
    this.evalAgent(this.createAgent(this.selDbFieldSortHolder.dbFieldName));

    if (this.cache) {
      UiCacheStore.toCache(
        this.name.trim() + "uiFieldCriteriaMap",
        JSON.stringify(Array.from(this.uiFieldCriteriaMap.entries()))
      );
    }
  }

  onConditionChange(event) {}

  onValueChange(event) {}

  onSelect(data): void {}

  onActivate(data): void {}

  onDeactivate(data): void {}

  formatDataLabel(value) {
    return value + "";
  }
}
