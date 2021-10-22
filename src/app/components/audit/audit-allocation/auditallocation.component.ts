import { Component, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import {
  faUserCheck,
  faUserMinus,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import { AppComponent } from "src/app/app.component";
import { AccessMasterOperations } from "src/app/models/access-master-operations";
import { AuditAllocationService } from "src/app/services/audit/audit-allocation.service";
import { DialogService } from "src/app/services/dialog/dialog.service";
import { AuditAllocation } from "src/app/models/audit-allocation";
import { UiCacheStore } from "src/app/models/ui-cache-store";
import { AuditReallocationService } from "src/app/services/audit/audit-reallocation.service";
import { Subject } from "rxjs";

@Component({
  selector: "app-auditallocation",
  templateUrl: "./auditallocation.component.html",
  styleUrls: ["./auditallocation.component.scss"],
})
export class AuditallocationComponent implements OnInit {
  faUserCheck = faUserCheck;
  faUserPlus = faUserPlus;
  faUserMinus = faUserMinus;

  agentAssignData: AuditAllocation;
  agentUnassignData: AuditAllocation;
  agentQcReassignData: AuditAllocation;
  agentreauAssignData: AuditAllocation;

  tableAssignData: any;
  tablereUnassignData: any;
  tableQcReassignData: any;

  userList: AccessMasterOperations[];

  noOfAccounts: number;
  noOfreAccounts: number;
  allocUsers: FormControl;
  allocUnUsers: FormControl;
  allocReUsers: FormControl;
  allocQcUsers: FormControl;
  allocreauUsers: FormControl;

  refreshauditDataSubject: Subject<boolean> = new Subject<boolean>();
  refreshAADataSubject: Subject<boolean> = new Subject<boolean>();

  constructor(
    private AuditAllocationService: AuditAllocationService,
    private dialogService: DialogService,
    private AuditReallocationService: AuditReallocationService
  ) {
    this.allocUsers = new FormControl();
    this.allocreauUsers = new FormControl();
    this.allocUnUsers = new FormControl();
    this.allocReUsers = new FormControl();
    this.allocQcUsers = new FormControl();
  }

  ngOnInit() {
    this.getUserList();
  }

  refreshAuditReallocation() {
    this.refreshauditDataSubject.next(true);
  }

  refreshAuditAllocation() {
    this.refreshAADataSubject.next(true);
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
    this.agentAssignData.auditorList = uListVal;
    this.AuditAllocationService.postAllotsAgent(this.agentAssignData).subscribe(
      (data) => {
        if (data) {
          // if (data) {
          //UiCacheStore.toCache("AuditAllocation", this.agentAssignData);
          this.dialogService.openSuccessModal(
            "Accounts assigned to auditor successfully"
          );
          // this.refreshAuditAllocation();
          this.noOfAccounts = null;
          this.allocUsers.reset();
          this.refreshAuditAllocation();
        } else {
          this.dialogService.openErrorModal(
            "Error occured while assigning accounts to auditor"
          );
          this.noOfreAccounts = null;
          this.allocreauUsers.reset();
          this.refreshAuditReallocation();
        }
        // else{
        //   this.dialogService.openErrorModal(
        //     "Accounts assigned to auditor successfully"
        //   );
        // }
      }
    );
  }

  //    else {
  //     this.dialogService.openErrorModal(
  //       "Error occured while assigning accounts to auditor"
  //     );
  //     // this.refreshAuditAllocation();
  //     this.noOfAccounts = null;
  //   this.allocUsers.reset();
  //   this.refreshAuditAllocation();
  //   }
  // }

  onauditreallotAssign(event) {
    if (!this.noOfreAccounts || this.noOfreAccounts <= 0) {
      this.dialogService.openWarningModal("Enter no. of accounts");
      return;
    }

    if (!this.allocreauUsers || !this.allocreauUsers.value) {
      this.dialogService.openWarningModal("Select auditor to be assigned");
      return;
    }

    if (!this.agentreauAssignData) {
      this.agentreauAssignData = {};
      this.agentreauAssignData.clientid = AppComponent.getCurrentClient().clientId;
      this.agentreauAssignData.currUser = AppComponent.getCurrentUser().ntlg;
      this.agentreauAssignData.impid = "-1";
    }

    this.agentreauAssignData.accountCount = Number(
      this.noOfreAccounts
    ).toString();
    let uListVal: string = this.allocreauUsers.value.toString();
    uListVal = uListVal.split(",").join("|");
    this.agentreauAssignData.reAllotAuditorList = uListVal;

    this.AuditReallocationService.postreAllotsAgent(
      this.agentreauAssignData
    ).subscribe((data) => {
      if (data) {
        // UiCacheStore.toCache("AuditAllocation", this.agentAssignData);
        this.dialogService.openSuccessModal(
          "Accounts assigned to auditor successfully"
        );
        this.noOfreAccounts = null;
        this.allocreauUsers.reset();
        this.refreshAuditReallocation();
      } else {
        this.dialogService.openErrorModal(
          "Error occured while assigning accounts to auditor"
        );
        this.noOfreAccounts = null;
        this.allocreauUsers.reset();
        this.refreshAuditReallocation();
      }
    });
  }

  onAuditAssignData(data: any) {
    this.agentAssignData = data;
  }

  onAuditUnassignData(data: any) {
    this.agentreauAssignData = data;
  }

  onQcReassignData(data: any) {
    this.agentQcReassignData = data;
  }

  onTableAssignData(data: any) {
    this.tableAssignData = data;
  }

  onTableUnassignData(data: any) {
    this.tablereUnassignData = data;
  }

  onTableQcReassignData(data: any) {
    this.tableQcReassignData = data;
  }

  private getUserList() {
    this.AuditAllocationService.getAgentForClient(
      AppComponent.getCurrentClient().clientId
    ).subscribe(
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
