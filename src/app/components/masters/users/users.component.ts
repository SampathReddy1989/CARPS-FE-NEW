import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { MatPaginator, MatTableDataSource } from "@angular/material";
import { BehaviorSubject } from "rxjs";
import { AppComponent } from "src/app/app.component";
import { AccessMasterOperations } from "src/app/models/access-master-operations";
import { ClientDetail } from "src/app/models/client-detail";
import { UserRole } from "src/app/models/user-role";
import { AccessMasterOperationService } from "src/app/services/user/user-operation.service";
import { DialogService } from "src/app/services/dialog/dialog.service";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-users",
  templateUrl: "./users.component.html",
  styleUrls: ["./users.component.scss"],
})
export class UsersComponent implements OnInit {
  roles: UserRole[] = environment.roles;
  formGroup: FormGroup;
  aEmpIdControl: FormControl = new FormControl();
  aEmpNameControl: FormControl = new FormControl();
  aNtlgControl: FormControl = new FormControl();
  aPassControl: FormControl = new FormControl();
  aClientControl: FormControl = new FormControl();
  apseudoNameControl: FormControl = new FormControl();
  aRoleControl: FormControl = new FormControl();
  aProdControl: FormControl = new FormControl();
  aActiveControl: FormControl = new FormControl("Y");
  editvariable = true;
  hide = true;
  loading = false;
  displayedColumns = [
    "configurationFlag",
    "empid",
    "name",
    "ntlg",
    "password",
    "clientName",
    "pseudoName",
    "role",
    "target",
    "active",
  ];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  dataSource: MatTableDataSource<AccessMasterOperations>;

  usersData: AccessMasterOperations[] = [];
  clientsData: ClientDetail[] = [];
  userSubject: BehaviorSubject<AccessMasterOperations[]> = new BehaviorSubject(
    null
  );
  initialValues: any;

  constructor(
    private formBuilder: FormBuilder,
    private accessOpsService: AccessMasterOperationService,
    private dialogService: DialogService
  ) {
    this.formGroup = this.formBuilder.group({
      aEmpId: this.aEmpIdControl,
      aEmpName: this.aEmpNameControl,
      aNtlg: this.aNtlgControl,
      aPassword: this.aPassControl,
      aClient: this.aClientControl,
      apseudoName: this.apseudoNameControl,
      aRole: this.aRoleControl,
      aProd: this.aProdControl,
      aActive: this.aActiveControl,
    });

    this.userSubject.asObservable().subscribe((data) => {
      if (data) {
        data.forEach((user) =>
          Object.defineProperty(user, "uiActive", {
            value: user.active === "Y",
            writable: true,
            configurable: true,
            enumerable: true,
          })
        );
        data.forEach((user) =>
          Object.defineProperty(user, "configurationFlag", {
            value: false,
            writable: true,
            configurable: true,
            enumerable: true,
          })
        );
        data.forEach((user) => this.usersData.push(user));
        this.dataSource = new MatTableDataSource(this.usersData);
        this.dataSource.paginator = this.paginator;
      }
    });
  }

  ngOnInit() {
    this.usersData = [];
    this.getUsersData();
    this.initialValues = this.formGroup.value;
    this.getRequiredData();
  }

  onAdd() {
    if (this.formGroup.invalid) {
      return;
    }
    this.loading = true;
    this.accessOpsService.addUser(this.createAdd(this.formGroup)).subscribe(
      (data) => {
        this.ngOnInit();
        this.dialogService.openSuccessModal("User Added Successfully");
        this.setInitialValues();
        this.formGroup.reset(this.initialValues);
        this.loading = false;
      },
      (error) => {
        this.dialogService.openErrorModal("User Add failed");
        this.setInitialValues();
        this.formGroup.reset(this.initialValues);
        this.loading = false;
      }
    );
  }
  setInitialValues() {
    this.initialValues.aEmpId = null;
    this.initialValues.aEmpName = null;
    this.initialValues.aNtlg = null;
    this.initialValues.aClient = null;
    this.initialValues.apseudoName = null;
    this.initialValues.aRole = null;
    this.initialValues.aProd = null;
    this.initialValues.aActive = "Y";
  }
  onChange(event, obj: AccessMasterOperations, type: string) {
    switch (type) {
      case "role":
        obj.role = event.value.rid;
        break;

      case "client":
        obj.clientId = event.value.clientId;
        break;
    }
  }

  onAction(obj: AccessMasterOperations) {
    if (obj.configurationFlag === false) {
      this.dataSource.data.map((ele, index) => {
        if (ele.configurationFlag == true) {
          ele.configurationFlag = false;
        }
      });
      obj.configurationFlag = true;
      this.editvariable = false;
    } else {
      obj.configurationFlag = false; // Update
      this.accessOpsService.updateUser(this.processData(obj)).subscribe(
        (data) => {
          this.ngOnInit(); // reset table
          this.editvariable = true;
          this.dialogService.openSuccessModal("User Updated successfully");
        },
        (error) => {
          this.dialogService.openErrorModal("User Update failed");
          this.ngOnInit(); // reset table
        }
      );
    }
  }
  onclose(obj: AccessMasterOperations) {
    obj.configurationFlag = false; // Update
    this.ngOnInit();
  }

  getName(id: number, type: string): string {
    switch (type) {
      case "role":
        const userRole: UserRole = this.roles.find((x) => x.rid === id);
        if (userRole) {
          return userRole.roleName;
        }

      case "client":
        const cName: ClientDetail = this.clientsData.find(
          (x) => x.clientId === id
        );
        if (cName) {
          return cName.clientName;
        }
    }
    return "unknown";
  }

  getSelected(obj: AccessMasterOperations, type: string): any {
    switch (type) {
      case "role":
        if (obj && obj.hasOwnProperty("role") && obj.role !== undefined) {
          return this.roles.find((x) => x.rid === obj.role);
        }

      case "client":
        if (
          obj &&
          obj.hasOwnProperty("clientId") &&
          obj.clientId !== undefined
        ) {
          return this.clientsData.find((x) => x.clientId === obj.clientId);
        }
    }
    return null;
  }

  private getRequiredData() {
    this.accessOpsService.getAllActiveClient().subscribe(
      (data) => {
        data.forEach((obj) => {
          const cData: ClientDetail = new Object();
          cData.clientId = obj.clientID;
          cData.clientName = obj.clientName;
          this.clientsData.push(cData);
        });
      },
      (error) => {
        this.dialogService.openErrorModal("Clients Data Failed Retrieving");
      }
    );
  }

  private getUsersData() {
    this.accessOpsService
      .getUserByClient(AppComponent.getCurrentClient().clientId)
      .subscribe(
        (data) => {
          if (data && data.length > 0) {
            this.userSubject.next(data);
          }
        },
        (error) => {
          this.dialogService.openErrorModal("UsersByClient Failed Retrieval");
        }
      );
  }

  private processData(obj: AccessMasterOperations): AccessMasterOperations {
    obj.active = obj.uiActive ? "Y" : "N";
    delete obj.uiActive;
    delete obj.configurationFlag;
    return obj;
  }

  private createAdd(formGroup: FormGroup): AccessMasterOperations {
    let obj: AccessMasterOperations = new Object();
    obj.clientId = formGroup.value.aClient;

    obj.empid = formGroup.value.aEmpId;
    obj.name = formGroup.value.aEmpName;
    obj.ntlg = formGroup.value.aNtlg;
    obj.password = formGroup.value.aPassword;

    obj.pseudoName = formGroup.value.apseudoName;
    obj.role = formGroup.value.aRole.rid;
    obj.target = formGroup.value.aProd;
    obj.active = formGroup.value.aActive;
    return obj;
  }
}
