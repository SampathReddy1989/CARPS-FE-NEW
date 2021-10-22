import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { MatPaginator, MatTableDataSource } from "@angular/material";
import { BehaviorSubject } from "rxjs";
import { AppComponent } from "src/app/app.component";
import { ClientDetail } from "src/app/models/client-detail";
import { ClientMappingService } from "src/app/services/client/client-mapping.service";
import { DialogService } from "src/app/services/dialog/dialog.service";

@Component({
  selector: "app-client",
  templateUrl: "./client.component.html",
  styleUrls: ["./client.component.scss"],
})
export class ClientComponent implements OnInit {
  formGroup: FormGroup;
  cNameControl: FormControl = new FormControl();
  cTimezoneControl: FormControl = new FormControl();
  cActiveControl: FormControl = new FormControl("Y");
  editvariable = true;
  onedit: boolean;

  clientTimeZones: string[];

  loading = false;
  displayedColumns = ["clientName", "timeZone", "active", "configurationFlag"];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  dataSource: MatTableDataSource<ClientDetail>;

  clientSubject: BehaviorSubject<ClientDetail[]> = new BehaviorSubject(null);
  initialValues: any;

  constructor(
    private formBuilder: FormBuilder,
    private clientMappingService: ClientMappingService,
    private dialogService: DialogService
  ) {
    this.clientTimeZones = ["IST", "EST", "MST", "PST", "CST"];
    this.formGroup = this.formBuilder.group({
      cName: this.cNameControl,
      cTimezone: this.cTimezoneControl,
      cActive: this.cActiveControl,
    });

    this.clientSubject.asObservable().subscribe((data: ClientDetail[]) => {
      if (data) {
        data.forEach((client) =>
          Object.defineProperty(client, "uiActive", {
            value: client.active === "Y",
            writable: true,
            configurable: true,
            enumerable: true,
          })
        );
        data.forEach((client) =>
          Object.defineProperty(client, "configurationFlag", {
            value: "0",
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
    this.getClientData();
    this.onedit = true;
    this.initialValues = this.formGroup.value;
  }

  onAdd() {
    if (this.formGroup.invalid) {
      return;
    }
    this.loading = true;
    this.clientMappingService
      .addClient(this.createAdd(this.formGroup))
      .subscribe(
        (data) => {
          this.formGroup.reset();
          this.ngOnInit();
          this.setInitialValues();
          this.formGroup.reset(this.initialValues);
          this.dialogService.openSuccessModal("Client  added successfully");

          this.loading = false;
        },
        (error) => {
          this.dialogService.openErrorModal("Client already exists.");
          this.setInitialValues();
          this.formGroup.reset(this.initialValues);
          this.loading = false;
        }
      );
  }
  setInitialValues() {
    this.initialValues.cName = null;
    this.initialValues.cTimezone = null;
    this.initialValues.cActive = "Y";
  }

  onAction(clDtl: ClientDetail) {
    if (clDtl.configurationFlag === "0") {
      this.dataSource.data.map((ele, index) => {
        if (ele.configurationFlag == "1") {
          ele.configurationFlag = "0";
        }
      });
      clDtl.configurationFlag = "1";
      this.editvariable = false;
    } else {
      clDtl.configurationFlag = "0"; // Update

      this.clientMappingService.updateClient(this.processData(clDtl)).subscribe(
        (data) => {
          this.ngOnInit(); // reset table
          this.dialogService.openSuccessModal("Client Update successfully.");
        },
        (error) => {
          this.dialogService.openErrorModal("Client Update failed.");
          this.getClientData(); // reset table
        }
      );
    }
  }
  onclose(clDtl: ClientDetail) {
    clDtl.configurationFlag = "0"; // Update
    this.getClientData(); // reset table
  }

  private getClientData() {
    this.clientMappingService
      .getAllClientDetails(AppComponent.getCurrentClient().clientId)
      .subscribe(
        (data: ClientDetail[]) => {
          this.clientSubject.next(data);
        },
        (error) => {
          this.dialogService.openErrorModal("Clients Data Failed Retrieving.");
        }
      );
  }

  private processData(obj: ClientDetail): ClientDetail {
    obj.active = obj.uiActive ? "Y" : "N";
    delete obj.uiActive;
    delete obj.configurationFlag;
    return obj;
  }

  private createAdd(formGroup: FormGroup): ClientDetail {
    let obj: ClientDetail = new Object();
    obj.clientName = formGroup.value.cName;
    obj.timeZone = formGroup.value.cTimezone;
    obj.active = formGroup.value.cActive;
    return obj;
  }
}
