import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { MatPaginator, MatTableDataSource } from "@angular/material";
import { BehaviorSubject, Observable } from "rxjs";
import { AppComponent } from "src/app/app.component";
import { ScenarioMaster } from "src/app/models/scenario-master";
import { ScenarioOperationsService } from "src/app/services/scenario/scenario-operations.service";
import { DialogService } from "src/app/services/dialog/dialog.service";

@Component({
  selector: "app-scenario",
  templateUrl: "./scenario.component.html",
  styleUrls: ["./scenario.component.scss"],
})
export class ScenarioComponent implements OnInit {
  formGroup: FormGroup;
  aScenarioControl: FormControl = new FormControl();
  aNotesControl: FormControl = new FormControl();
  aCallback: FormControl = new FormControl("Y");
  aActiveControl: FormControl = new FormControl("Y");
  editvariable = true;

  currClientName: string;
  loading = false;
  displayedColumns = [
    "clientName",
    "scenarioName",
    "defaultNotes",
    "callbackApplicable",
    "active",
    "configurationFlag",
  ];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  dataSource: MatTableDataSource<ScenarioMaster>;

  scenariosSubject: BehaviorSubject<ScenarioMaster[]> = new BehaviorSubject(
    null
  );
  initialValues: any;

  constructor(
    private formBuilder: FormBuilder,
    private scenarioOperationService: ScenarioOperationsService,
    private dialogService: DialogService
  ) {
    this.formGroup = this.formBuilder.group({
      aScenario: this.aScenarioControl,
      aNotes: this.aNotesControl,
      aCallback: this.aCallback,
      aActive: this.aActiveControl,
    });

    this.scenariosSubject.asObservable().subscribe((data: ScenarioMaster[]) => {
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
        console.log(data);
        this.dataSource.paginator = this.paginator;
      }
    });
  }

  ngOnInit() {
    this.currClientName = AppComponent.getCurrentClient().clientName;
    this.getScenarioCodeData();
    this.initialValues = this.formGroup.value;
    // this.aActiveControl= Y;
  }

  onAdd() {
    if (this.formGroup.invalid) {
      return;
    }
    this.loading = true;
    this.scenarioOperationService
      .addScenario(this.createAdd(this.formGroup))
      .subscribe(
        (data) => {
          this.ngOnInit();
          this.dialogService.openSuccessModal(" Scenario  Added Successfully");
          // this.formGroup.reset();
          this.setInitialValues();
          this.formGroup.reset(this.initialValues);
          this.loading = false;
        },
        (error) => {
          this.dialogService.openErrorModal("Scenario Code already exists.");
          // this.formGroup.reset();
          this.setInitialValues();
          this.formGroup.reset(this.initialValues);
          this.loading = false;
        }
      );
  }
  setInitialValues() {
    this.initialValues.aScenario = null;
    this.initialValues.aNotes = null;
    this.initialValues.aCallback = "Y";
    this.initialValues.aActive = "Y";
  }

  onAction(obj: ScenarioMaster) {
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

      this.scenarioOperationService
        .updateScenario(this.processData(obj))
        .subscribe(
          (data) => {
            this.ngOnInit(); // reset table
            this.editvariable = true;
            this.dialogService.openSuccessModal(
              "Scenario Updated successfully"
            );
          },
          (error) => {
            this.dialogService.openErrorModal("Scenario Update failed");
            this.ngOnInit(); // reset table
          }
        );
    }
  }
  onclose(obj: ScenarioMaster) {
    obj.configurationFlag = false; // Update
    this.ngOnInit();
  }

  private getScenarioCodeData() {
    this.scenarioOperationService
      .getAllScenario(AppComponent.getCurrentClient().clientId)
      .subscribe(
        (data) => {
          this.handleScenario(data).subscribe(
            (result) => this.scenariosSubject.next(result),
            (error) => {
              this.dialogService.openWarningModal("No Scenarios available");
            }
          );
        },
        (error) => {
          this.dialogService.openErrorModal("Scenario Code Failed Retrieval");
        }
      );
  }

  private handleScenario(data: ScenarioMaster[]): Observable<ScenarioMaster[]> {
    let obsObj = new Observable<ScenarioMaster[]>((obs) => {
      const proData: ScenarioMaster[] = [];
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
        if (obj.hasOwnProperty("scenarioID")) {
          this.scenarioOperationService
            .getScenarioByClient(
              AppComponent.getCurrentClient().clientId,
              obj.scenarioID
            )
            .subscribe((asyncObj: ScenarioMaster) => {
              if (asyncObj) {
                proData.push(asyncObj);
              }
              obs.next(proData);
            });
        }
      });
    });
    return obsObj;
  }

  private processData(obj: ScenarioMaster): ScenarioMaster {
    obj.active = obj.uiActive ? "Y" : "N";
    delete obj.uiActive;
    delete obj.configurationFlag;
    return obj;
  }

  private createAdd(formGroup: FormGroup): ScenarioMaster {
    let obj: ScenarioMaster = new Object();
    obj.clientId = AppComponent.getCurrentClient().clientId;
    obj.clientName = AppComponent.getCurrentClient().clientName;
    obj.scenarioName = formGroup.value.aScenario;
    obj.defaultNotes = formGroup.value.aNotes;
    obj.callbackApplicable = formGroup.value.aCallback;
    obj.active = formGroup.value.aActive;
    return obj;
  }
}
