import { Component, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import {
  faUserCheck,
  faUserMinus,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import { AppComponent } from "src/app/app.component";
import { AccessMasterOperations } from "src/app/models/access-master-operations";
import { AgentService } from "src/app/services/workalloc/agent.service";
import { DialogService } from "src/app/services/dialog/dialog.service";
import { AgentAllocationOperations } from "src/app/models/agent-alloc-ops";
import { UiCacheStore } from "src/app/models/ui-cache-store";
import { AgentReallocationService } from "src/app/services/workalloc/agent-reallocation/agent-reallocation.service";
import { Subject } from "rxjs";

@Component({
  selector: "app-workalloc",
  templateUrl: "./workalloc.component.html",
  styleUrls: ["./workalloc.component.scss"],
})
export class WorkallocComponent implements OnInit {
  faUserCheck = faUserCheck;
  faUserPlus = faUserPlus;
  faUserMinus = faUserMinus;

  agentAssignData: AgentAllocationOperations;
  agentUnassignData: AgentAllocationOperations;
  agentQcReassignData: AgentAllocationOperations;

  tableAssignData: any;
  tableUnassignData: any;
  tableQcReassignData: any;

  userList: AccessMasterOperations[];

  noOfAccounts: number;
  noOfAccountsAR: number;
  allocUsers: FormControl;
  allocUnUsers: FormControl;
  allocReUsers: FormControl;
  allocQcUsers: FormControl;

  refreshDataSubject: Subject<boolean> = new Subject<boolean>();
  refreshAgentAllocSubject: Subject<boolean> = new Subject<boolean>();
  allocpageData: any;
  reallocpageData: any;

  constructor(
    private agentService: AgentService,
    private dialogService: DialogService,
    private agentReallocationService: AgentReallocationService
  ) {
    this.allocUsers = new FormControl();
    this.allocUnUsers = new FormControl();
    this.allocReUsers = new FormControl();
    this.allocQcUsers = new FormControl();
  }

  ngOnInit() {
    this.getUserList();
  }

  refreshAgentReallocation() {
    this.refreshDataSubject.next(true);
  }

  refreshAgentAllocation() {
    this.refreshAgentAllocSubject.next(true);
  }

  onAssign(event) {
    if (!this.noOfAccounts || this.noOfAccounts <= 0) {
      this.dialogService.openWarningModal("Enter no. of accounts");
      return;
    }

    if (!this.allocUsers || !this.allocUsers.value) {
      this.dialogService.openWarningModal("Select agent to be assigned");
      return;
    }

    if (!this.agentAssignData) {
      this.agentAssignData = {};
      this.agentAssignData.clientid = AppComponent.getCurrentClient().clientId;
      this.agentAssignData.currUser = AppComponent.getCurrentUser().ntlg;
      this.agentAssignData.impid = "-1";
    }

    this.agentAssignData.accountCount = Number(this.noOfAccounts).toString();
    let uListVal: string = this.allocUsers.value.toString();
    uListVal = uListVal.split(",").join("|");
    this.agentAssignData.agentlist = uListVal;

    this.agentService
      .postAllotsAgent(this.agentAssignData)
      .subscribe((data) => {
        //UiCacheStore.toCache("AgentAssign", this.agentAssignData);
        this.dialogService.openSuccessModal(
          "Account(s) assigned to agent successfully"
        );
        this.noOfAccounts = null;
        this.allocUsers.reset();
        this.refreshAgentAllocation();
      });
  }

  onUnassign(event) {
    if (!this.noOfAccountsAR || this.noOfAccountsAR <= 0) {
      this.dialogService.openWarningModal("Enter no. of accounts");
      return;
    }

    if (!this.agentUnassignData) {
      this.agentUnassignData = {};
      this.agentUnassignData.clientid = AppComponent.getCurrentClient().clientId;
      this.agentUnassignData.currUser = AppComponent.getCurrentUser().ntlg;
      this.agentUnassignData.impid = "-1";
    }

    this.agentUnassignData.accountCount = Number(
      this.noOfAccountsAR
    ).toString();

    this.agentReallocationService
      .releaseAccountFromSelectedAgent(this.agentUnassignData)
      .subscribe((data) => {
        if (data) {
          //UiCacheStore.toCache("AgentReallocation", this.agentUnassignData);
          let message = "";
          if (this.noOfAccountsAR == 1) {
            message =
              this.agentUnassignData.accountCount +
              " account unassigned from agent successfully";
          } else {
            message =
              this.agentUnassignData.accountCount +
              " accounts unassigned from agent successfully";
          }
          this.dialogService.openSuccessModal(message);
          this.noOfAccountsAR = null;
          this.refreshAgentReallocation();
        } else {
          this.dialogService.openErrorModal(
            "Error occured while unassigning the accounts"
          );
          this.noOfAccountsAR = null;
          this.refreshAgentReallocation();
        }
      });
  }

  onReassign(event) {
    if (!this.noOfAccountsAR || this.noOfAccountsAR <= 0) {
      this.dialogService.openWarningModal("Enter no. of accounts");
      return;
    }

    if (!this.allocReUsers || !this.allocReUsers.value) {
      this.dialogService.openWarningModal("Select agent to be re-assigned");
      return;
    }

    if (!this.agentUnassignData) {
      this.agentUnassignData = {};
      this.agentUnassignData.clientid = AppComponent.getCurrentClient().clientId;
      this.agentUnassignData.currUser = AppComponent.getCurrentUser().ntlg;
      this.agentUnassignData.impid = "-1";
    }

    this.agentUnassignData.accountCount = Number(
      this.noOfAccountsAR
    ).toString();

    let uListVal: string = this.allocReUsers.value.toString();
    uListVal = uListVal.split(",").join("|");
    this.agentUnassignData.agentlist = uListVal;

    this.agentReallocationService
      .reAssign(this.agentUnassignData)
      .subscribe((data) => {
        if (data) {
          //UiCacheStore.toCache("AgentReallocation", this.agentUnassignData);
          let message = "";
          if (this.noOfAccountsAR == 1) {
            message =
              this.agentUnassignData.accountCount +
              " account re-assigned to agent successfully";
          } else {
            message =
              this.agentUnassignData.accountCount +
              " accounts re-assigned to agent successfully";
          }
          this.dialogService.openSuccessModal(message);
          this.noOfAccountsAR = null;
          this.allocReUsers.reset();
          this.refreshAgentReallocation();
        } else {
          this.dialogService.openErrorModal(
            "Error occured while re-assigning the accounts"
          );
          this.noOfAccountsAR = null;
          this.allocReUsers.reset();
          this.refreshAgentReallocation();
        }
      });
  }

  onAgentAssignData(data: any) {
    this.agentAssignData = data;
  }

  onAgentUnassignData(data: any) {
    this.agentUnassignData = data;
  }

  onQcReassignData(data: any) {
    this.agentQcReassignData = data;
  }

  onTableAssignData(data: any) {
    this.tableAssignData = data;
  }

  onTableUnassignData(data: any) {
    this.tableUnassignData = data;
  }

  onTableQcReassignData(data: any) {
    this.tableQcReassignData = data;
  }

  alloconpaginationLogic(event){
    this.allocpageData = event;
  }

  realloconpaginationLogic(event){
    this.reallocpageData = event;
  }

  private getUserList() {
    this.agentService
      .getAgentForClient(AppComponent.getCurrentClient().clientId)
      .subscribe(
        (data) => {
          if (data) {
            this.userList = data;
          }
        },
        (error) => {
          this.dialogService.openErrorModal("Error receiving users");
        }
      );
  }
}
