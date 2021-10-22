import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { MatPaginator, MatTableDataSource } from "@angular/material";
import { BehaviorSubject, Observable } from "rxjs";
import { AppComponent } from "src/app/app.component";
import { StatusCodeOperations } from "src/app/models/status-code-operations";
import { StatusOperationsService } from "src/app/services/status/status-operations.service";
import { DialogService } from "src/app/services/dialog/dialog.service";
import { ScenarioOperationsService } from "src/app/services/scenario/scenario-operations.service";
import { ScenarioMaster } from "src/app/models/scenario-master";

@Component({
  selector: "app-status-codes",
  templateUrl: "./status-codes.component.html",
  styleUrls: ["./status-codes.component.scss"],
})
export class StatusCodesComponent implements OnInit {
  formGroup: FormGroup;
  aScenarioControl: FormControl = new FormControl();
  aStatusControl: FormControl = new FormControl();
  aActiveControl: FormControl = new FormControl("Y");
  editvariable = true;

  currClientName: string;
  loading = false;
  displayedColumns = [
    "clientName",
    "scenario",
    "statusCode",
    "active",
    "configurationFlag",
  ];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  dataSource: MatTableDataSource<StatusCodeOperations>;

  scenarioOps: ScenarioMaster[];
  statusSubject: BehaviorSubject<StatusCodeOperations[]> = new BehaviorSubject(
    null
  );
  initialValues: any;

  constructor(
    private formBuilder: FormBuilder,
    private scenarioService: ScenarioOperationsService,
    private statusOperationsService: StatusOperationsService,
    private dialogService: DialogService
  ) {
    this.formGroup = this.formBuilder.group({
      aScenario: this.aScenarioControl,
      aStatus: this.aStatusControl,
      aActive: this.aActiveControl,
    });

    this.statusSubject
      .asObservable()
      .subscribe((data: StatusCodeOperations[]) => {
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
          this.dataSource = new MatTableDataSource(data);
          this.dataSource.paginator = this.paginator;
        }
      });
  }

  ngOnInit() {
    this.currClientName = AppComponent.getCurrentClient().clientName;
    this.scenarioService
      .getAllScenario(AppComponent.getCurrentClient().clientId)
      .subscribe((data) => (this.scenarioOps = data));
    this.getStatusCodeData();
    this.initialValues = this.formGroup.value;
  }

  onAdd() {
    if (this.formGroup.invalid) {
      return;
    }
    this.loading = true;
    this.statusOperationsService
      .addStatusCode(this.createAdd(this.formGroup))
      .subscribe(
        (data) => {
          this.ngOnInit();
          this.dialogService.openSuccessModal(
            "Status Code  Added Successfully"
          );
          this.setInitialValues();
          this.formGroup.reset(this.initialValues);
          this.loading = false;
        },
        (error) => {
          this.dialogService.openErrorModal("Status Code already exists.");
          this.setInitialValues();
          this.formGroup.reset(this.initialValues);
          this.loading = false;
        }
      );
  }

  setInitialValues() {
    this.initialValues.aScenario = null;
    this.initialValues.aStatus = null;
    this.initialValues.aActive = "Y";
  }
  onAction(obj: StatusCodeOperations) {
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
      this.statusOperationsService
        .updateStatusCodeOperation(this.processData(obj))
        .subscribe(
          (data) => {
            this.ngOnInit(); // reset table
            this.editvariable = true;
            this.dialogService.openSuccessModal(
              "Status Code Updated successfully"
            );
          },
          (error) => {
            this.dialogService.openErrorModal("Status Code Update failed");
            this.ngOnInit(); // reset table
          }
        );
    }
  }
  onclose(obj: StatusCodeOperations) {
    obj.configurationFlag = false; // Update
    this.ngOnInit();
  }

  onChange(event, obj: StatusCodeOperations, type: string) {
    switch (type) {
      case "scenario":
        let scn: ScenarioMaster = event.value;
        obj.scnId = scn.scenarioID;
        obj.scenario = scn.scenarioName;
        break;
    }
  }

  getSelected(obj: StatusCodeOperations): ScenarioMaster {
    if (obj && obj.hasOwnProperty("scnId") && obj.scnId !== undefined) {
      return this.scenarioOps.find((x) => x.scenarioID === obj.scnId);
    }
    return null;
  }

  private getStatusCodeData() {
    this.statusOperationsService
      .getAllStatusCode(AppComponent.getCurrentClient().clientId)
      .subscribe(
        (data) => {
          this.handleScenario(data).subscribe(
            (result) => this.statusSubject.next(result),
            (error) => {
              this.dialogService.openWarningModal("No Status Codes available");
            }
          );
        },
        (error) => {
          this.dialogService.openErrorModal("Status Code Failed Retrieval");
        }
      );
  }

  private handleScenario(
    data: StatusCodeOperations[]
  ): Observable<StatusCodeOperations[]> {
    let obsObj = new Observable<StatusCodeOperations[]>((obs) => {
      const proData: StatusCodeOperations[] = [];
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
        if (obj.hasOwnProperty("scnId") && obj.hasOwnProperty("statusId")) {
          this.statusOperationsService
            .getStatusByScenarioAndClient(
              AppComponent.getCurrentClient().clientId,
              obj.scnId,
              obj.statusId
            )
            .subscribe((asyncObj: StatusCodeOperations) => {
              if (asyncObj) {
                asyncObj.scnId = obj.scnId;
                proData.push(asyncObj);
              }
              obs.next(proData);
            });
        }
      });
    });
    return obsObj;
  }

  private processData(obj: StatusCodeOperations): StatusCodeOperations {
    obj.active = obj.uiActive ? "Y" : "N";
    delete obj.uiActive;
    delete obj.configurationFlag;
    return obj;
  }

  private createAdd(formGroup: FormGroup): StatusCodeOperations {
    let obj: StatusCodeOperations = new Object();
    obj.clientId = AppComponent.getCurrentClient().clientId;
    obj.clientName = AppComponent.getCurrentClient().clientName;

    obj.scnId = formGroup.value.aScenario.scenarioID;
    obj.scenario = formGroup.value.aScenario.scenarioName;
    obj.statusCode = formGroup.value.aStatus;
    obj.active = formGroup.value.aActive;
    return obj;
  }
}
