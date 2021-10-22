import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
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
import { AuditAllocation } from "src/app/models/audit-allocation";
import { AgingWiseSummaryInfo } from "src/app/models/agentwise-info";
import { DbFileNameAliasNameHolder } from "src/app/models/dbfieldname-alias-name-holder";
import { FileInfo } from "src/app/models/file-info";
import { StatusWiseInfo } from "src/app/models/statuswise-info";
import { UiCacheStore } from "src/app/models/ui-cache-store";
import { AuditAllocationService } from "src/app/services/audit/audit-allocation.service";
import { DialogService } from "src/app/services/dialog/dialog.service";
import { Subject } from "rxjs";

@Component({
  selector: "app-audit-template-details",
  templateUrl: "./audit-template-details.component.html",
  styleUrls: ["./audit-template-details.component.scss"],
})
export class AuditTemplateDetailsComponent implements OnInit {
  @Input() name: string;
  @Input() refreshAADataSubject: Subject<boolean> = new Subject<boolean>();
  @Output() agentData = new EventEmitter<any>();
  @Output() tabledata = new EventEmitter<any>();
  @ViewChild("fields", null) fieldMatSelectionList: MatSelectionList;
  @ViewChild("sortOrderBy", null) sortOrderBy: MatSelect;
  @ViewChild("criteriaDialog", null) criteriaDialog: TemplateRef<any>;

  clientId: number;
  fileList: FileInfo[] = [];
  sortFieldList: DbFileNameAliasNameHolder[] = [];
  fieldList: DbFileNameAliasNameHolder[] = [];

  fieldValAppended: string = "";
  uiFieldCriteriaMap: Map<string, string> = new Map();
  selFileInfo: FileInfo;
  selDbFieldHolderaudit: DbFileNameAliasNameHolder;
  selDbFieldSortHolder: DbFileNameAliasNameHolder;
  apiFieldValues: string[];
  //chart data
  pieData = [];
  // options
  pieView: any[] = [350, 250];
  legendTitle: string = "";
  legendPosition: string = "below";
  pieColorScheme = {
    domain: ["#0d47a1", "#1565c0", "#1e88e5", "#82b1ff", "#ffc107"],
  };
  hbData = [];

  agingWiseSummaryInfo: AgingWiseSummaryInfo;

  constructor(
    private AuditAllocationService: AuditAllocationService,
    private dialog: MatDialog,
    private dialogService: DialogService
  ) {}

  ngOnInit() {
    //   this.refreshAADataSubject.subscribe((response) => {
    //     if (response) {
    //       this.loadComponentData();
    //     }
    //   });
    //   this.loadComponentData();
    // }

    // loadComponentData() {
    //   this.clientId = AppComponent.getCurrentClient().clientId;
    //   this.loadCache();
    //   this.getFileList();
    //   this.getAllFieldList();
    // }

    // showCriteriaDialog(event) {
    //   const dialogConfig = new MatDialogConfig();
    //   dialogConfig.autoFocus = true;
    //   this.dialog.closeAll();
    //   this.dialog.open(this.criteriaDialog, dialogConfig);
    // }
    this.refreshAADataSubject.subscribe((response) => {
      if (response) {
        this.refreshComponent();
      }
    });
    this.loadComponentData();
  }

  loadComponentData() {
    this.clientId = AppComponent.getCurrentClient().clientId;
    this.loadCache();
    this.getFileList();
    this.getAllFieldList();
  }

  refreshComponent() {
    if (this.selFileInfo) {
      this.loadAccounts();
      this.getAgingSummary(this.selFileInfo.impid);
      this.getStatusSummary(this.selFileInfo.impid);
    } else {
      this.loadAccounts();
      this.getAgingSummary("-1"); //if -1 is not sent, The pie chart is not loading
      this.getStatusSummary("-1"); //if -1 is not sent, The pie chart is not loading
    }
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
    if (this.selDbFieldHolderaudit && this.selDbFieldHolderaudit.dbFieldName) {
      this.evalAgent(this.createAudit(this.selDbFieldHolderaudit.dbFieldName));
    }
    // this.evalAgent(this.createAudit(this.selDbFieldHolderaudit.dbFieldName));
    // UiCacheStore.toCache(
    //   this.name.trim() + "uiFieldCriteriaMap",
    //   JSON.stringify(Array.from(this.uiFieldCriteriaMap.entries()))
    // );
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
    this.uiFieldCriteriaMap.clear();
    this.selFileInfo = this.fileList.find((x) => x.impid === event.value);
    if (this.selFileInfo) {
      this.evalAgent(this.createAudit(null));
      this.getAgingSummary(this.selFileInfo.impid);
      this.getStatusSummary(this.selFileInfo.impid);
      this.clearCustomSearch();
      this.getFileList();
      this.getAllFieldList();
      this.loadAccounts();
    }
    // this.selFileInfo = this.fileList.find((x) => x.impid === event.value);
    // if (this.selFileInfo) {
    //   UiCacheStore.toCache(this.name.trim() + "FileInfo", this.selFileInfo);
    //   this.getAgingSummary(this.selFileInfo.impid);
    //   this.getStatusSummary(this.selFileInfo.impid);
    //   this.clearCustomSearch();
    //   this.getFileList();
    //   this.getAllFieldList();
    //   this.loadAccounts(this.selFileInfo.impid);
    // }
  }

  clearCustomSearch() {
    this.selDbFieldHolderaudit = null;
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

    this.evalAgent(this.createAudit(this.selDbFieldHolderaudit.dbFieldName));
  }

  resetStepper2($event, stepper2) {
    stepper2.reset();
    if (this.sortOrderBy.selected) {
      this.sortOrderBy.value = null;
    }
    this.evalAgent(this.createAudit(this.selDbFieldHolderaudit.dbFieldName));
  }
  getSelectedFieldAliasName(): string {
    if (this.selDbFieldHolderaudit) {
      return " : " + this.selDbFieldHolderaudit.aliasName;
    }
  }

  onFieldSelectAll(event) {
    this.fieldMatSelectionList.selectAll();
  }

  onFieldChange(event) {
    this.selDbFieldHolderaudit = event.value;
    this.AuditAllocationService.postCustomSearchDropdownList(
      this.createAudit(this.selDbFieldHolderaudit.dbFieldName)
    ).subscribe((data) => {
      console.log(data, 56789);
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
      // if (!this.isShowFieldInput()) {
      //   let counter = 0;
      //   this.fieldValAppended = "";
      //   this.fieldMatSelectionList.selectedOptions.selected.forEach((item) => {
      //     ++counter;
      //     this.fieldValAppended = this.fieldValAppended.concat(item.value);
      //     if (
      //       this.fieldMatSelectionList.selectedOptions.selected.length !== counter
      //     ) {
      //       this.fieldValAppended = this.fieldValAppended.concat("|");
      //     }
      //   });
    }
    if (this.fieldValAppended && this.fieldValAppended != "") {
      this.uiFieldCriteriaMap.set(
        this.selDbFieldHolderaudit.dbFieldName,
        this.fieldValAppended
      );
    }
    this.clearCustomSearchUI(stepper);
    this.evalAgent(this.createAudit(this.selDbFieldHolderaudit.dbFieldName));
    this.fieldValAppended = "";
    // this.uiFieldCriteriaMap.set(
    //   this.selDbFieldHolderaudit.dbFieldName,
    //   this.fieldValAppended
    // );
    // this.evalAgent(this.createAudit(this.selDbFieldHolderaudit.dbFieldName));
    // this.fieldValAppended = "";
    // UiCacheStore.toCache(
    //   this.name.trim() + "uiFieldCriteriaMap",
    //   JSON.stringify(Array.from(this.uiFieldCriteriaMap.entries()))
    // );
  }

  isShowFieldInput(): boolean {
    if (this.selDbFieldHolderaudit) {
      if (
        this.selDbFieldHolderaudit.dbFieldName === "receivedDate" ||
        this.selDbFieldHolderaudit.dbFieldName === "payer" ||
        this.selDbFieldHolderaudit.dbFieldName === "provider1" ||
        this.selDbFieldHolderaudit.dbFieldName === "provider2" ||
        this.selDbFieldHolderaudit.dbFieldName === "payerID" ||
        this.selDbFieldHolderaudit.dbFieldName === "payerGroup" ||
        this.selDbFieldHolderaudit.dbFieldName === "Scenario" ||
        this.selDbFieldHolderaudit.dbFieldName === "StatusCode" ||
        this.selDbFieldHolderaudit.dbFieldName === "ActionCode" ||
        this.selDbFieldHolderaudit.dbFieldName === "allottedAgentlist"
      )
        return false;
    }
    return true;
  }
  isDateField() {
    if (this.isShowFieldInput() && this.selDbFieldHolderaudit) {
      if (
        this.selDbFieldHolderaudit.dbFieldName === "dOS" ||
        this.selDbFieldHolderaudit.dbFieldName === "dOB"
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
      this.dialogService.openErrorModal("Sort field is required");
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
    this.evalAgent(this.createAudit(this.selDbFieldSortHolder.dbFieldName));
    // if (this.sortOrderBy.value === undefined || this.sortOrderBy.value === null)
    //   this.dialogService.openErrorModal(
    //     "Select a sorting order by for a field"
    //   );

    // this.uiFieldCriteriaMap.set(
    //   "SORT" +
    //     this.selDbFieldSortHolder.aliasName +
    //     " : " +
    //     this.sortOrderBy.value,
    //   this.selDbFieldSortHolder.dbFieldName + " " + this.sortOrderBy.value
    // );
    // this.evalAgent(this.createAudit(this.selDbFieldSortHolder.dbFieldName));
    // UiCacheStore.toCache(
    //   this.name.trim() + "uiFieldCriteriaMap",
    //   JSON.stringify(Array.from(this.uiFieldCriteriaMap.entries()))
    // );
  }

  onConditionChange(event) {}

  onValueChange(event) {}

  onSelect(data): void {}

  onActivate(data): void {}

  onDeactivate(data): void {}

  formatDataLabel(value) {
    return value + "";
  }

  private getFileList() {
    this.AuditAllocationService.getFileList(
      AppComponent.getCurrentClient().clientId
    ).subscribe((data: FileInfo[]) => {
      this.fileList = data;
    });
  }

  private getAllFieldList() {
    this.AuditAllocationService.getDbFilterList(
      AppComponent.getCurrentClient().clientId
    ).subscribe((data: DbFileNameAliasNameHolder[]) => {
      this.fieldList = data;
    });
    this.AuditAllocationService.getSortFieldForClient(
      AppComponent.getCurrentClient().clientId
    ).subscribe((data: DbFileNameAliasNameHolder[]) => {
      this.sortFieldList = data;
    });
  }

  private getAgingSummary(impid: string) {
    if (impid) {
      this.AuditAllocationService.getAgingSummaryClient(
        AppComponent.getCurrentClient().clientId,
        impid
      ).subscribe(
        (data: AgingWiseSummaryInfo[]) => {
          console.log(1356565825);
          this.evalAgingSummary(data);
        },
        (error) => {
          this.dialogService.openErrorModal("Error receiving Aging summary");
        }
      );
    }
  }

  private getStatusSummary(impid: string) {
    if (impid) {
      this.AuditAllocationService.getStatusSummaryClient(
        AppComponent.getCurrentClient().clientId,
        impid
      ).subscribe(
        (data: StatusWiseInfo[]) => {
          this.evalStatusSummary(data);
        },
        (error) => {
          this.dialogService.openErrorModal("Error receiving Status summary");
        }
      );
    }
  }

  private loadCache() {
    if (this.selFileInfo) {
      this.loadAccounts();
      this.getAgingSummary(this.selFileInfo.impid);
      this.getStatusSummary(this.selFileInfo.impid);
    } else {
      this.loadAccounts();
      this.getAgingSummary("-1"); //if -1 is not sent, The pie chart is not loading
      this.getStatusSummary("-1"); //if -1 is not sent, The pie chart is not loading
    }
  }
  // this.selFileInfo = UiCacheStore.fromCache(this.name.trim() + "FileInfo");
  // if (this.selFileInfo) {
  //   this.getAgingSummary(this.selFileInfo.impid);
  //   this.getStatusSummary(this.selFileInfo.impid);
  // }

  // let uiMap = UiCacheStore.fromCache(this.name.trim() + "uiFieldCriteriaMap");
  // if (uiMap) {
  //   this.uiFieldCriteriaMap = new Map(JSON.parse(uiMap));
  //   if (!this.uiFieldCriteriaMap) {
  //     this.uiFieldCriteriaMap = new Map();
  //   } else {
  //     this.evalAgent(this.createAudit(null));
  //   }
  // }

  // let agentAssignData: AuditAllocation = UiCacheStore.fromCache(
  //   this.name.trim()
  // );

  // if (agentAssignData) {
  //   delete agentAssignData.auditorList;
  //   delete agentAssignData.accountCount;
  //   this.AuditAllocationService.postAccountAllocationUser(
  //     agentAssignData
  //   ).subscribe((data) => {
  //     if (data) {
  //       this.tabledata.emit(data);
  //     }
  //   });
  // } else {
  //   if (this.selFileInfo) {
  //     this.loadAccounts(this.selFileInfo.impid);
  //     this.getAgingSummary(this.selFileInfo.impid);
  //     this.getStatusSummary(this.selFileInfo.impid);
  //   } else {
  //     this.loadAccounts(null);
  //     this.getAgingSummary("-1"); //if -1 is not sent, The pie chart is not loading
  //     this.getStatusSummary("-1"); //if -1 is not sent, The pie chart is not loading
  //   }
  // }

  loadAccounts() {
    this.evalAgent(this.createAudit(null));
  }
  // loadAccounts(impid) {
  //   let data = {
  //     impid: impid,
  //     clientid: AppComponent.getCurrentClient().clientId,
  //     currUser: AppComponent.getCurrentUser().ntlg,
  //   };
  //   if (!data.impid) {
  //     delete data.impid;
  //   }
  //   this.AuditAllocationService.postAccountAllocationUser(data).subscribe(
  //     (data) => {
  //       if (data) {
  //         this.tabledata.emit(data);
  //       }
  //     }
  //   );
  // }

  private evalAgingSummary(data: AgingWiseSummaryInfo[]) {
    if (data) {
      let aging: AgingWiseSummaryInfo = data.pop();
      this.pieData = [
        {
          name: "0-30",
          value: Number(aging.info0to30 !== undefined ? aging.info0to30 : 0),
        },
        {
          name: "31-60",
          value: Number(aging.info31to60 !== undefined ? aging.info31to60 : 0),
        },
        {
          name: "61-90",
          value: Number(aging.info61to90 !== undefined ? aging.info61to90 : 0),
        },
        {
          name: "91-120",
          value: Number(
            aging.info91to120 !== undefined ? aging.info91to120 : 0
          ),
        },
        {
          name: "> 120",
          value: Number(
            aging.infoAbove120 !== undefined ? aging.infoAbove120 : 0
          ),
        },
      ];
    }
  }

  private evalStatusSummary(data: StatusWiseInfo[]) {
    if (data) {
      this.hbData = [];
      data.forEach((obj) => {
        let currCss: string = "";
        switch (obj.wfstatus) {
          case "Allotted":
            currCss = "bg-success";
            break;

          case "Callback":
            currCss = "bg-warning";
            break;

          case "Rework":
            currCss = "bg-danger";
            break;

          case "Reported":
            currCss = "bg-secondary";
            break;
        }
        this.hbData.push({
          name: obj.wfstatus,
          value: Number(obj.count),
          css: currCss,
        });
      });
    }
  }

  private createAudit(itemText: string) {
    const agent: AuditAllocation = new Object();
    agent.clientid = AppComponent.getCurrentClient().clientId;
    agent.currUser = AppComponent.getCurrentUser().ntlg;
    if (this.selFileInfo) {
      agent.impid = this.selFileInfo.impid;
    }
    if (itemText) agent.itemText = itemText;
    return agent;
  }

  private evalAgent(agent: AuditAllocation) {
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
    this.agentData.emit(agent);
    agent.scenarioList = agent.Scenario;
    delete agent.Scenario;
    agent.statuscodeList = agent.StatusCode;
    delete agent.StatusCode;
    agent.actioncodeList = agent.ActionCode;
    delete agent.ActionCode;
    this.AuditAllocationService.postAccountAllocationUser(agent).subscribe(
      (data) => {
        if (data) {
          this.tabledata.emit(data);
        }
      }
    );
  }
}
