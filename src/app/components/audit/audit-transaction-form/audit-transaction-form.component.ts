import {
  Component,
  OnInit,
  Input,
  OnChanges,
  Output,
  EventEmitter,
} from "@angular/core";
import { AuditTransactionService } from "src/app/services/audit/audit-transaction/audit-transaction.service";
import { AppComponent } from "src/app/app.component";
import { DialogService } from "src/app/services/dialog/dialog.service";

@Component({
  selector: "app-audit-transaction-form",
  templateUrl: "./audit-transaction-form.component.html",
  styleUrls: ["./audit-transaction-form.component.scss"],
})
export class AuditTransactionFormComponent implements OnInit, OnChanges {
  @Input() rowData: any;
  @Input() selectedAccountDetails: any;
  @Input() tempSavedData: any;
  @Input() defaultScenario: any;
  @Output() reloadRequest = new EventEmitter<any>();

  //Transaction properties
  scenarios: any;
  statusCodes: any;
  actionCodes: any;
  responsibility = ["client", "website"];
  callbackApplicable: boolean;
  initialLoad: boolean;

  selectedScenario: string;
  selectedStatusCode: string;
  selectedActionCode: string;
  selectedResponsibility: string;
  selectedCallBackDate: string;
  selectedAgentNotes: string;
  selectedCategory: string;
  selectedSubcategory: string;

  transactionData: any;
  addError: any;
  onEdit: any;
  isDisabled: any;
  remarks: any;
  categories: any;
  subcategories: any;

  constructor(
    private transactionService: AuditTransactionService,
    private dialogService: DialogService
  ) {}

  ngOnInit() {
    this.addError = false;
    this.onEdit = false;
    this.isDisabled = true;
    this.callbackApplicable = true;
    this.initialLoad = true;
  }

  ngOnChanges() {
    if (
      this.tempSavedData &&
      this.tempSavedData.Rowid &&
      this.tempSavedData.Rowid == this.rowData.Rowid
    ) {
      this.getAllScenarioMaster();
      this.getAllCategories();
    }
  }

  private getAllScenarioMaster() {
    this.transactionService
      .getAllScenarioMaster(AppComponent.getCurrentClient().clientId)
      .subscribe((data: any) => {
        if (data) {
          this.scenarios = data;
          if (this.rowData.Scenario) {
            this.selectedScenario = this.rowData.Scenario;
            this.setCallbackApplicable();
            this.getAllStatusCodeOperation(this.getScenarioId());
          }
        }
      });
  }

  private getAllStatusCodeOperation(scnId) {
    if (!scnId) {
      return;
    }
    this.transactionService
      .getAllStatusCodeOperation(
        AppComponent.getCurrentClient().clientId,
        scnId
      )
      .subscribe((data: any) => {
        this.statusCodes = data;
        if (this.initialLoad) {
          if (this.rowData.Statuscode) {
            this.selectedStatusCode = this.rowData.Statuscode;
            this.getAllActioncodeOperation(this.getStatusId());
          }
        } else {
          if (this.selectedStatusCode) {
            this.getAllActioncodeOperation(this.getStatusId());
          }
        }
      });
  }

  private getAllActioncodeOperation(statusID) {
    if (!statusID) {
      return;
    }
    this.transactionService
      .getAllActioncodeOperation(
        AppComponent.getCurrentClient().clientId,
        statusID
      )
      .subscribe((data: any) => {
        this.actionCodes = data;
        if (this.initialLoad) {
          if (this.rowData.ActionCode) {
            this.selectedActionCode = this.rowData.ActionCode;
          }
        } else {
          this.selectedActionCode = "";
        }
      });
  }

  private getAllCategories() {
    this.transactionService.getErrorCatagory().subscribe((data: any) => {
      this.categories = data;
    });
  }

  private getSubcategories(category) {
    let categoryId = null;
    for (let i = 0; i < this.categories.length; i++) {
      if (this.categories[i].category == category) {
        categoryId = this.categories[i].cid;
        break;
      }
    }
    this.transactionService
      .getErrorSubCatagory(categoryId)
      .subscribe((data: any) => {
        this.subcategories = data;
      });
  }

  onScenarioChange($event) {
    this.selectedScenario = $event;
    this.initialLoad = false;
    this.selectedStatusCode = "";
    this.selectedActionCode = "";
    this.rowData.ActionCode = "";
    this.actionCodes = null;
    this.setCallbackApplicable();
    this.getAllStatusCodeOperation(this.getScenarioId());
  }

  setCallbackApplicable() {
    if (this.isDisabled) {
      return;
    }

    let callbackApplicable = null;

    for (let i = 0; i < this.scenarios.length; i++) {
      if (this.selectedScenario == this.scenarios[i].scenarioName) {
        callbackApplicable = this.scenarios[i].callbackApplicable;
      }
    }

    if (!callbackApplicable) {
      for (let i = 0; i < this.scenarios.length; i++) {
        if (
          this.rowData.Scenario &&
          this.rowData.Scenario == this.scenarios[i].scenarioName
        ) {
          callbackApplicable = this.scenarios[i].callbackApplicable;
        }
      }
    }

    if (callbackApplicable && callbackApplicable == "Y") {
      this.callbackApplicable = false;
    } else {
      this.callbackApplicable = true;
    }
  }

  onStatusCodeChange($event) {
    this.selectedStatusCode = $event;
    this.getAllActioncodeOperation(this.getStatusId());
  }

  onActionCodeChange($event) {
    this.selectedActionCode = $event;
  }

  onResponsibilityChange($event) {
    this.selectedResponsibility = $event;
  }

  onAgentNotesChange($event) {
    this.selectedAgentNotes = $event;
  }

  onCategoryChange($event) {
    this.selectedCategory = $event;
    this.getSubcategories(this.selectedCategory);
  }

  onSubcategoryChange($event) {
    this.selectedSubcategory = $event;
  }

  onRemarksChange($event) {
    this.remarks = $event;
  }

  onEditSelection(selectedAccount) {
    this.onEdit = true;
    this.isDisabled = false;
    this.setCallbackApplicable();
  }

  onUpdate(selectedAccount) {
    if (!selectedAccount || !selectedAccount.Rowid) {
      return;
    }

    let data = {
      clientId: AppComponent.getCurrentClient().clientId,
      rowid: selectedAccount.Rowid,
      scenario: this.selectedScenario,
      scnId: 0,
      statusCode: this.selectedStatusCode,
      statusid: 0,
      actionCode: this.selectedActionCode,
      billable: 0,
      externalCount: 0,
      internalCount: 0,
      responsibility: this.selectedResponsibility,
      fupdate: null,
      agentNotes: this.selectedAgentNotes,
    };

    if (this.selectedScenario) {
      data.scenario = this.selectedScenario;
      data.scnId = this.getScenarioId();
    } else {
      this.dialogService.openInfoModal("Scenario is required");
      return;
    }

    if (this.selectedStatusCode) {
      data.statusCode = this.selectedStatusCode;
      data.statusid = this.getStatusId();
    } else {
      this.dialogService.openInfoModal("StatusCode is required");
      return;
    }

    if (this.selectedActionCode) {
      data.actionCode = this.selectedActionCode;
      data.billable = this.getBillable(this.selectedActionCode);
      data.externalCount = this.getExternalCount(this.selectedActionCode);
      data.internalCount = this.getInternalCount(this.selectedActionCode);
    } else {
      this.dialogService.openInfoModal("ActionCode is required");
      return;
    }

    if (this.selectedResponsibility) {
      data.responsibility = this.selectedResponsibility;
    } else {
      if (this.rowData.Responsibility) {
        data.responsibility = this.rowData.Responsibility;
      } else {
        this.dialogService.openInfoModal("Responsibility is required");
        return;
      }
    }

    if (this.selectedAgentNotes) {
      data.agentNotes = this.selectedAgentNotes;
    } else {
      if (this.rowData.AgentNotes) {
        data.agentNotes = this.rowData.AgentNotes;
      } else {
        this.dialogService.openInfoModal("Agent Notes is required");
        return;
      }
    }

    if (this.selectedCallBackDate) {
      data.fupdate = this.selectedCallBackDate;
    } else {
      if (this.rowData.FupDate) {
        data.fupdate = this.rowData.FupDate;
      } else {
        delete data.fupdate;
      }
    }

    this.transactionService
      .updateCurrentAccountByAuditor(data)
      .subscribe((data) => {
        if (data) {
          //Refresh parent component from child
          this.dialogService.openSuccessModal(
            "Account was updated successfully"
          );
          this.reloadRequest.emit(true);
        } else {
          this.dialogService.openErrorModal(
            "Error occured while updating account"
          );
          this.reloadRequest.emit(true);
        }
      });
  }

  onAddError(selectedAccount) {
    this.addError = true;
  }

  onSaveError(selectedAccount) {
    let data = {
      category: null,
      subCategory: null,
      auditRemarks: null,
      rowid: selectedAccount.Rowid,
    };

    if (this.selectedCategory) {
      data.category = this.selectedCategory;
    } else {
      this.dialogService.openInfoModal("Category is required");
      return;
    }

    if (this.selectedSubcategory) {
      data.category = this.selectedSubcategory;
    } else {
      this.dialogService.openInfoModal("Sub Category is required");
      return;
    }

    if (this.remarks) {
      data.auditRemarks = this.remarks;
    } else {
      this.dialogService.openInfoModal("Audit Remarks is required");
      return;
    }

    this.transactionService.saveAccountWithError(data).subscribe((data) => {
      if (data) {
        //Refresh parent component from child
        this.dialogService.openSuccessModal("Account was saved with error");
        this.reloadRequest.emit(true);
      } else {
        this.reloadRequest.emit(true);
        this.dialogService.openErrorModal("Error occured while saving account");
      }
    });
  }

  onSaveAudit(selectedAccount) {
    let data = {
      rowid: selectedAccount.Rowid,
    };
    this.transactionService.saveAccount(data).subscribe((data) => {
      if (data) {
        //Refresh parent component from child
        this.dialogService.openSuccessModal("Account was saved");
        this.reloadRequest.emit(true);
      } else {
        this.reloadRequest.emit(true);
        this.dialogService.openErrorModal("Error occured while saving account");
      }
    });
  }

  getScenarioId() {
    for (let i = 0; i < this.scenarios.length; i++) {
      if (this.selectedScenario == this.scenarios[i].scenarioName) {
        return this.scenarios[i].scenarioID;
      }
    }
  }

  getStatusId() {
    for (let i = 0; i < this.statusCodes.length; i++) {
      if (
        this.selectedStatusCode == this.statusCodes[i].statusCode ||
        this.rowData.Statuscode == this.statusCodes[i].statusCode
      ) {
        return this.statusCodes[i].statusId;
      }
    }
  }

  getExternalCount(action) {
    for (let i = 0; i < this.actionCodes.length; i++) {
      if (action == this.actionCodes[i].actioncode) {
        let data = this.actionCodes[i].aid_IA_EA_B.split("|");
        return data[2];
      }
    }
  }

  getInternalCount(action) {
    for (let i = 0; i < this.actionCodes.length; i++) {
      if (action == this.actionCodes[i].actioncode) {
        let data = this.actionCodes[i].aid_IA_EA_B.split("|");
        return data[1];
      }
    }
  }

  getBillable(action) {
    for (let i = 0; i < this.actionCodes.length; i++) {
      if (action == this.actionCodes[i].actioncode) {
        let data = this.actionCodes[i].aid_IA_EA_B.split("|");
        return data[3];
      }
    }
  }

  onCallbackDateSelection($e) {
    let date = new Date($e);
    let year = date.getFullYear().toString();
    let month = (date.getMonth() + 1).toString();
    let day = date.getDate().toString();

    if (month) {
      if (month.toString().length == 1) {
        month = "0".toString().concat(month.toString());
      }
    }

    if (day) {
      if (day.toString().length == 1) {
        day = "0".toString().concat(day.toString());
      }
    }

    this.selectedCallBackDate = year + "-" + month + "-" + day;
  }
}
