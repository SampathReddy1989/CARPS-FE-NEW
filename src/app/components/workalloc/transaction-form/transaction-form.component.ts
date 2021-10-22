import {
  Component,
  OnInit,
  Input,
  OnChanges,
  Output,
  EventEmitter,
} from "@angular/core";
import { TransactionService } from "src/app/services/transaction/transaction.service";
import { AppComponent } from "src/app/app.component";
import { DialogService } from "src/app/services/dialog/dialog.service";

@Component({
  selector: "app-transaction-form",
  templateUrl: "./transaction-form.component.html",
  styleUrls: ["./transaction-form.component.scss"],
})
export class TransactionFormComponent implements OnInit, OnChanges {
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

  transactionData: any;

  constructor(
    private transactionService: TransactionService,
    private dialogService: DialogService
  ) {}

  ngOnInit() {
    this.initialLoad = true;
  }

  ngOnChanges() {
    if (
      this.tempSavedData &&
      this.tempSavedData.Rowid &&
      this.tempSavedData.Rowid == this.rowData.Rowid
    ) {
      this.getAllScenarioMaster();
    }
  }

  loadTempSavedDetails(tsData) {
    if (tsData.AgentNotes) {
      this.selectedAgentNotes = tsData.AgentNotes;
    }
    if (tsData.Scenario) {
      this.selectedScenario = tsData.Scenario;
    }
    if (tsData.StatusCode) {
      this.selectedStatusCode = tsData.StatusCode;
    }
    if (tsData.ActionCode) {
      this.selectedActionCode = tsData.ActionCode;
    }
    if (tsData.Responsibility) {
      this.selectedResponsibility = tsData.Responsibility;
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
    this.transactionService
      .getAllStatusCodeOperation(
        AppComponent.getCurrentClient().clientId,
        scnId
      )
      .subscribe((data: any) => {
        this.statusCodes = data;
        if (this.initialLoad) {
          if (this.rowData.StatusCode) {
            this.selectedStatusCode = this.rowData.StatusCode;
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
      console.log("Invalid status ID");
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

  onScenarioChange($event) {
    this.selectedScenario = $event;
    this.initialLoad = false;
    this.selectedStatusCode = "";
    this.selectedActionCode = "";
    this.rowData.ActionCode = "";
    this.actionCodes = null;

    if (this.rowData) {
      this.rowData.AgentNotes = this.getDefaultAgentNotes();
    }

    this.setCallbackApplicable();
    this.getAllStatusCodeOperation(this.getScenarioId());
  }

  getDefaultAgentNotes() {
    if (this.selectedScenario) {
      for (let i = 0; i < this.scenarios.length; i++) {
        if (this.selectedScenario == this.scenarios[i].scenarioName) {
          if (this.scenarios[i].defaultNotes) {
            return this.scenarios[i].defaultNotes;
          } else {
            return "";
          }
        }
      }
    }
    return "";
  }

  setCallbackApplicable() {
    let callbackApplicable = null;

    for (let i = 0; i < this.scenarios.length; i++) {
      if (this.selectedScenario == this.scenarios[i].scenarioName) {
        callbackApplicable = this.scenarios[i].callbackApplicable;
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

  onTempSave(selectedAccount) {
    if (!selectedAccount || !selectedAccount.Rowid) {
      console.log("Invalid Account or ROW ID is missing");
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
      delete data.scenario;
      delete data.scnId;
    }

    if (this.selectedStatusCode) {
      data.statusCode = this.selectedStatusCode;
      data.statusid = this.getStatusId();
    } else {
      delete data.statusCode;
      delete data.statusid;
    }

    if (this.selectedActionCode) {
      data.actionCode = this.selectedActionCode;
      data.billable = this.getBillable(this.selectedActionCode);
      data.externalCount = this.getExternalCount(this.selectedActionCode);
      data.internalCount = this.getInternalCount(this.selectedActionCode);
    } else {
      delete data.actionCode;
      delete data.billable;
      delete data.externalCount;
      delete data.internalCount;
    }

    if (this.selectedResponsibility) {
      data.responsibility = this.selectedResponsibility;
    } else {
      if (this.rowData.Responsibility) {
        data.responsibility = this.rowData.Responsibility;
      } else {
        delete data.responsibility;
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
      if (this.rowData.fupdate) {
        data.fupdate = this.rowData.fupdate;
      } else {
        // this.dialogService.openInfoModal("Agent Notes is required");
        delete data.fupdate;
      }
    }

    this.transactionService
      .saveCurrentAccountByClickingTempSaveButton(data)
      .subscribe((data) => {
        if (data) {
          //Refresh parent component from child
          this.dialogService.openSuccessModal("Account was saved temporarily");
          this.reloadRequest.emit(true);
        } else {
          this.dialogService.openErrorModal(
            "Error occured while saving the account"
          );
          this.reloadRequest.emit(true);
        }
      });
  }

  onSave(selectedAccount) {
    if (!selectedAccount || !selectedAccount.Rowid) {
      console.log("Invalid Account or ROW ID is missing");
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
      if (this.rowData.fupdate) {
        data.fupdate = this.rowData.fupdate;
      } else {
        delete data.fupdate;
      }
    }

    this.transactionService
      .saveCurrentAccountByClickingSaveButton(data)
      .subscribe((data) => {
        if (data) {
          this.dialogService.openSuccessModal("Account was saved successfully");
          this.reloadRequest.emit(true);
        } else {
          this.dialogService.openErrorModal(
            "Error occured while saving the account"
          );
          this.reloadRequest.emit(true);
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
      if (this.selectedStatusCode == this.statusCodes[i].statusCode) {
        return this.statusCodes[i].statusId;
      }
    }
  }

  getExternalCount(action) {
    console.log("action=", action, this.actionCodes);
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
