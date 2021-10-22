import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { MatPaginator, MatTableDataSource } from "@angular/material";
import { BehaviorSubject, Observable } from "rxjs";
import { AppComponent } from "src/app/app.component";
import { ActionCodeOperations } from "src/app/models/action-code-operations";
import { ActionOperationsService } from "src/app/services/action/action-operations.service";
import { StatusCodeOperations } from "src/app/models/status-code-operations";
import { StatusOperationsService } from "src/app/services/status/status-operations.service";
import { DialogService } from "src/app/services/dialog/dialog.service";

@Component({
  selector: "app-action-codes",
  templateUrl: "./action-codes.component.html",
  styleUrls: ["./action-codes.component.scss"],
})
export class ActionCodesComponent implements OnInit {
  formGroup: FormGroup;
  aStatusControl: FormControl = new FormControl();
  aActionControl: FormControl = new FormControl();
  aBillableControl: FormControl = new FormControl("Y");
  aInternalControl: FormControl = new FormControl("Y");
  aExternalControl: FormControl = new FormControl("Y");
  aActiveControl: FormControl = new FormControl("Y");
  editvariable = true;

  currClientName: string;
  loading = false;
  displayedColumns = [
    "clientName",
    "statusCode",
    "actionCode",
    "billable",
    "internalAccountable",
    "externalAccountable",
    "active",
    "configurationFlag",
  ];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  dataSource: MatTableDataSource<ActionCodeOperations>;

  statusCodes: StatusCodeOperations[];
  actionSubject: BehaviorSubject<ActionCodeOperations[]> = new BehaviorSubject(
    null
  );

  initialValues: any;

  constructor(
    private formBuilder: FormBuilder,
    private statusService: StatusOperationsService,
    private actionOperationsService: ActionOperationsService,
    private dialogService: DialogService
  ) {
    this.formGroup = this.formBuilder.group({
      aStatus: this.aStatusControl,
      aAction: this.aActionControl,
      aBill: this.aBillableControl,
      aInternal: this.aInternalControl,
      aExternal: this.aExternalControl,
      aActive: this.aActiveControl,
    });

    this.actionSubject
      .asObservable()
      .subscribe((data: ActionCodeOperations[]) => {
        if (data) {
          data.forEach((user) =>
            Object.defineProperty(user, "uiBill", {
              value: user.billable === 1,
              writable: true,
              configurable: true,
              enumerable: true,
            })
          );
          data.forEach((user) =>
            Object.defineProperty(user, "uiInternal", {
              value: user.internalAccountable === 1,
              writable: true,
              configurable: true,
              enumerable: true,
            })
          );
          data.forEach((user) =>
            Object.defineProperty(user, "uiExternal", {
              value: user.externalAccountable === 1,
              writable: true,
              configurable: true,
              enumerable: true,
            })
          );
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
          this.dataSource = new MatTableDataSource(data);
          this.dataSource.paginator = this.paginator;
        }
      });
  }

  ngOnInit() {
    this.currClientName = AppComponent.getCurrentClient().clientName;
    this.statusService
      .getAllStatusCode(AppComponent.getCurrentClient().clientId)
      .subscribe((data) => (this.statusCodes = data));
    this.getActionCodeData();
    this.initialValues = this.formGroup.value;
  }

  onAdd(event) {
    if (this.formGroup.invalid) {
      return;
    }
    this.loading = true;
    this.actionOperationsService
      .addActionCode(this.createAdd(this.formGroup))
      .subscribe(
        (data) => {
          this.ngOnInit();
          this.dialogService.openSuccessModal(
            "Action Code  Added Successfully"
          );
          this.setInitialValues();
          this.formGroup.reset(this.initialValues);

          this.loading = false;
        },
        (error) => {
          this.dialogService.openErrorModal("Action Code already exists.");
          // this.initialValues.aAction = null;
          // this.initialValues.aStatus = null;
          this.setInitialValues();
          this.formGroup.reset(this.initialValues);
          this.loading = false;
        }
      );
  }

  setInitialValues() {
    this.initialValues.aAction = null;
    this.initialValues.aStatus = null;
    this.initialValues.aBill = "Y";
    this.initialValues.aExternal = "Y";
    this.initialValues.aInternal = "Y";
    this.initialValues.aActive = "Y";
  }

  onAction(obj: ActionCodeOperations) {
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
      this.actionOperationsService
        .updateActionCodeOperation(this.processData(obj))
        .subscribe(
          (data) => {
            this.ngOnInit(); // reset table
            this.editvariable = true;
            this.dialogService.openSuccessModal(
              "Action Code Updated successfully"
            );
          },
          (error) => {
            this.dialogService.openErrorModal("Action Code Update failed");
            this.ngOnInit(); // reset table
          }
        );
    }
  }
  onclose(obj: ActionCodeOperations) {
    obj.configurationFlag = false; // Update
    this.ngOnInit();
  }

  onChange(event, obj: ActionCodeOperations, type: string) {
    switch (type) {
      case "status":
        obj.statusId = event.value.statusId;
        obj.statusCode = event.value.statusCode;
        break;
    }
  }

  getSelected(obj: ActionCodeOperations): ActionCodeOperations {
    if (obj && obj.hasOwnProperty("statusId") && obj.statusId !== undefined) {
      return this.statusCodes.find((x) => x.statusId === obj.statusId);
    }
    return null;
  }

  private getActionCodeData() {
    this.actionOperationsService
      .getAllActionCode(AppComponent.getCurrentClient().clientId)
      .subscribe(
        (data) => {
          this.handleScenario(data).subscribe(
            (result) => this.actionSubject.next(result),
            (error) => {
              this.dialogService.openWarningModal("No Action Codes available");
            }
          );
        },
        (error) => {
          this.dialogService.openErrorModal("Action Code Failed Retrieval");
        }
      );
  }

  private handleScenario(
    data: ActionCodeOperations[]
  ): Observable<ActionCodeOperations[]> {
    let obsObj = new Observable<ActionCodeOperations[]>((obs) => {
      const proData: ActionCodeOperations[] = [];
      data.forEach(async (obj) => {
        if (
          !obj.hasOwnProperty("clientId") ||
          !obj.hasOwnProperty("clientName")
        ) {
          obj.clientId = AppComponent.getCurrentClient().clientId;
          obj.clientName = AppComponent.getCurrentClient().clientName;
        }
        if (!obj.hasOwnProperty("active")) {
          obj.active = undefined;
        }
        if (obj.hasOwnProperty("actionId") && obj.hasOwnProperty("statusId")) {
          this.actionOperationsService
            .getActionByScenarioAndClient(
              AppComponent.getCurrentClient().clientId,
              obj.statusId,
              obj.actionId
            )
            .subscribe((asyncObj: ActionCodeOperations) => {
              if (asyncObj) {
                asyncObj.statusId = obj.statusId;
                proData.push(asyncObj);
              }
              obs.next(proData);
            });
        }
      });
    });
    return obsObj;
  }

  private processData(obj: ActionCodeOperations): ActionCodeOperations {
    obj.billable = obj.uiBill ? 1 : 0;
    obj.internalAccountable = obj.uiInternal ? 1 : 0;
    obj.externalAccountable = obj.uiExternal ? 1 : 0;
    obj.active = obj.uiActive ? "Y" : "N";
    delete obj.uiBill;
    delete obj.uiInternal;
    delete obj.uiExternal;
    delete obj.uiActive;
    delete obj.configurationFlag;
    return obj;
  }

  private createAdd(formGroup: FormGroup): ActionCodeOperations {
    let obj: ActionCodeOperations = new Object();
    obj.clientId = AppComponent.getCurrentClient().clientId;
    obj.clientName = AppComponent.getCurrentClient().clientName;

    obj.statusId = formGroup.value.aStatus.statusId;
    obj.statusCode = formGroup.value.aStatus.statusCode;
    obj.actionCode = formGroup.value.aAction;
    obj.active = formGroup.value.aActive;
    obj.billable = formGroup.value.aBill === "Y" ? 1 : 0;
    obj.internalAccountable = formGroup.value.aInternal === "Y" ? 1 : 0;
    obj.externalAccountable = formGroup.value.aExternal === "Y" ? 1 : 0;
    obj.active = formGroup.value.aActive;
    return obj;
  }
}
