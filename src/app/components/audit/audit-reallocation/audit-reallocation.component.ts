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
// import { AgentAllocationOperations } from "src/app/models/agent-alloc-ops";
import { AgingWiseSummaryInfo } from "src/app/models/agentwise-info";
import { DbFileNameAliasNameHolder } from "src/app/models/dbfieldname-alias-name-holder";
import { FileInfo } from "src/app/models/file-info";
import { StatusWiseInfo } from "src/app/models/statuswise-info";
import { UiCacheStore } from "src/app/models/ui-cache-store";
import { DialogService } from "src/app/services/dialog/dialog.service";
import { AuditReallocationService } from "src/app/services/audit/audit-reallocation.service";
import { Subject } from "rxjs";
import { AuditAllocation } from "src/app/models/audit-allocation";

@Component({
  selector: "app-audit-reallocation",
  templateUrl: "./audit-reallocation.component.html",
  styleUrls: ["./audit-reallocation.component.scss"],
})
export class AuditReallocationComponent implements OnInit {
  @Input() name: string;
  @Input() refreshauditDataSubject: Subject<boolean> = new Subject<boolean>();
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
  selDbFieldHolder: DbFileNameAliasNameHolder;
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
    private http: AuditReallocationService,
    private dialog: MatDialog,
    private dialogService: DialogService
  ) {}

  ngOnInit() {
    this.refreshauditDataSubject.subscribe((response) => {
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
  //   this.refreshauditDataSubject.subscribe((response) => {
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

  removeFilter(key: string) {
    if (this.uiFieldCriteriaMap.has(key)) {
      this.uiFieldCriteriaMap.delete(key);
    }
    if (this.selDbFieldHolder && this.selDbFieldHolder.dbFieldName) {
      this.evalAgent(this.createAgent(this.selDbFieldHolder.dbFieldName));
      // UiCacheStore.toCache(
      //   this.name.trim() + "uiFieldCriteriaMap",
      //   JSON.stringify(Array.from(this.uiFieldCriteriaMap.entries()))
      // );
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
    this.uiFieldCriteriaMap.clear();
    this.selFileInfo = this.fileList.find((x) => x.impid === event.value);
    if (this.selFileInfo) {
      this.evalAgent(this.createAgent(null));
      // UiCacheStore.toCache(this.name.trim() + "FileInfo", this.selFileInfo);
      this.getAgingSummary(this.selFileInfo.impid);
      this.getStatusSummary(this.selFileInfo.impid);
      this.clearCustomSearch();
      this.getFileList();
      this.getAllFieldList();
      this.loadAccounts();
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
      .postCustomSearchDropdownList(
        this.createAgent(this.selDbFieldHolder.dbFieldName)
      )
      .subscribe((data) => {
        if (data) {
          this.apiFieldValues = data;
          this.apiFieldValues.splice(0, 1);
        }
      });
    // this.selDbFieldHolder = event.value;
    // this.http
    //   .postCustomSearchDropdownList(
    //     this.createAgent(this.selDbFieldHolder.dbFieldName)
    //   )
    //   .subscribe((data) => {
    //     if (data) {
    //       this.apiFieldValues = data;
    //       this.apiFieldValues.splice(0, 1);
    //     }
    //   });
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
    // }
    this.clearCustomSearchUI(stepper);
    this.evalAgent(this.createAgent(this.selDbFieldHolder.dbFieldName));
    this.fieldValAppended = "";
    // UiCacheStore.toCache(
    //   this.name.trim() + "uiFieldCriteriaMap",
    //   JSON.stringify(Array.from(this.uiFieldCriteriaMap.entries()))
    // );
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
        this.selDbFieldHolder.dbFieldName === "allottedAgentlist" ||
        this.selDbFieldHolder.dbFieldName === "Scenario" ||
        this.selDbFieldHolder.dbFieldName === "ActionCode" ||
        this.selDbFieldHolder.dbFieldName === "StatusCode " ||
        this.selDbFieldHolder.dbFieldName === "Auditor"
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
    if (this.sortOrderBy.value === undefined || this.sortOrderBy.value === null)
      this.dialogService.openErrorModal(
        "Select a sorting order by for a field"
      );

    this.uiFieldCriteriaMap.set(
      "SORT" +
        this.selDbFieldSortHolder.aliasName +
        " : " +
        this.sortOrderBy.value,
      this.selDbFieldSortHolder.dbFieldName + " " + this.sortOrderBy.value
    );
    this.clearCustomSearchUI(stepper);
    this.evalAgent(this.createAgent(this.selDbFieldSortHolder.dbFieldName));
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

  private getAgingSummary(impid: string) {
    if (impid) {
      this.http
        .getAgingSummaryClient(AppComponent.getCurrentClient().clientId, impid)
        .subscribe(
          (data: AgingWiseSummaryInfo[]) => {
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
      this.http
        .getStatusSummaryClient(AppComponent.getCurrentClient().clientId, impid)
        .subscribe(
          (data: StatusWiseInfo[]) => {
            this.evalStatusSummary(data);
          },
          (error) => {
            this.dialogService.openErrorModal +
              "Error receiving Status summary";
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

  loadAccounts() {
    this.evalAgent(this.createAgent(null));
  }

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

  private createAgent(itemText: string) {
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
    console.log("data", agent);
    agent.scenarioList = agent.Scenario;
    delete agent.Scenario;
    agent.statuscodeList = agent.StatusCode;
    delete agent.StatusCode;
    agent.actioncodeList = agent.ActionCode;
    delete agent.ActionCode;
    // agent.allottedAgentlist = agent.Agent;
    // delete agent.Agent;
    console.log("data", agent);
    this.http.postAccountreAllocationUser(agent).subscribe((data) => {
      if (data) {
        this.tabledata.emit(data);
      }
    });
  }
}
